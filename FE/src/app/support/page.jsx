"use client";

import React from "react";

const ContactAdmin = () => {
  const handleEmailRedirect = () => {
    const adminEmail = "saqib@gmail.com"; // Replace with the admin's email
    const subject = "Support Request"; // Customize the subject line
    const body = "Hello Admin, I need assistance with..."; // Default email body
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="bg-white text-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Admin</h1>
        <p className="text-lg text-center mb-4">
          Need assistance? Click the button below to send an email to the admin.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleEmailRedirect}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
          >
            Send Email to Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
