import React from 'react';

const Privacy = () => {
  return (
    <div className="w-full max-w-[850px] mx-auto space-y-6 pt-4 pb-6 px-4">
      <h2 className="text-2xl font-semibold">Privacy Policy</h2>

      <p>
        We respect your privacy and are committed to protecting your information while you use this platform.
      </p>

      <h3 className="font-medium mt-4">Information We Collect</h3>
      <ul className="list-decimal list-inside space-y-1">
        <li>Basic details you provide such as name, email, or profile information.</li>
        <li>Project and task data that you create or manage within the application.</li>
        <li>Technical details (browser type, activity timestamps) that may be collected automatically.</li>
      </ul>

      <h3 className="font-medium mt-4">How We Use Information</h3>
      <ul className="list-decimal list-inside space-y-1">
        <li>To provide access to the platform’s features.</li>
        <li>To maintain and improve the user experience.</li>
        <li>To ensure smooth operation, debugging, and troubleshooting.</li>
      </ul>

      <h3 className="font-medium mt-4">Sharing of Information</h3>
      <p>
        We do not sell, trade, or rent user information. Information may only be shared if required by law or to support essential services (e.g., hosting providers).
      </p>

      <h3 className="font-medium mt-4">Your Control</h3>
      <p>
        You may edit or delete your data within the application. For removal of data or questions, you may contact the project administrator at <span className="font-medium">farmbotofficial@gmail.com</span>.
      </p>

      <h3 className="font-medium mt-4">Security</h3>
      <p>
        We use reasonable technical measures to protect data; however, no system is 100% secure. Use the application with this understanding.
      </p>

      <h2 className="text-2xl font-semibold">Terms & Conditions</h2>

      <p>
        By accessing and using this platform, you agree to the following terms:
      </p>

      <h3 className="font-medium mt-4">Usage</h3>
      <ul className="list-decimal list-inside space-y-1">
        <li>You may use this platform for learning, personal, or organizational purposes.</li>
        <li>You agree not to misuse the platform, attempt to hack it, or disrupt its functionality.</li>
      </ul>

      <h3 className="font-medium mt-4">User Responsibilities</h3>
      <ul className="list-decimal list-inside space-y-1">
        <li>Provide accurate information when creating or managing data.</li>
        <li>Avoid uploading or sharing sensitive or unlawful content.</li>
      </ul>

      <h3 className="font-medium mt-4">Intellectual Property</h3>
      <p>
        All code, design, and materials related to this platform are the intellectual property of the project owner. You may not reproduce or distribute substantial parts of the project without permission.
      </p>

      <h3 className="font-medium mt-4">Limitation of Liability</h3>
      <p>
        This platform is provided “as is” without warranties of any kind. The project owner is not responsible for data loss, errors, downtime, or any damages resulting from use.
      </p>

      <h3 className="font-medium mt-4">Changes to Terms</h3>
      <p>
        We may update these Terms and the Privacy Policy from time to time. Continued use of the platform after updates indicates your acceptance of those changes.
      </p>

      <h3 className="font-medium mt-4">Contact</h3>
      <p>
        For any inquiries, please reach out to <span className="font-medium">farmbotofficial@gmail.com</span>.
      </p>
    </div>
  );
};

export default Privacy;
