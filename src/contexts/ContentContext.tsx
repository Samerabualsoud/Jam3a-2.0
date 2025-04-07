import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import contentService from '../services/ContentService';

// Define the Content type
interface ContentItem {
  id: string;
  type: string;
  title: string;
  content?: string;
  faqs?: Array<{question: string, answer: string}>;
  steps?: Array<{title: string, description: string}>;
  banners?: Array<{id: number, title: string, image: string, active: boolean}>;
  lastUpdated: string;
  language?: 'en' | 'ar';
}

// Define the ContentContext type
interface ContentContextType {
  contentItems: ContentItem[];
  getContentByType: (type: string, language?: 'en' | 'ar') => ContentItem | undefined;
  updateContent: (content: ContentItem) => Promise<ContentItem>;
  addContent: (content: Omit<ContentItem, 'id' | 'lastUpdated'>) => Promise<ContentItem>;
  deleteContent: (id: string) => Promise<boolean>;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Create the context with a default value
const ContentContext = createContext<ContentContextType>({
  contentItems: [],
  getContentByType: () => undefined,
  updateContent: async () => ({ id: '', type: '', title: '', lastUpdated: '' }),
  addContent: async () => ({ id: '', type: '', title: '', lastUpdated: '' }),
  deleteContent: async () => false,
  refreshContent: async () => {},
  isLoading: false,
  error: null,
  clearError: () => {}
});

// Define props for ContentProvider
interface ContentProviderProps {
  children: ReactNode;
}

// Initial content data (fallback if API fails)
const initialContent: ContentItem[] = [
  {
    id: '1',
    type: 'about',
    title: 'About Jam3a',
    content: 'Jam3a is a social shopping platform where people team up to get better prices on products. Our mission is to make group buying accessible to everyone, helping consumers save money while creating a fun, social shopping experience.',
    lastUpdated: new Date().toISOString(),
    language: 'en'
  },
  {
    id: '2',
    type: 'faq',
    title: 'Frequently Asked Questions',
    faqs: [
      { 
        question: 'What is Jam3a?', 
        answer: 'Jam3a is a social shopping platform where people team up to get better prices on products.' 
      },
      { 
        question: 'How does a Jam3a deal work?', 
        answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.' 
      },
      { 
        question: 'Can I start my own Jam3a?', 
        answer: 'Yes! You can start your own Jam3a by picking a product, setting the group size, and inviting others to join.' 
      }
    ],
    lastUpdated: new Date().toISOString(),
    language: 'en'
  },
  {
    id: '3',
    type: 'how-it-works',
    title: 'How Jam3a Works',
    steps: [
      {
        title: 'Choose a Product',
        description: 'Browse our catalog and select a product you want to buy at a discount.'
      },
      {
        title: 'Start or Join a Jam3a',
        description: 'Create your own group or join an existing one for the product category you want.'
      },
      {
        title: 'Invite Friends',
        description: 'Share your Jam3a with friends and family to reach the group size goal faster.'
      },
      {
        title: 'Complete the Deal',
        description: 'Once enough people join within the time limit, everyone gets the discounted price!'
      }
    ],
    lastUpdated: new Date().toISOString(),
    language: 'en'
  },
  {
    id: '4',
    type: 'home',
    title: 'Home Page Content',
    banners: [
      { id: 1, title: 'Welcome Banner', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', active: true },
      { id: 2, title: 'Summer Sale', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', active: false },
      { id: 3, title: 'New Products', image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', active: false },
    ],
    lastUpdated: new Date().toISOString(),
    language: 'en'
  }
];

// Create the ContentProvider component
export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Initial data load
  useEffect(() => {
    refreshContent();
  }, []);

  // Map backend content to frontend format
  const mapBackendToFrontend = (backendContent: any): ContentItem => {
    // Extract content data based on type
    let contentData: any = {};
    
    if (backendContent.type === 'faq' && backendContent.content) {
      try {
        contentData.faqs = JSON.parse(backendContent.content);
      } catch (e) {
        console.error('Error parsing FAQ content:', e);
      }
    } else if (backendContent.type === 'how-it-works' && backendContent.content) {
      try {
        contentData.steps = JSON.parse(backendContent.content);
      } catch (e) {
        console.error('Error parsing steps content:', e);
      }
    } else if (backendContent.type === 'home' && backendContent.content) {
      try {
        contentData.banners = JSON.parse(backendContent.content);
      } catch (e) {
        console.error('Error parsing banners content:', e);
      }
    } else {
      contentData.content = backendContent.content;
    }
    
    return {
      id: backendContent._id,
      type: backendContent.key,
      title: backendContent.title,
      ...contentData,
      lastUpdated: new Date(backendContent.updatedAt).toISOString(),
      language: backendContent.language
    };
  };

  // Map frontend content to backend format
  const mapFrontendToBackend = (frontendContent: ContentItem) => {
    // Prepare content based on type
    let content = '';
    
    if (frontendContent.type === 'faq' && frontendContent.faqs) {
      content = JSON.stringify(frontendContent.faqs);
    } else if (frontendContent.type === 'how-it-works' && frontendContent.steps) {
      content = JSON.stringify(frontendContent.steps);
    } else if (frontendContent.type === 'home' && frontendContent.banners) {
      content = JSON.stringify(frontendContent.banners);
    } else {
      content = frontendContent.content || '';
    }
    
    return {
      key: frontendContent.type,
      title: frontendContent.title,
      content: content,
      type: frontendContent.type === 'faq' || frontendContent.type === 'how-it-works' ? 'html' : 'text',
      language: frontendContent.language || 'en',
      status: 'published',
      section: frontendContent.type
    };
  };

  // Refresh content from API
  const refreshContent = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from API
      try {
        const response = await contentService.getAllContent();
        
        // Map backend content format to frontend format
        const mappedContent = response.content.map(mapBackendToFrontend);
        
        setContentItems(mappedContent);
        
        // Save to local storage for offline capability
        localStorage.setItem('jam3a_content', JSON.stringify(mappedContent));
        
        return;
      } catch (apiError) {
        console.warn('Failed to load content from API, falling back to local storage:', apiError);
      }
      
      // Fallback to local storage if API fails
      const savedContent = localStorage.getItem('jam3a_content');
      
      if (savedContent) {
        setContentItems(JSON.parse(savedContent));
      } else {
        // Use initial content data if nothing in localStorage
        setContentItems(initialContent);
        localStorage.setItem('jam3a_content', JSON.stringify(initialContent));
      }
    } catch (err) {
      console.error("Error loading content:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get content by type and language
  const getContentByType = (type: string, language: 'en' | 'ar' = 'en'): ContentItem | undefined => {
    return contentItems.find(item => item.type === type && item.language === language);
  };

  // Update existing content
  const updateContent = async (content: ContentItem): Promise<ContentItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map frontend content to backend format
      const backendContent = mapFrontendToBackend(content);
      
      // Call API to update content
      const response = await contentService.updateContent(content.id, backendContent);
      
      // Map the response back to frontend format
      const updatedContent = mapBackendToFrontend(response);
      
      // Update state
      const updatedItems = contentItems.map(item => 
        item.id === content.id ? updatedContent : item
      );
      
      setContentItems(updatedItems);
      
      // Update localStorage for offline capability
      localStorage.setItem('jam3a_content', JSON.stringify(updatedItems));
      
      return updatedContent;
    } catch (err) {
      console.error("Error updating content:", err);
      setError("Failed to update content. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add new content
  const addContent = async (content: Omit<ContentItem, 'id' | 'lastUpdated'>): Promise<ContentItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map frontend content to backend format
      const backendContent = mapFrontendToBackend(content as ContentItem);
      
      // Call API to create content
      const response = await contentService.createContent(backendContent);
      
      // Map the response back to frontend format
      const newContent = mapBackendToFrontend(response);
      
      // Update state
      const updatedItems = [...contentItems, newContent];
      setContentItems(updatedItems);
      
      // Update localStorage for offline capability
      localStorage.setItem('jam3a_content', JSON.stringify(updatedItems));
      
      return newContent;
    } catch (err) {
      console.error("Error adding content:", err);
      setError("Failed to add content. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete content
  const deleteContent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API to delete content
      await contentService.deleteContent(id);
      
      // Update state
      const updatedItems = contentItems.filter(item => item.id !== id);
      setContentItems(updatedItems);
      
      // Update localStorage for offline capability
      localStorage.setItem('jam3a_content', JSON.stringify(updatedItems));
      
      return true;
    } catch (err) {
      console.error("Error deleting content:", err);
      setError("Failed to delete content. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the context value
  return (
    <ContentContext.Provider value={{ 
      contentItems,
      getContentByType,
      updateContent,
      addContent,
      deleteContent,
      refreshContent,
      isLoading,
      error,
      clearError
    }}>
      {children}
    </ContentContext.Provider>
  );
};

// Create a hook to use the content context
export const useContent = () => useContext(ContentContext);
