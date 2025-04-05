import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

// Define the ContentContext type
interface ContentContextType {
  contentItems: ContentItem[];
  getContentByType: (type: string) => ContentItem | undefined;
  updateContent: (content: ContentItem) => Promise<ContentItem>;
  addContent: (content: Omit<ContentItem, 'id' | 'lastUpdated'>) => Promise<ContentItem>;
  deleteContent: (id: string) => Promise<boolean>;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  error: null
});

// Define props for ContentProvider
interface ContentProviderProps {
  children: ReactNode;
}

// Create the ContentProvider component
export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial data load
  useEffect(() => {
    refreshContent();
  }, []);

  // Refresh content from storage/API
  const refreshContent = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we're using localStorage with fallback to initial data
      const savedContent = localStorage.getItem('jam3a_content');
      
      if (savedContent) {
        setContentItems(JSON.parse(savedContent));
      } else {
        // Initial content data
        const initialContent: ContentItem[] = [
          {
            id: '1',
            type: 'about',
            title: 'About Jam3a',
            content: 'Jam3a is a social shopping platform where people team up to get better prices on products. Our mission is to make group buying accessible to everyone, helping consumers save money while creating a fun, social shopping experience.',
            lastUpdated: new Date().toISOString()
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
            lastUpdated: new Date().toISOString()
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
            lastUpdated: new Date().toISOString()
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
            lastUpdated: new Date().toISOString()
          }
        ];
        
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

  // Get content by type
  const getContentByType = (type: string): ContentItem | undefined => {
    return contentItems.find(item => item.type === type);
  };

  // Update existing content
  const updateContent = async (content: ContentItem): Promise<ContentItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the content with current timestamp
      const updatedContent = {
        ...content,
        lastUpdated: new Date().toISOString()
      };
      
      // Find and update the content
      const updatedItems = contentItems.map(item => 
        item.id === content.id ? updatedContent : item
      );
      
      // Update state and localStorage
      setContentItems(updatedItems);
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
      // Generate a new ID
      const newId = (Math.max(0, ...contentItems.map(c => parseInt(c.id))) + 1).toString();
      
      // Create the new content
      const newContent: ContentItem = {
        ...content,
        id: newId,
        lastUpdated: new Date().toISOString()
      };
      
      // Update state and localStorage
      const updatedItems = [...contentItems, newContent];
      setContentItems(updatedItems);
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
      // Filter out the content
      const updatedItems = contentItems.filter(item => item.id !== id);
      
      // Update state and localStorage
      setContentItems(updatedItems);
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
      error
    }}>
      {children}
    </ContentContext.Provider>
  );
};

// Create a hook to use the content context
export const useContent = () => useContext(ContentContext);
