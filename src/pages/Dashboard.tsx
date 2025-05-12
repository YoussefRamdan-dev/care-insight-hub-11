
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import ConnectedUsers from '@/components/dashboard/ConnectedUsers';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockDoctors, mockAppointments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Determine dashboard metrics based on user role
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboardData', currentUser?.id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get appointments for current user based on role
      const userAppointments = mockAppointments.filter(appointment => 
        currentUser?.role === 'doctor' 
          ? appointment.doctorId === currentUser.id
          : appointment.patientId === currentUser.id
      );

      // Count upcoming appointments
      const upcomingAppointments = userAppointments.filter(
        appointment => new Date(appointment.date) > new Date() && appointment.status === 'scheduled'
      );

      // For a real app, these would come from API calls
      const unreadMessages = 5;
      const availableRecords = currentUser?.role === 'patient' ? 12 : 30;

      return {
        upcomingAppointmentsCount: upcomingAppointments.length,
        unreadMessagesCount: unreadMessages,
        availableRecordsCount: availableRecords,
        appointmentsList: upcomingAppointments,
        connectedUsers: mockDoctors.filter(user => 
          user.role !== currentUser?.role
        ).slice(0, 5)
      };
    }
  });

  // Function to get doctor name for display
  const getDoctorName = (doctorId: string) => {
    const doctor = mockDoctors.find(doctor => doctor.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Function to get patient name for display
  const getPatientName = (patientId: string) => {
    const patient = mockDoctors.find(user => user.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {currentUser && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <DashboardStats 
                upcomingAppointmentsCount={dashboardData?.upcomingAppointmentsCount || 0}
                unreadMessagesCount={dashboardData?.unreadMessagesCount || 0}
                availableRecordsCount={dashboardData?.availableRecordsCount || 0}
                userRole={currentUser.role}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Upcoming Appointments</CardTitle>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/appointments')}
                    >
                      View all
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <UpcomingAppointments 
                      appointments={dashboardData?.appointmentsList || []}
                      userRole={currentUser.role}
                      getDoctorName={getDoctorName}
                      getPatientName={getPatientName}
                      formatDate={formatDate}
                    />
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(currentUser.role === 'doctor' ? '/appointments' : '/book-appointment')}
                    >
                      {currentUser.role === 'doctor' ? 'Manage Appointments' : 'Book New Appointment'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold">
                      {currentUser.role === 'doctor' ? 'My Patients' : 'My Doctors'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ConnectedUsers 
                      users={dashboardData?.connectedUsers || []}
                      currentUserRole={currentUser.role}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(currentUser.role === 'doctor' ? '/messages' : '/specialties')}
                    >
                      {currentUser.role === 'doctor' ? 'Message Patients' : 'Find Specialists'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
