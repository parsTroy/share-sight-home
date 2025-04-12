
import { Footer } from "@/components/landing/Footer";
import { LandingHeader } from "@/components/LandingHeader";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Dividnd service, you agree to be bound by these Terms of Service. 
            If you do not agree to all the terms and conditions, you may not access or use our services.
          </p>
          
          <h2>2. Description of Service</h2>
          <p>
            Dividnd provides tools and resources for dividend portfolio tracking and management. 
            We reserve the right to modify, suspend, or discontinue any part of the service at any time.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features, you may need to create an account. You are responsible for 
            maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          
          <h2>4. Subscription and Payments</h2>
          <p>
            Certain features of the service may require a paid subscription. All payments are processed 
            securely. Subscription fees are non-refundable except where required by law.
          </p>
          
          <h2>5. User Data</h2>
          <p>
            We respect your privacy and are committed to protecting your personal data. Please review 
            our Privacy Policy for more information on how we collect, use, and share your data.
          </p>
          
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Dividnd service are owned by Dividnd and 
            are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          
          <h2>7. Limitation of Liability</h2>
          <p>
            Dividnd shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages resulting from your use or inability to use the service.
          </p>
          
          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the jurisdiction in which Dividnd is established, 
            without regard to its conflict of law provisions.
          </p>
          
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant 
            changes through the service or by other means.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at 
            <a href="mailto:support@dividnd.com" className="text-primary hover:underline"> support@dividnd.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
