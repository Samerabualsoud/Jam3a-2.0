import React, { useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This component will display website content managed from the admin panel
// It uses the ContentContext for direct sync with the admin panel
const EnhancedWebsiteContent = ({ contentType }) => {
  const { getContentByType, refreshContent, isLoading } = useContent();
  
  // Refresh content on component mount
  useEffect(() => {
    refreshContent();
  }, [refreshContent]);
  
  // Get content for the specified type
  const content = getContentByType(contentType);
  
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
      
    case 'home':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>Last updated: {new Date(content.lastUpdated).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Active Banners</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.banners && content.banners
                  .filter(banner => banner.active)
                  .map((banner) => (
                    <div key={banner.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={banner.image} 
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium">{banner.title}</h4>
                      </div>
                    </div>
                  ))}
              </div>
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
              {content.content || 'No content available.'}
            </p>
          </CardContent>
        </Card>
      );
  }
};

export default EnhancedWebsiteContent;
