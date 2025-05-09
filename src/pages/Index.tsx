
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockSpecialties } from '../data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-accent py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Advanced Cancer Care and Diagnostics
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Connect with specialized cancer doctors, get AI-powered diagnostics, and manage your healthcare journey in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {currentUser ? (
              <Button 
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md text-lg"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md text-lg"
                  onClick={() => navigate('/register')}
                >
                  Register Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md text-lg"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Specialities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Cancer Specialties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer specialized diagnosis and treatment for various types of cancer, with dedicated doctors and advanced AI-powered diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockSpecialties.map((specialty) => (
              <div 
                key={specialty.id}
                className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/specialties/${specialty.id}`)}
              >
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl text-primary-dark">
                    {specialty.icon === 'brain' && '🧠'}
                    {specialty.icon === 'user' && '👤'}
                    {specialty.icon === 'heart' && '🫁'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{specialty.name}</h3>
                <p className="text-gray-600 text-center">{specialty.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2"
              onClick={() => navigate('/specialties')}
            >
              View All Specialties
            </Button>
          </div>
        </div>
      </section>

      {/* Health Tools Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Health Tools</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Take control of your health with our interactive calculators and assessment tools designed to help you understand important health metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-primary">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">BMI Calculator</h3>
              <p className="text-gray-600 text-center mb-4">Quickly calculate your Body Mass Index and understand what it means for your health.</p>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => navigate('/health-tools')}
                >
                  Try Now
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-secondary">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Heart Health Score</h3>
              <p className="text-gray-600 text-center mb-4">Assess your cardiovascular health risk factors and get personalized recommendations.</p>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-primary">😴</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Sleep Quality</h3>
              <p className="text-gray-600 text-center mb-4">Evaluate your sleep patterns and discover ways to improve your rest and recovery.</p>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2"
              onClick={() => navigate('/health-tools')}
            >
              Explore Health Tools
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CareInsight Works</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our platform connects patients with specialized doctors and uses AI to provide accurate diagnostics and personalized treatment plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 mx-auto border-2 border-primary">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-700">Create an account as a patient or doctor</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 mx-auto border-2 border-primary">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Specialty</h3>
              <p className="text-gray-700">Choose from brain, skin, or chest cancer specialists</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 mx-auto border-2 border-primary">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-gray-700">Schedule a visit and upload diagnostic files</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 mx-auto border-2 border-primary">
                <span className="text-lg font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-700">Receive AI-powered diagnosis and treatment plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-xl mx-auto">
            Join CareInsight today and connect with specialized cancer doctors for expert care with advanced AI diagnostics.
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg"
            onClick={() => navigate('/register')}
          >
            Register Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
