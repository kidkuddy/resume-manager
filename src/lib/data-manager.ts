import { ResumeData, ItemType, AllItems, Education, Skill, Activity, Profile } from '@/types';

// Updated DataManager to use filesystem via API routes
class DataManager {
  private data: ResumeData;
  private initialized: boolean = false;
  
  constructor() {
    this.data = {
      profile: undefined,
      experiences: [],
      projects: [],
      certifications: [],
      activities: [],
      skills: [],
      education: [],
      templates: []
    };
  }

  private async initializeData(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        this.data = await response.json();
      }
    } catch (error) {
      console.error('Failed to load data from server:', error);
      // Fallback to localStorage if available
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('resumeData');
        if (stored) {
          this.data = JSON.parse(stored);
        }
      }
    }
    
    this.initialized = true;
  }

  private async saveData(): Promise<void> {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save data to server');
      }
    } catch (error) {
      console.error('Failed to save data to server:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('resumeData', JSON.stringify(this.data));
      }
    }
  }

  // Generic CRUD operations
  async getAllItems<T extends AllItems>(type: ItemType): Promise<T[]> {
    await this.initializeData();
    return this.data[type] as T[];
  }

  async getItemById<T extends AllItems>(type: ItemType, id: string): Promise<T | undefined> {
    await this.initializeData();
    return this.data[type].find(item => item.id === id) as T | undefined;
  }

  async createItem<T extends AllItems>(type: ItemType, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    await this.initializeData();
    
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    (this.data[type] as T[]).push(newItem);
    await this.saveData();
    return newItem;
  }

  async updateItem<T extends AllItems>(type: ItemType, id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    await this.initializeData();
    
    const index = this.data[type].findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.data[type][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;

    this.data[type][index] = updatedItem;
    await this.saveData();
    return updatedItem;
  }

  async deleteItem(type: ItemType, id: string): Promise<boolean> {
    await this.initializeData();
    
    const index = this.data[type].findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data[type].splice(index, 1);
    await this.saveData();
    return true;
  }

  // Search and filter
  async searchItems<T extends AllItems>(type: ItemType, query: string): Promise<T[]> {
    await this.initializeData();
    
    const items = this.data[type] as T[];
    const lowercaseQuery = query.toLowerCase();
    
    return items.filter(item => {
      const hasTitle = 'title' in item && typeof item.title === 'string';
      const hasDescription = 'description' in item && typeof item.description === 'string';
      const hasTags = 'tags' in item && Array.isArray(item.tags);
      
      return (
        (hasTitle && item.title.toLowerCase().includes(lowercaseQuery)) ||
        (hasDescription && item.description?.toLowerCase().includes(lowercaseQuery)) ||
        (hasTags && item.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });
  }

  async filterItemsByTags<T extends AllItems>(type: ItemType, tags: string[]): Promise<T[]> {
    await this.initializeData();
    
    const items = this.data[type] as T[];
    if (tags.length === 0) return items;
    
    return items.filter(item => {
      const hasTags = 'tags' in item && Array.isArray(item.tags);
      return hasTags && tags.some(tag => (item.tags as string[]).includes(tag));
    });
  }

  async getAllTags(type?: ItemType): Promise<string[]> {
    await this.initializeData();
    
    let allItems: AllItems[] = [];
    
    if (type) {
      allItems = this.data[type];
    } else {
      // Get tags from all types
      Object.values(this.data).flat().forEach(item => {
        if (Array.isArray(item)) {
          allItems = allItems.concat(item);
        }
      });
    }

    const tagSet = new Set<string>();
    allItems.forEach(item => {
      if ('tags' in item && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort();
  }

  // Profile management
  async getProfile(): Promise<Profile | undefined> {
    await this.initializeData();
    return this.data.profile;
  }

  async createProfile(profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    await this.initializeData();
    
    const now = new Date().toISOString();
    const profile: Profile = {
      ...profileData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    this.data.profile = profile;
    await this.saveData();
    return profile;
  }

  async updateProfile(updates: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<Profile | undefined> {
    await this.initializeData();
    
    if (!this.data.profile) {
      return undefined;
    }

    const updatedProfile: Profile = {
      ...this.data.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.profile = updatedProfile;
    await this.saveData();
    return updatedProfile;
  }

  async deleteProfile(): Promise<boolean> {
    await this.initializeData();
    
    if (!this.data.profile) {
      return false;
    }

    this.data.profile = undefined;
    await this.saveData();
    return true;
  }

  // Export/Import functionality
  async exportData(): Promise<string> {
    await this.initializeData();
    return JSON.stringify(this.data, null, 2);
  }

  async importData(jsonData: string, mode: 'override' | 'merge' = 'override'): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonData) as ResumeData;
      
      // Basic validation
      if (typeof parsed === 'object' && 
          Array.isArray(parsed.experiences) &&
          Array.isArray(parsed.projects) &&
          Array.isArray(parsed.certifications) &&
          Array.isArray(parsed.activities) &&
          Array.isArray(parsed.skills) &&
          Array.isArray(parsed.education) &&
          Array.isArray(parsed.templates)) {
        
        await this.initializeData();
        
        if (mode === 'override') {
          // Replace all data
          this.data = parsed;
        } else {
          // Merge data
          this.data = this.mergeResumeData(this.data, parsed);
        }
        
        await this.saveData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private mergeResumeData(existing: ResumeData, incoming: ResumeData): ResumeData {
    const merged: ResumeData = {
      experiences: [...existing.experiences],
      projects: [...existing.projects],
      certifications: [...existing.certifications],
      activities: [...existing.activities],
      skills: [...existing.skills],
      education: [...existing.education],
      templates: [...existing.templates]
    };

    // Helper function to merge arrays by ID, avoiding duplicates
    const mergeArrays = <T extends AllItems>(existingArray: T[], incomingArray: T[]): T[] => {
      const existingIds = new Set(existingArray.map(item => item.id));
      const uniqueIncoming = incomingArray.filter(item => !existingIds.has(item.id));
      return [...existingArray, ...uniqueIncoming];
    };

    // Merge each section
    merged.experiences = mergeArrays(merged.experiences, incoming.experiences);
    merged.projects = mergeArrays(merged.projects, incoming.projects);
    merged.certifications = mergeArrays(merged.certifications, incoming.certifications);
    merged.activities = mergeArrays(merged.activities, incoming.activities);
    merged.skills = mergeArrays(merged.skills, incoming.skills);
    merged.education = mergeArrays(merged.education, incoming.education);
    merged.templates = mergeArrays(merged.templates, incoming.templates);

    return merged;
  }

  async getImportPreview(jsonData: string): Promise<{
    isValid: boolean;
    summary?: {
      experiences: number;
      projects: number;
      certifications: number;
      activities: number;
      skills: number;
      education: number;
      templates: number;
    };
    conflicts?: {
      type: ItemType;
      existing: string;
      incoming: string;
    }[];
  }> {
    try {
      const parsed = JSON.parse(jsonData) as ResumeData;
      
      // Validate structure
      if (typeof parsed !== 'object' || 
          !Array.isArray(parsed.experiences) ||
          !Array.isArray(parsed.projects) ||
          !Array.isArray(parsed.certifications) ||
          !Array.isArray(parsed.activities) ||
          !Array.isArray(parsed.skills) ||
          !Array.isArray(parsed.education) ||
          !Array.isArray(parsed.templates)) {
        return { isValid: false };
      }

      await this.initializeData();
      
      // Generate summary
      const summary = {
        experiences: parsed.experiences.length,
        projects: parsed.projects.length,
        certifications: parsed.certifications.length,
        activities: parsed.activities.length,
        skills: parsed.skills.length,
        education: parsed.education.length,
        templates: parsed.templates.length,
      };

      // Check for ID conflicts
      const conflicts: { type: ItemType; existing: string; incoming: string }[] = [];
      
      const checkConflicts = (type: ItemType, existingItems: AllItems[], incomingItems: AllItems[]) => {
        const existingIds = new Set(existingItems.map(item => item.id));
        incomingItems.forEach(item => {
          if (existingIds.has(item.id)) {
            const existing = existingItems.find(e => e.id === item.id);
            const getItemName = (item: AllItems): string => {
              if ('title' in item && item.title) return item.title;
              if ('name' in item && item.name) return item.name;
              return `${type} item`;
            };
            conflicts.push({
              type,
              existing: existing ? getItemName(existing) : `${type} item`,
              incoming: getItemName(item)
            });
          }
        });
      };

      checkConflicts('experiences', this.data.experiences, parsed.experiences);
      checkConflicts('projects', this.data.projects, parsed.projects);
      checkConflicts('certifications', this.data.certifications, parsed.certifications);
      checkConflicts('activities', this.data.activities, parsed.activities);
      checkConflicts('skills', this.data.skills, parsed.skills);
      checkConflicts('education', this.data.education, parsed.education);
      checkConflicts('templates', this.data.templates, parsed.templates);

      return {
        isValid: true,
        summary,
        conflicts
      };
    } catch {
      return { isValid: false };
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Synchronous methods for backward compatibility (will automatically initialize)
  getAllItemsSync<T extends AllItems>(type: ItemType): T[] {
    return this.data[type] as T[];
  }

  getAllTagsSync(type?: ItemType): string[] {
    let allItems: AllItems[] = [];
    
    if (type) {
      allItems = this.data[type];
    } else {
      Object.values(this.data).flat().forEach(item => {
        if (Array.isArray(item)) {
          allItems = allItems.concat(item);
        }
      });
    }

    const tagSet = new Set<string>();
    allItems.forEach(item => {
      if ('tags' in item && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort();
  }

  searchItemsSync<T extends AllItems>(type: ItemType, query: string): T[] {
    const items = this.data[type] as T[];
    const lowercaseQuery = query.toLowerCase();
    
    return items.filter(item => {
      const hasTitle = 'title' in item && typeof item.title === 'string';
      const hasDescription = 'description' in item && typeof item.description === 'string';
      const hasTags = 'tags' in item && Array.isArray(item.tags);
      
      return (
        (hasTitle && item.title.toLowerCase().includes(lowercaseQuery)) ||
        (hasDescription && item.description?.toLowerCase().includes(lowercaseQuery)) ||
        (hasTags && item.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });
  }

  exportDataSync(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Convenience methods for education
  async getAllEducation() {
    return this.getAllItems<Education>('education');
  }

  async addEducation(education: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.createItem<Education>('education', education);
  }

  async updateEducation(id: string, updates: Partial<Omit<Education, 'id' | 'createdAt'>>) {
    return this.updateItem<Education>('education', id, updates);
  }

  async deleteEducation(id: string) {
    return this.deleteItem('education', id);
  }

  // Convenience methods for skills
  async getAllSkills() {
    return this.getAllItems<Skill>('skills');
  }

  async addSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.createItem<Skill>('skills', skill);
  }

  async updateSkill(id: string, updates: Partial<Omit<Skill, 'id' | 'createdAt'>>) {
    return this.updateItem<Skill>('skills', id, updates);
  }

  async deleteSkill(id: string) {
    return this.deleteItem('skills', id);
  }

  // Convenience methods for activities
  async getAllActivities() {
    return this.getAllItems<Activity>('activities');
  }

  async addActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.createItem<Activity>('activities', activity);
  }

  async updateActivity(id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>) {
    return this.updateItem<Activity>('activities', id, updates);
  }

  async deleteActivity(id: string) {
    return this.deleteItem('activities', id);
  }
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;
