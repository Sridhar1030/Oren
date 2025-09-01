import React from 'react';
import Link from 'next/link';
import { BarChart3, Mail, Globe, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Oren ESG</span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Comprehensive ESG questionnaire and sustainability data management platform. 
              Track, analyze, and report your environmental, social, and governance metrics.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="mailto:contact@orenesg.com" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">sridharpillai75@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/questionnaire" className="text-gray-600 hover:text-primary-600 transition-colors">
                  ESG Questionnaire
                </Link>
              </li>
              <li>
                <Link href="/upload-pdf" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Upload PDF
                </Link>
              </li>

            </ul>
          </div>

        
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
