import { ResumeData, ItemType, AllItems } from '@/types';

// Updated DataManager to use filesystem via API routes
class DataManager {
  private data: ResumeData;
  private initialized: boolean = false;
  
  constructor() {
    this.data = {
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

  // Export/Import functionality
  async exportData(): Promise<string> {
    await this.initializeData();
    return JSON.stringify(this.data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
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
        this.data = parsed;
        await this.saveData();
        return true;
      }
      return false;
    } catch {
      return false;
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
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;
