"use client"
import React from 'react';

const SellerPrivacy = () => {
  return (
    <div className="w-full max-w-[850px] mx-auto space-y-6 pt-4 pb-6 px-4">
      <h2 className="text-2xl font-semibold ">Privacy Policy - FarmBot Seller</h2>
      <p className="">
        We respect your privacy and are committed to protecting your information when you use FarmBot.
      </p>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Information We Collect</h3>
        <ul className="list-decimal list-inside  space-y-1">
          <li>Basic details you provide such as name, email, and profile information.</li>
          <li>Farm and crop data that you create or manage within the platform.</li>
          <li>Technical details (browser type, IP address, activity timestamps) to improve performance and usability.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">How We Use Information</h3>
        <ul className="list-decimal list-inside  space-y-1">
          <li>To provide access to FarmBot features.</li>
          <li>To improve platform functionality, performance, and user experience.</li>
          <li>For debugging, troubleshooting, and system maintenance.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Sharing of Information</h3>
        <p className="">
          We do not sell, trade, or rent your data. Information may be shared only if required by law or to support essential services (e.g., hosting, maintenance, or support providers).
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Your Control</h3>
        <p className="">
          You can edit or delete your data within the platform. For data removal or privacy inquiries, contact: <span className="font-medium">farmbotofficial@gmail.com</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Security</h3>
        <p className="">
          We implement reasonable technical measures to protect data, but no system is completely secure. Use FarmBot with this understanding.
        </p>
      </div>

      <h2 className="text-2xl font-semibold  mt-8">Terms & Conditions - FarmBot Seller</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Usage</h3>
        <p className="">
          FarmBot is for learning, farming management, and personal/educational purposes. Users must not attempt to hack, disrupt, or misuse the platform.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">User Responsibilities</h3>
        <p className="">
          Provide accurate information when creating or managing farm data. Avoid uploading or sharing sensitive, illegal, or harmful content.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Intellectual Property</h3>
        <p className="">
          All code, design, and content related to FarmBot are the property of the project owner. You may not reproduce or distribute substantial parts without permission.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Limitation of Liability</h3>
        <p className="">
          FarmBot is provided “as is” without warranties. The project owner is not responsible for data loss, errors, downtime, or damages from use.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Changes to Terms</h3>
        <p className="">
          Privacy Policy and Terms may be updated. Continued use after updates constitutes acceptance.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium ">Contact</h3>
        <p className="">
          For questions or concerns: <span className="font-medium">farmbotofficial@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default SellerPrivacy;
