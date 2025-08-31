import { ResumeData, ItemType, AllItems } from '@/types';
import resumeData from '@/data/resume.json';

// In a real app, this would handle file I/O
// For now, we'll work with the imported JSON and localStorage for persistence
class DataManager {
  private data: ResumeData;
  
  constructor() {
    this.data = this.loadData();
  }

  private loadData(): ResumeData {
    // Try to load from localStorage first, fallback to imported JSON
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resumeData');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return resumeData as ResumeData;
  }

  private saveData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeData', JSON.stringify(this.data));
    }
  }

  // Generic CRUD operations
  getAllItems<T extends AllItems>(type: ItemType): T[] {
    return this.data[type] as T[];
  }

  getItemById<T extends AllItems>(type: ItemType, id: string): T | undefined {
    return this.data[type].find(item => item.id === id) as T | undefined;
  }

  createItem<T extends AllItems>(type: ItemType, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    (this.data[type] as T[]).push(newItem);
    this.saveData();
    return newItem;
  }

  updateItem<T extends AllItems>(type: ItemType, id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
    const index = this.data[type].findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.data[type][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;

    this.data[type][index] = updatedItem;
    this.saveData();
    return updatedItem;
  }

  deleteItem(type: ItemType, id: string): boolean {
    const index = this.data[type].findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data[type].splice(index, 1);
    this.saveData();
    return true;
  }

  // Search and filter
  searchItems<T extends AllItems>(type: ItemType, query: string): T[] {
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

  filterItemsByTags<T extends AllItems>(type: ItemType, tags: string[]): T[] {
    const items = this.data[type] as T[];
    if (tags.length === 0) return items;
    
    return items.filter(item => {
      const hasTags = 'tags' in item && Array.isArray(item.tags);
      return hasTags && tags.some(tag => (item.tags as string[]).includes(tag));
    });
  }

  getAllTags(type?: ItemType): string[] {
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
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): boolean {
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
        this.saveData();
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
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;
