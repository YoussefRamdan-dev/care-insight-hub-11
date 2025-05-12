
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { mockDoctors } from '@/data/mockData';
import DoctorReviews from '@/components/doctor/DoctorReviews';
import { Badge } from '@/components/ui/badge';

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      // Simulate API fetch with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundDoctor = mockDoctors.find(
        doc => doc.id === id && doc.role === 'doctor'
      );
      
      if (!foundDoctor) {
        throw new Error('Doctor not found');
      }
      
      return foundDoctor;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <p>Loading doctor details...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !doctor) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The doctor you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/specialties')}>
                  Browse Specialties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Doctor Profile Card */}
          <div className="lg:col-span-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-2 border-primary mb-4">
                    <AvatarImage src={doctor.profileImage} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold">Dr. {doctor.name}</h2>
                    <span className="ml-2 text-2xl">
                      {doctor.gender === 'male' ? '👨‍⚕️' : '👩‍⚕️'}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mt-1">{doctor.specialty}</p>
                  
                  <Badge className="mt-3" variant="outline">
                    ⭐ {doctor.experience} years of experience
                  </Badge>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Workplace</p>
                      <p className="text-muted-foreground">{doctor.workPlace}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{doctor.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{doctor.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Certifications</p>
                      <ul className="text-muted-foreground mt-1 list-disc pl-5">
                        {doctor.certifications?.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Available Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.availableDays?.map((day, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{day}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {doctor.availableHours && doctor.availableHours[index]
                            ? `${doctor.availableHours[index].hours[0].start} - ${doctor.availableHours[index].hours[0].end}`
                            : '9:00 AM - 5:00 PM'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                className="w-full"
                onClick={() => navigate('/book-appointment', { state: { doctorId: doctor.id } })}
              >
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/messages', { state: { recipientId: doctor.id, recipientName: doctor.name } })}
              >
                Send Message
              </Button>
            </div>
          </div>
          
          {/* Doctor Details Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {doctor.bio || 
                        `Dr. ${doctor.name} is a highly qualified ${doctor.specialty} specialist with ${doctor.experience} years of experience in the field. They are committed to providing exceptional healthcare and personalized treatment plans for each patient.`}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{doctor.specialty}</Badge>
                      {/* This would be populated with actual specializations from the API */}
                      <Badge variant="secondary">General Consultation</Badge>
                      <Badge variant="secondary">Preventive Care</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Education & Training</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Medical Degree</h4>
                        <p className="text-muted-foreground">
                          University Medical School, Graduated {new Date().getFullYear() - doctor.experience - 4}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Residency</h4>
                        <p className="text-muted-foreground">
                          General Hospital, Completed {new Date().getFullYear() - doctor.experience - 1}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <DoctorReviews doctorId={doctor.id} />
              </TabsContent>
              
              <TabsContent value="contributions">
                <Card>
                  <CardHeader>
                    <CardTitle>Doctor's Contributions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-muted-foreground">
                      Articles, research papers, and case studies published by Dr. {doctor.name}
                    </p>
                    
                    <Button
                      onClick={() => navigate('/doctor-contributions', { state: { doctorId: doctor.id } })}
                    >
                      View All Contributions
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetails;
