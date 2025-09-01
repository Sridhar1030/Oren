import React from 'react';
import Link from 'next/link';
import { BarChart3, Mail, Globe, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Oren ESG</span>
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
                <span className="text-sm">contact@orenesg.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/questionnaire" className="text-gray-600 hover:text-primary-600 transition-colors">
                  ESG Questionnaire
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Reports
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <a 
                  href="https://orennow.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Oren Platform</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Oren ESG. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">
              Built with sustainability in mind
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Carbon Neutral Hosting</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
