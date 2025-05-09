
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import BMICalculator from '../components/simulators/BMICalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HealthTools() {
  const [activeTab, setActiveTab] = useState("bmi");
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Health Assessment Tools</h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Interactive calculators to help you understand and monitor your health metrics
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
              <TabsTrigger value="heart" disabled>Heart Health Score</TabsTrigger>
              <TabsTrigger value="sleep" disabled>Sleep Quality</TabsTrigger>
            </TabsList>
            <TabsContent value="bmi" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <BMICalculator />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="heart">
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Coming soon! Our heart health assessment tool is under development.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sleep">
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Coming soon! Our sleep quality assessment tool is under development.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">About Our Health Tools</h2>
            <p className="mb-4">
              Our interactive health calculators are designed to help you understand important health metrics and track your wellness journey. These tools provide personalized insights based on your data.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> These tools are for informational purposes only and are not intended to replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with questions regarding medical conditions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
