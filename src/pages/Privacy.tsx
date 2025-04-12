
import { Footer } from "@/components/landing/Footer";
import { LandingHeader } from "@/components/LandingHeader";

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Effective Date: April 12, 2025
          </p>
          
          <p>
            At Dividnd, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our service.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> When you create an account, we collect your name, 
            email address, and other contact information.
          </p>
          <p>
            <strong>Financial Information:</strong> To provide our service, we may collect information 
            about your dividend investments and portfolio holdings.
          </p>
          <p>
            <strong>Usage Information:</strong> We collect data about how you interact with our service, 
            including access times, pages viewed, and features used.
          </p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send notifications, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Prevent fraudulent transactions and enhance security</li>
          </ul>
          
          <h2>3. How We Share Your Information</h2>
          <p>
            We do not sell your personal information. We may share information with:
          </p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Partners with whom we offer co-branded services</li>
            <li>Legal authorities when required by law</li>
          </ul>
          
          <h2>4. Your Choices</h2>
          <p>
            You can access, update, or delete your account information at any time through your account 
            settings. You can also opt out of promotional communications.
          </p>
          
          <h2>5. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access or disclosure.
          </p>
          
          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide 
            you services, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
          
          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to — and processed in — countries other than the country 
            you reside in. These countries may have different data protection laws.
          </p>
          
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new policy on this page and updating the effective date.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at 
            <a href="mailto:support@dividnd.com" className="text-primary hover:underline"> support@dividnd.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
