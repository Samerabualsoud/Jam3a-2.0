import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// This component will display website content managed from the admin panel
const WebsiteContent = ({ contentType }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we're using localStorage with mock data fallback
    const loadContent = () => {
      setIsLoading(true);
      
      try {
        const savedContent = localStorage.getItem(`jam3a_content_${contentType}`);
        
        if (savedContent) {
          setContent(JSON.parse(savedContent));
        } else {
          // Mock data based on content type
          let mockContent;
          
          switch (contentType) {
            case 'about':
              mockContent = {
                title: 'About Jam3a',
                content: 'Jam3a is a social shopping platform where people team up to get better prices on products. Our mission is to make group buying accessible to everyone, helping consumers save money while creating a fun, social shopping experience.',
                lastUpdated: new Date().toISOString()
              };
              break;
            case 'faq':
              mockContent = {
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
              };
              break;
            case 'how-it-works':
              mockContent = {
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
              };
              break;
            default:
              mockContent = {
                title: 'Content Not Found',
                content: 'The requested content is not available.',
                lastUpdated: new Date().toISOString()
              };
          }
          
          setContent(mockContent);
          localStorage.setItem(`jam3a_content_${contentType}`, JSON.stringify(mockContent));
        }
      } catch (error) {
        console.error(`Error loading ${contentType} content:`, error);
        toast({
          title: 'Error',
          description: `Failed to load ${contentType} content. Please try again.`,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
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
              {content.faqs.map((faq, index) => (
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
              {content.steps.map((step, index) => (
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
