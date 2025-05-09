
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockAppointments, mockDoctors, mockPatients } from '../data/mockData';
import { Appointment, DoctorProfile, PatientProfile } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageSquare, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<(DoctorProfile | PatientProfile)[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Filter appointments based on user role
    const userAppointments = mockAppointments.filter((appointment) => {
      if (currentUser.role === 'patient') {
        return appointment.patientId === currentUser.id;
      } else if (currentUser.role === 'doctor') {
        return appointment.doctorId === currentUser.id;
      }
      return false;
    });

    // Filter upcoming and past appointments
    const now = new Date();
    const upcoming = userAppointments
      .filter((appointment) => new Date(appointment.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    
    const recent = userAppointments
      .filter((appointment) => new Date(appointment.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    setUpcomingAppointments(upcoming);
    setRecentAppointments(recent);

    // Get connected users (doctors or patients)
    if (currentUser.role === 'patient') {
      const patientDoctors = mockDoctors.filter((doctor) => {
        return userAppointments.some((appt) => appt.doctorId === doctor.id);
      });
      setConnectedUsers(patientDoctors);
    } else if (currentUser.role === 'doctor') {
      const doctorPatients = mockPatients.filter((patient) => {
        return userAppointments.some((appt) => appt.patientId === patient.id);
      });
      setConnectedUsers(doctorPatients);
    }
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get doctor name from doctor ID
  const getDoctorName = (doctorId: string) => {
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Get patient name from patient ID
  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view your dashboard.</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-gray-600">
            {currentUser.role === 'patient' 
              ? 'Manage your appointments and health information.' 
              : 'Manage your patient appointments and consultations.'}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Appointments</CardTitle>
              <Calendar size={20} className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
              <p className="text-muted-foreground text-sm">Upcoming appointments</p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary text-sm mt-2"
                onClick={() => navigate('/appointments')}
              >
                View all appointments
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Messages</CardTitle>
              <MessageSquare size={20} className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
              <p className="text-muted-foreground text-sm">Unread messages</p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary text-sm mt-2"
                onClick={() => navigate('/messages')}
              >
                Check messages
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {currentUser.role === 'patient' ? 'Medical Records' : 'Patient Files'}
              </CardTitle>
              <FileText size={20} className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {currentUser.role === 'patient' ? '3' : '8'}
              </p>
              <p className="text-muted-foreground text-sm">
                {currentUser.role === 'patient' ? 'Available records' : 'Patient files'}
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary text-sm mt-2"
              >
                View all files
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex flex-col md:flex-row justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/appointments/${appointment.id}`)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                        <Calendar size={18} className="text-primary-dark" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {currentUser.role === 'patient' 
                            ? `Dr. ${getDoctorName(appointment.doctorId)}` 
                            : getPatientName(appointment.patientId)}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <p className="text-sm text-primary font-medium">
                        {formatDate(appointment.date)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {appointment.specialty.replace('-', ' ')} consultation
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming appointments.</p>
                {currentUser.role === 'patient' && (
                  <Button 
                    className="mt-4 bg-primary hover:bg-primary-dark text-white"
                    onClick={() => navigate('/specialties')}
                  >
                    Book an Appointment
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Doctors/Patients */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentUser.role === 'patient' ? 'Your Doctors' : 'Your Patients'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {currentUser.role === 'patient' ? `Dr. ${user.name}` : user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentUser.role === 'patient' 
                          ? user.specialty.replace('-', ' ') 
                          : user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {currentUser.role === 'patient' 
                    ? 'You have no doctors yet.' 
                    : 'You have no patients yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
