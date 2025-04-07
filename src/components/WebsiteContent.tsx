// Updated WebsiteContent component to fetch real data from API
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

// This component will display website content managed from the admin panel
const WebsiteContent = ({ contentType }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch content from API
    const fetchContent = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching ${contentType} content from:`, `${API_BASE_URL}/content/${contentType}`);
        const response = await apiService.get(`/content/${contentType}`);
        
        if (response && response.data) {
          console.log(`${contentType} content data:`, response.data);
          setContent(response.data);
          
          // Store in localStorage as fallback for offline use
          localStorage.setItem(`jam3a_content_${contentType}`, JSON.stringify(response.data));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error(`Error loading ${contentType} content:`, error);
        
        // Try to load from local storage as fallback
        const savedContent = localStorage.getItem(`jam3a_content_${contentType}`);
        if (savedContent) {
          try {
            setContent(JSON.parse(savedContent));
            toast({
              title: 'Using cached content',
              description: 'Could not connect to server. Showing saved content.',
              variant: 'warning'
            });
          } catch (parseError) {
            console.error('Failed to parse stored content:', parseError);
            setContent(null);
            toast({
              title: 'Error',
              description: `Failed to load ${contentType} content. Please try again.`,
              variant: 'destructive'
            });
          }
        } else {
          setContent(null);
          toast({
            title: 'Error',
            description: `Failed to load ${contentType} content. Please try again.`,
            variant: 'destructive'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [contentType, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
        <p>Loading content...</p>
      </div>
    );
  }
  
  if (!content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            The requested content is not available.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Render different content based on type
  switch (contentType) {
    case 'about':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>Last updated: {new Date(content.lastUpdated).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{content.content}</p>
            </div>
          </CardContent>
        </Card>
      );
      
    case 'faq':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>Last updated: {new Date(content.lastUpdated).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content.faqs && content.faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
      
    case 'how-it-works':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>Last updated: {new Date(content.lastUpdated).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {content.steps && content.steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
      
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-6 text-muted-foreground">
              {content.content}
            </p>
          </CardContent>
        </Card>
      );
  }
};

export default WebsiteContent;
