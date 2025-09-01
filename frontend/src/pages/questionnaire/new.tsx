import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout/Layout';

const NewQuestionnairePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main questionnaire form
    router.replace('/questionnaire');
  }, [router]);

  return (
    <Layout title="New Questionnaire - Oren">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to questionnaire...</p>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(NewQuestionnairePage, { title: "New Questionnaire - Oren" });
