import apiService from './api';

// Interface for content data
export interface Content {
  _id: string;
  key: string;
  title: string;
  content: string;
  type: 'text' | 'html' | 'image' | 'video' | 'carousel';
  language: 'en' | 'ar';
  status: 'published' | 'draft';
  section: 'home' | 'about' | 'how-it-works' | 'faq' | 'footer' | 'banner';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Interface for content creation/update
export interface ContentInput {
  key: string;
  title: string;
  content: string;
  type: 'text' | 'html' | 'image' | 'video' | 'carousel';
  language: 'en' | 'ar';
  status: 'published' | 'draft';
  section: 'home' | 'about' | 'how-it-works' | 'faq' | 'footer' | 'banner';
  metadata?: Record<string, any>;
}

// Content service for handling content-related API calls
class ContentService {
  private baseUrl = '/content';
  
  // Get all content with optional filtering
  async getAllContent(params?: {
    page?: number;
    limit?: number;
    section?: string;
    type?: string;
    language?: 'en' | 'ar';
    status?: 'published' | 'draft';
    search?: string;
  }): Promise<{ content: Content[], total: number, pages: number }> {
    return apiService.get(this.baseUrl, { params });
  }
  
  // Get content by key
  async getContentByKey(key: string, language: 'en' | 'ar' = 'en'): Promise<Content> {
    return apiService.get(`${this.baseUrl}/key/${key}`, { params: { language } });
  }
  
  // Get content by section
  async getContentBySection(section: string, language: 'en' | 'ar' = 'en'): Promise<Content[]> {
    return apiService.get(`${this.baseUrl}/section/${section}`, { params: { language } });
  }
  
  // Get a single content by ID
  async getContent(id: string): Promise<Content> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }
  
  // Create new content (admin only)
  async createContent(content: ContentInput): Promise<Content> {
    return apiService.post(this.baseUrl, content);
  }
  
  // Update existing content (admin only)
  async updateContent(id: string, content: Partial<ContentInput>): Promise<Content> {
    return apiService.put(`${this.baseUrl}/${id}`, content);
  }
  
  // Delete content (admin only)
  async deleteContent(id: string): Promise<{ success: boolean, message: string }> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }
  
  // Upload content image
  async uploadContentImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiService.uploadFile(`${this.baseUrl}/upload-image`, formData);
  }
  
  // Get content version history (admin only)
  async getContentHistory(id: string): Promise<{
    content: Content;
    versions: {
      _id: string;
      content: string;
      updatedBy: string;
      updatedAt: string;
    }[];
  }> {
    return apiService.get(`${this.baseUrl}/${id}/history`);
  }
  
  // Restore content version (admin only)
  async restoreContentVersion(id: string, versionId: string): Promise<Content> {
    return apiService.post(`${this.baseUrl}/${id}/restore/${versionId}`);
  }
  
  // Bulk update content (admin only)
  async bulkUpdateContent(updates: { id: string; content: Partial<ContentInput> }[]): Promise<{ success: boolean; count: number }> {
    return apiService.put(`${this.baseUrl}/bulk`, { updates });
  }
}

// Create and export a singleton instance
const contentService = new ContentService();
export default contentService;
