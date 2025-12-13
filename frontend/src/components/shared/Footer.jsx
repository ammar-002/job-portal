
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-6 mt-auto">
      <div className="flex justify-center gap-6 text-xl text-gray-600 mb-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="hover:text-blue-600 transition" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="hover:text-pink-500 transition" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:text-blue-700 transition" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="hover:text-sky-500 transition" />
        </a>
      </div>

      <p className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Do!Job — All Rights Reserved.
      </p>
    </footer>
  );
};


export default Footer; 
