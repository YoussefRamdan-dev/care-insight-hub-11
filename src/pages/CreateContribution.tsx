
import React from 'react';
import Layout from '@/components/layout/Layout';
import ContributionForm from '@/components/healthyTalk/ContributionForm';

const CreateContribution = () => {
  return (
    <Layout>
      <div className="container">
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default CreateContribution;
