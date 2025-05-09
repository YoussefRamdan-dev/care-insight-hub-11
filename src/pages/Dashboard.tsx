
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockAppointments, mockDoctors, mockPatients } from '../data/mockData';
import { Appointment, DoctorProfile, PatientProfile } from '../types';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import ConnectedUsers from '@/components/dashboard/ConnectedUsers';
import AIChatAssistant from '@/components/chat/AIChatAssistant';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<(DoctorProfile | PatientProfile)[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
        <DashboardStats 
          upcomingAppointmentsCount={upcomingAppointments.length}
          unreadMessagesCount={2}
          availableRecordsCount={currentUser.role === 'patient' ? 3 : 8}
          userRole={currentUser.role}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Upcoming Appointments */}
            <UpcomingAppointments
              appointments={upcomingAppointments}
              userRole={currentUser.role}
              getDoctorName={getDoctorName}
              getPatientName={getPatientName}
              formatDate={formatDate}
            />

            {/* Connected Doctors/Patients */}
            <div className="mt-6">
              <ConnectedUsers 
                users={connectedUsers} 
                currentUserRole={currentUser.role} 
              />
            </div>
          </div>

          <div>
            {/* AI Assistant for doctors, option to chat with AI for patients */}
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                {showAIAssistant ? (
                  <div className="h-[400px]">
                    <AIChatAssistant forDoctors={currentUser.role === 'doctor'} />
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p>
                      {currentUser.role === 'doctor'
                        ? 'Get help with patient summaries, appointment scheduling, and message drafting.'
                        : 'Get help with medical questions, appointment booking, and more.'}
                    </p>
                    <button
                      onClick={() => setShowAIAssistant(true)}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                      Chat with AI Assistant
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
