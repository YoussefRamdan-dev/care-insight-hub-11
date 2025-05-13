
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import Specialties from './pages/Specialties';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HealthyTalk from './pages/HealthyTalk';
import DoctorContributions from './pages/DoctorContributions';
import CreateAppointment from './pages/CreateAppointment';
import { Toaster } from "@/components/ui/toaster"
import CreateContribution from './pages/CreateContribution';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Add default route to Index component */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/doctors/:specialty" element={<Doctors />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/healthy-talk" element={<HealthyTalk />} />
            <Route path="/doctor-contributions" element={<DoctorContributions />} />
            <Route path="/create-appointment" element={<CreateAppointment />} />
            <Route path="/create-contribution" element={<CreateContribution />} />
            
            {/* Add catch-all route for 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </div>
  );
};

export default App;
