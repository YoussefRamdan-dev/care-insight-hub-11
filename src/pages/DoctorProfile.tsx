
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { mockDoctors } from '../data/mockData';
import { DoctorProfile as DoctorProfileType, Review } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  MessageCircle, 
  UserPlus, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DoctorReviews from '@/components/doctor/DoctorReviews';
import { Avatar } from '@/components/ui/avatar';

const DoctorProfilePage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    if (!doctorId) return;
    
    // In a real app, this would be an API call
    const foundDoctor = mockDoctors.find(doc => doc.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
      
      // Check if the current user is following this doctor
      // This would be a real API call in a production app
      setIsFollowing(false); // Default state
    }
  }, [doctorId]);
  
  const handleStartChat = () => {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/messages?doctorId=${doctorId}` } });
      return;
    }
    navigate(`/messages?doctorId=${doctorId}`);
  };
  
  const handleFollowDoctor = () => {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/doctor/${doctorId}` } });
      return;
    }
    
    // Toggle follow status
    setIsFollowing(!isFollowing);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed Dr. ${doctor?.name}`
        : `You are now following Dr. ${doctor?.name}`,
    });
  };
  
  const handleBookAppointment = () => {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/book-appointment/${doctorId}` } });
      return;
    }
    navigate(`/book-appointment/${doctorId}`);
  };

  if (!doctor) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Doctor not found or loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Doctor Header Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor Avatar */}
                <div className="w-full md:w-auto flex flex-col items-center">
                  <Avatar className="h-32 w-32 bg-primary-light">
                    {doctor.profileImage ? (
                      <img 
                        src={doctor.profileImage} 
                        alt={doctor.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-4xl text-primary-dark">
                        {doctor.name.charAt(0)}
                      </span>
                    )}
                  </Avatar>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleStartChat}
                    >
                      <MessageCircle size={16} />
                      <span>Chat</span>
                    </Button>
                    
                    <Button 
                      variant={isFollowing ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleFollowDoctor}
                    >
                      <UserPlus size={16} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </Button>
                  </div>
                </div>
                
                {/* Doctor Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                  <p className="text-lg text-gray-600 mb-2 capitalize">
                    {doctor.specialty?.replace('-', ' ')} Specialist
                  </p>
                  
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {doctor.rating} ({doctor.reviewsCount || 0} reviews)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{doctor.workPlace}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{doctor.experience} years of experience</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-primary hover:bg-primary-dark text-white"
                    onClick={handleBookAppointment}
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-auto md:inline-grid">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            
            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-gray-700">{doctor.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Specializations</h3>
                    <p className="text-gray-700 capitalize">{doctor.specialty?.replace('-', ' ')}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Certifications</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {doctor.certifications?.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <DoctorReviews doctorId={doctorId || ''} />
            </TabsContent>
            
            {/* Availability Tab */}
            <TabsContent value="availability" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availableDays?.map((day, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                  {(!doctor.availableDays || doctor.availableDays.length === 0) && (
                    <p className="text-gray-500">No availability set</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfilePage;
