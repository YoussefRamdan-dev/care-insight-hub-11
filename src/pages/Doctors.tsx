import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { mockDoctors } from '@/data/mockData';
import { DoctorProfile } from '@/types';
import { Star, MapPin, Search } from 'lucide-react';

const Doctors = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', specialty],
    queryFn: async () => {
      // Simulate API fetch with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter doctors by specialty if provided
      if (specialty) {
        return mockDoctors.filter(
          doc => doc.role === 'doctor' && 
          doc.specialty.toLowerCase() === specialty.toLowerCase()
        );
      }
      
      // Otherwise return all doctors
      return mockDoctors.filter(doc => doc.role === 'doctor');
    },
  });
  
  const filteredDoctors = doctors?.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">
          {specialty ? `${specialty} Specialists` : 'All Doctors'}
        </h1>
        <p className="text-muted-foreground mb-6">
          Find the right healthcare professional for your needs
        </p>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialty..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading doctors...</p>
          </div>
        ) : filteredDoctors && filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src={doctor.profileImage} />
                      <AvatarFallback>
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">Dr. {doctor.name}</h3>
                        <span className="ml-2">
                          {/* Safely handle gender with fallback */}
                          {doctor.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{doctor.rating || '4.8'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.workPlace}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">🧪</span>
                      <span>{doctor.specialty}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">⭐</span>
                      <span>{doctor.experience} years experience</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/doctor/${doctor.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No doctors found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Doctors;
