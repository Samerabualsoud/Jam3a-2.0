
import React, { useState } from 'react';
import { Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import EmailService from '@/services/EmailService';

const JoinWaitlist = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email is required",
        description: "Please enter your email address to join the waitlist.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add to waitlist
      const waitlistResult = await EmailService.sendWaitlistEmail(email, name);
      
      // Subscribe to newsletter if checked
      if (isSubscribed) {
        await EmailService.subscribeToNewsletter(email, name);
      }
      
      setIsSubmitting(false);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you soon!",
      });
      setEmail('');
      setName('');
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Something went wrong",
        description: "We couldn't add you to the waitlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="bg-gradient-to-br from-jam3a-purple to-jam3a-accent py-10 md:py-14 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full"></div>
        <div className="absolute top-40 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-[40%] w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-jam3a animate-float">
            <Users className="h-8 w-8 text-jam3a-purple" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-3">
            Join the Jam3a Revolution
          </h2>
          <p className="mt-3 text-lg text-white/90">
            Be among the first to experience the future of group buying in Saudi Arabia.
            Sign up now to receive exclusive early access and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid gap-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  className="h-12 w-full bg-white/95 placeholder-gray-500 border-white/30 focus-visible:ring-white mb-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-12 w-full bg-white/95 placeholder-gray-500 border-white/30 focus-visible:ring-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-white font-semibold text-jam3a-purple hover:bg-white/90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Join Waitlist <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-white/90 justify-center text-sm">
                <Checkbox 
                  id="subscribe" 
                  checked={isSubscribed}
                  onCheckedChange={(checked) => setIsSubscribed(checked as boolean)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-jam3a-purple"
                />
                <Label htmlFor="subscribe" className="text-white cursor-pointer">
                  Send me exclusive offers and updates about Jam3a
                </Label>
              </div>
            </div>
          </form>
          
          <p className="mt-4 text-sm text-white/70">
            By joining, you agree to receive updates from Jam3a. 
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinWaitlist;
