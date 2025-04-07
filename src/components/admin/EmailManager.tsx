import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Users, Settings, Bell, Edit, Trash, Plus, Search } from 'lucide-react';

const EmailManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to Jam3a Hub!",
      body: "Dear {{name}},\n\nWelcome to Jam3a Hub! We're excited to have you join our community.\n\nWith Jam3a Hub, you can save money on premium products through group buying.\n\nGet started by browsing our active deals or creating your own Jam3a.\n\nBest regards,\nThe Jam3a Hub Team",
      event: "user_registration",
      isActive: true,
      lastModified: "2025-03-28"
    },
    {
      id: 2,
      name: "Waiting List Confirmation",
      subject: "You've joined the waiting list!",
      body: "Dear {{name}},\n\nThank you for joining the waiting list for {{product}}.\n\nWe'll notify you as soon as a new Jam3a group is formed for this product.\n\nBest regards,\nThe Jam3a Hub Team",
      event: "waiting_list",
      isActive: true,
      lastModified: "2025-03-29"
    },
    {
      id: 3,
      name: "Jam3a Join Confirmation",
      subject: "You've joined a Jam3a!",
      body: "Dear {{name}},\n\nCongratulations! You've successfully joined the Jam3a for {{product}}.\n\nCurrent price: {{price}} SAR\nGroup progress: {{progress}}%\n\nWe'll keep you updated as more people join and the price drops further.\n\nBest regards,\nThe Jam3a Hub Team",
      event: "jam3a_join",
      isActive: true,
      lastModified: "2025-03-30"
    },
    {
      id: 4,
      name: "Jam3a Creation Confirmation",
      subject: "You've started a new Jam3a!",
      body: "Dear {{name}},\n\nCongratulations! You've successfully created a new Jam3a for {{product}}.\n\nShare this link with friends to help them join your Jam3a and get better prices: {{link}}\n\nBest regards,\nThe Jam3a Hub Team",
      event: "jam3a_creation",
      isActive: true,
      lastModified: "2025-03-31"
    }
  ]);
  
  // Sample sent emails for logs
  const [sentEmails, setSentEmails] = useState([
    {
      id: 1,
      recipient: "user1@example.com",
      subject: "Welcome to Jam3a Hub!",
      template: "Welcome Email",
      sentDate: "2025-04-01 09:15:22",
      status: "Delivered"
    },
    {
      id: 2,
      recipient: "user2@example.com",
      subject: "Welcome to Jam3a Hub!",
      template: "Welcome Email",
      sentDate: "2025-04-01 10:23:45",
      status: "Delivered"
    },
    {
      id: 3,
      recipient: "user3@example.com",
      subject: "You've joined a Jam3a!",
      template: "Jam3a Join Confirmation",
      sentDate: "2025-04-01 11:05:17",
      status: "Delivered"
    },
    {
      id: 4,
      recipient: "user4@example.com",
      subject: "You've joined the waiting list!",
      template: "Waiting List Confirmation",
      sentDate: "2025-04-01 12:42:33",
      status: "Delivered"
    }
  ]);
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    senderName: "Jam3a Hub",
    senderEmail: "notifications@jam3ahub.com",
    smtpServer: "smtp.jam3ahub.com",
    smtpPort: "587",
    smtpUsername: "notifications@jam3ahub.com",
    smtpPassword: "••••••••••••",
    enableSSL: true,
    sendWelcomeEmail: true,
    sendWaitingListEmail: true,
    sendJam3aJoinEmail: true,
    sendJam3aCreationEmail: true
  });
  
  // Handle template selection for editing
  const handleEditTemplate = (template) => {
    setSelectedTemplate({...template});
    setIsEditing(true);
  };
  
  // Handle template save
  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      // Update existing template
      setEmailTemplates(emailTemplates.map(template => 
        template.id === selectedTemplate.id ? 
        {...selectedTemplate, lastModified: new Date().toISOString().split('T')[0]} : 
        template
      ));
      
      toast({
        title: "Template Saved",
        description: `The "${selectedTemplate.name}" template has been updated.`
      });
      
      setIsEditing(false);
      setSelectedTemplate(null);
    }
  };
  
  // Handle template creation
  const handleCreateTemplate = () => {
    const newTemplate = {
      id: emailTemplates.length + 1,
      name: "New Template",
      subject: "New Email Subject",
      body: "Enter your email content here...",
      event: "custom",
      isActive: true,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };
  
  // Handle template deletion
  const handleDeleteTemplate = (id) => {
    setEmailTemplates(emailTemplates.filter(template => template.id !== id));
    
    toast({
      title: "Template Deleted",
      description: "The email template has been deleted."
    });
  };
  
  // Handle settings save
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Email notification settings have been updated."
    });
  };
  
  // Handle test email
  const handleSendTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to the administrator."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Notifications</h2>
          <p className="text-muted-foreground">Manage email templates and notification settings</p>
        </div>
        <Button onClick={handleSendTestEmail}>
          <Send className="mr-2 h-4 w-4" />
          Send Test Email
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">
            <Mail className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Users className="mr-2 h-4 w-4" />
            Email Logs
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTemplate?.id ? "Edit Email Template" : "Create Email Template"}
                </CardTitle>
                <CardDescription>
                  Customize the email content and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input 
                      id="template-name" 
                      value={selectedTemplate?.name || ""} 
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-event">Event Trigger</Label>
                    <Select 
                      value={selectedTemplate?.event || "custom"}
                      onValueChange={(value) => setSelectedTemplate({...selectedTemplate, event: value})}
                    >
                      <SelectTrigger id="template-event">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_registration">User Registration</SelectItem>
                        <SelectItem value="waiting_list">Waiting List Join</SelectItem>
                        <SelectItem value="jam3a_join">Jam3a Join</SelectItem>
                        <SelectItem value="jam3a_creation">Jam3a Creation</SelectItem>
                        <SelectItem value="custom">Custom Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input 
                    id="template-subject" 
                    value={selectedTemplate?.subject || ""} 
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="template-body">Email Body</Label>
                    <div className="text-sm text-muted-foreground">
                      Available variables: {{name}}, {{product}}, {{price}}, {{progress}}, {{link}}
                    </div>
                  </div>
                  <Textarea 
                    id="template-body" 
                    rows={10}
                    value={selectedTemplate?.body || ""} 
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="template-active"
                    checked={selectedTemplate?.isActive || false}
                    onCheckedChange={(checked) => setSelectedTemplate({...selectedTemplate, isActive: checked})}
                  />
                  <Label htmlFor="template-active">Template is active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setSelectedTemplate(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between">
                <div className="relative w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search templates..."
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Event: {template.event.replace('_', ' ')} • Last modified: {template.lastModified}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm font-medium">Subject: {template.subject}</div>
                      <div className="mt-2 text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                        {template.body}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <div className={`mr-2 h-2 w-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Email Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs</CardTitle>
              <CardDescription>
                View history of sent email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>{email.recipient}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>{email.template}</TableCell>
                        <TableCell>{email.sentDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                            {email.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Sender Name</Label>
                    <Input 
                      id="sender-name" 
                      value={emailSettings.senderName}
                      onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Sender Email</Label>
                    <Input 
                      id="sender-email" 
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input 
                      id="smtp-server" 
                      value={emailSettings.smtpServer}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input 
                      id="smtp-port" 
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input 
                      id="smtp-username" 
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input 
                      id="smtp-password" 
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Switch 
                    id="enable-ssl"
                    checked={emailSettings.enableSSL}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableSSL: checked})}
                  />
                  <Label htmlFor="enable-ssl">Enable SSL/TLS</Label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="welcome-email">Welcome Email</Label>
                      <div className="text-sm text-muted-foreground">
                        Send welcome email when a new user registers
                      </div>
                    </div>
                    <Switch 
                      id="welcome-email"
                      checked={emailSettings.sendWelcomeEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendWelcomeEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="waiting-list-email">Waiting List Email</Label>
                      <div className="text-sm text-muted-foreground">
                        Send confirmation when a user joins a waiting list
                      </div>
                    </div>
                    <Switch 
                      id="waiting-list-email"
                      checked={emailSettings.sendWaitingListEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendWaitingListEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="jam3a-join-email">Jam3a Join Email</Label>
                      <div className="text-sm text-muted-foreground">
                        Send confirmation when a user joins a Jam3a
                      </div>
                    </div>
                    <Switch 
                      id="jam3a-join-email"
                      checked={emailSettings.sendJam3aJoinEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendJam3aJoinEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="jam3a-creation-email">Jam3a Creation Email</Label>
                      <div className="text-sm text-muted-foreground">
                        Send confirmation when a user creates a new Jam3a
                      </div>
                    </div>
                    <Switch 
                      id="jam3a-creation-email"
                      checked={emailSettings.sendJam3aCreationEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendJam3aCreationEmail: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailManager;
