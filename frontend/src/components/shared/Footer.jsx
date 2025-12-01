
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <div className="flex justify-center gap-6 text-xl text-gray-600 mb-4">
        <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="hover:text-blue-600 transition" />
        </Link>
        <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="hover:text-pink-500 transition" />
        </Link>
        <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:text-blue-700 transition" />
        </Link>
        <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="hover:text-sky-500 transition" />
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Do!Job — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
