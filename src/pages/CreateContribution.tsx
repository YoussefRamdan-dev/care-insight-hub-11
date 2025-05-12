
import React from 'react';
import Layout from '@/components/layout/Layout';
import ContributionForm from '@/components/healthyTalk/ContributionForm';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, FileCode } from 'lucide-react';

const CreateContribution = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    // Redirect if not logged in
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Contribution</h1>
          <p className="text-muted-foreground">
            Share your knowledge, insights, or clinical experiences with the medical community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <ContributionForm />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Contribution Guidelines</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Ensure your content is factually accurate and evidence-based</span>
                  </li>
                  <li className="flex gap-2">
                    <BookOpen className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Organize content with clear headings and sections</span>
                  </li>
                  <li className="flex gap-2">
                    <FileCode className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Include references to support your claims when applicable</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Contribution Types</h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium">Articles</h4>
                    <p className="text-sm text-muted-foreground">
                      Educational content on medical topics, health tips, or professional insights
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Research Papers</h4>
                    <p className="text-sm text-muted-foreground">
                      Share findings from research you've conducted or participated in
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Case Studies</h4>
                    <p className="text-sm text-muted-foreground">
                      Anonymized, detailed reports of patient cases with educational value
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateContribution;
