import React from 'react';
import "../styles/TermsAndConditionsPopup.css"; // Make sure to create and style this CSS file

const TermsAndConditionsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="terms-popup-overlay">
      <div className="terms-popup">
        <h2>Terms and Conditions</h2>
        <div className="terms-content"> 
  <p>Welcome to our subscription service.you agree to the following terms and conditions:</p>

  <p className='subscription1244'><strong>Subscription Duration:</strong> The subscription period is one year (365 days) from the date of activation, ensuring continuous access to all our premium services.</p>
  <p><strong>Renewal&nbsp;:&nbsp;</strong> At the end of the subscription period, you must renew your subscription to continue using our services. We will notify you 30 days before the subscription end date to facilitate timely renewal.</p>
  <p><strong>Payment Terms&nbsp;:&nbsp;</strong> The full subscription fee must be paid in advance. The fee is non-refundable, even if you cancel your subscription before the end of the subscription period.</p>
  <p><strong>Automatic Deactivation&nbsp;:&nbsp;</strong> If the subscription is not renewed by the end of the subscription period, your access to the services will be automatically deactivated.</p>
  <p><strong>Service Availability&nbsp;:&nbsp;</strong> We strive to ensure the availability of our services at all times. However, we do not guarantee uninterrupted or error-free service and will not be liable for any interruptions or errors.</p>
  <p><strong>Changes to Services&nbsp;:&nbsp;</strong> We reserve the right to modify, suspend, or discontinue any part of our services at any time. We will notify you of any significant changes that may affect your use of the services.</p>
  <p><strong>Account Security&nbsp;:&nbsp;</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized use of your account.</p>
  <p><strong>User Conduct:</strong> You agree to use the services in compliance with all applicable laws and regulations. Any misuse of the services, including but not limited to illegal activities, spamming, will result in immediate termination of your subscription without refund.</p>
  <p><strong>Intellectual Property&nbsp;:&nbsp;</strong> All content, trademarks, and data on our platform are owned by us or our licensors. You are granted a limited, non-exclusive, non-transferable license to use the services for personal or business purposes.</p>
  <p><strong>Privacy Policy&nbsp;:&nbsp;</strong> Your use of the services is also governed by our Privacy Policy, which is incorporated by reference into these terms and conditions.</p>
  <p><strong>Limitation of Liability&nbsp;:&nbsp;</strong> We are not liable for indirect, incidental, special, consequential, or punitive damages, loss of profits, revenues, data, use, goodwill, or other intangible losses resulting from your use of the services.</p>
 <p><strong>Indemnification&nbsp;:&nbsp;</strong> You agree to indemnify and hold us harmless from any claims, liabilities, damages, losses, and expenses, including legal fees, arising out of your use of the services or violation of these terms.</p>
  <p><strong>Governing Law&nbsp;:&nbsp;</strong> These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is headquartered, without regard to its conflict of law principles.</p>
  <p><strong>Dispute Resolution&nbsp;:&nbsp;</strong> Any disputes arising from these terms and conditions or your use of the services shall be resolved through binding arbitration, in accordance with the rules of the arbitration association in our jurisdiction.</p>
  <p><strong>Entire Agreement&nbsp;:&nbsp;</strong> These terms and conditions, together with our Privacy Policy and any other legal notices published by us, constitute the entire agreement between you and us regarding the services.</p>
  <p><strong>Waiver and Severability&nbsp;:&nbsp;</strong> Our failure to enforce any right or provision of these terms and conditions will not be considered a waiver of those rights. If any provision of these terms and conditions is held to be invalid or unenforceable, the remaining provisions will remain in effect.</p>
  <p><strong>Contact Information&nbsp;:&nbsp;</strong> For any questions about these terms and conditions, please contact our customer support team.</p>
  <p><strong>Modification of Terms&nbsp;:&nbsp;</strong> We reserve the right to modify these terms and conditions at any time. We will notify you of any changes by posting the new terms on our platform. Your continued use of the services after the changes take effect constitutes your acceptance of the new terms.</p>
  <p><strong>Termination&nbsp;:&nbsp;</strong> We reserve the right to terminate your subscription at our sole discretion if you violate any of these terms and conditions.</p>
  <p><strong>Force Majeure&nbsp;:&nbsp;</strong> We will not be liable for any failure or delay in the performance of our obligations due to events beyond our reasonable control, including but not limited to natural disasters, acts of terrorism, or internet outages.</p>
</div>

<button onClick={onClose} className="close-button">Close</button>

      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
