
import React, { useState } from 'react';
import { Users, Send, AlertCircle } from 'lucide-react';
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
  const [errors, setErrors] = useState<{email?: string}>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {email?: string} = {};
    let isValid = true;
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
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
      
      // Track waitlist join in analytics
      if (window.gtag) {
        window.gtag('event', 'join_waitlist', {
          has_subscribed: isSubscribed
        });
      }
      
      setIsSubmitting(false);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you soon!",
      });
      setEmail('');
      setName('');
      setErrors({});
    } catch (error: any) {
      setIsSubmitting(false);
      const errorMessage = error?.response?.data?.message || "We couldn't add you to the waitlist. Please try again.";
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  return (
    <section className="bg-gradient-to-br from-jam3a-purple to-jam3a-accent py-8 sm:py-10 md:py-14 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full"></div>
        <div className="absolute top-40 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-[40%] w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-white shadow-jam3a animate-float">
            <Users className="h-6 sm:h-8 w-6 sm:w-8 text-jam3a-purple" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white md:text-4xl mb-2 sm:mb-3">
            Join the Jam3a Revolution
          </h2>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-white/90">
            Be among the first to experience the future of group buying in Saudi Arabia.
            Sign up now to receive exclusive early access and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
            <div className="grid gap-3 sm:gap-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  className={`h-10 sm:h-12 w-full bg-white/95 placeholder-gray-500 border-white/30 focus-visible:ring-white mb-2 sm:mb-3`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Your name (optional)"
                  id="waitlist-name"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-grow">
                  <div className="flex flex-col gap-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className={`h-10 sm:h-12 w-full bg-white/95 placeholder-gray-500 border-white/30 focus-visible:ring-white ${errors.email ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({...errors, email: undefined});
                        }
                      }}
                      required
                      aria-label="Your email address"
                      aria-required="true"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      id="waitlist-email"
                    />
                    {errors.email && (
                      <div className="text-red-100 text-xs flex items-center gap-1 mt-1" id="email-error" role="alert">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-10 sm:h-12 bg-white font-semibold text-jam3a-purple hover:bg-white/90 transition-colors relative"
                  disabled={isSubmitting}
                  aria-label="Join Waitlist"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Join Waitlist <Send className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 rounded-md group-hover:opacity-100"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-white/90 justify-center text-sm">
                <Checkbox 
                  id="subscribe" 
                  checked={isSubscribed}
                  onCheckedChange={(checked) => setIsSubscribed(checked as boolean)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-jam3a-purple"
                  aria-label="Subscribe to newsletter"
                  aria-describedby="subscribe-label"
                />
                <Label htmlFor="subscribe" id="subscribe-label" className="text-white cursor-pointer">
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
