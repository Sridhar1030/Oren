import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Oren ESG', 
  description = 'ESG Questionnaire and Sustainability Data Management Platform' 
}) => {
  const router = useRouter();
  const { isLoading } = useAuth();
  const isAuthPage = router.pathname.startsWith('/auth/');

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {isAuthPage ? (
        // Auth pages get full control without Navbar/Footer
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // Regular pages get the full layout
        <div className="min-h-screen flex flex-col">
          {/* Only render Navbar when authentication state is determined */}
          {!isLoading && <Navbar />}
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
};

export default Layout;
