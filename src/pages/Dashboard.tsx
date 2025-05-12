import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Star, FilePlus, Pill, TrendingUp, Users, User, BarChart } from 'lucide-react';
import AIChatAssistant from '@/components/chat/AIChatAssistant';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import ConnectedUsers from '@/components/dashboard/ConnectedUsers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Please Log In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">You need to be logged in to view your dashboard.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/login')}>Log In</Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isDoctor = currentUser.role === 'doctor';

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {currentUser.name}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isDoctor ? (
              <Button onClick={() => navigate('/appointments')}>
                <Calendar className="mr-2 h-4 w-4" />
                View Appointments
              </Button>
            ) : (
              <Button onClick={() => navigate('/book-appointment')}>
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isDoctor && <TabsTrigger value="patients">Patients</TabsTrigger>}
            {!isDoctor && <TabsTrigger value="doctors">My Doctors</TabsTrigger>}
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="files">Medical Files</TabsTrigger>
            {isDoctor && <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "Total Patients" : "Total Appointments"}
                  </CardTitle>
                  {isDoctor ? <Users className="h-4 w-4 text-muted-foreground" /> : <Calendar className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDoctor ? "167" : "12"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "+23 from last month" : "+2 from last month"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "Today's Appointments" : "Upcoming Appointments"}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDoctor ? "8" : "3"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "Next at 10:00 AM" : "Next in 2 days"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "Average Rating" : "Medical Records"}
                  </CardTitle>
                  {isDoctor ? <Star className="h-4 w-4 text-muted-foreground" /> : <FilePlus className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDoctor ? "4.9" : "7"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "From 145 reviews" : "Last updated 5 days ago"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "New Consultations" : "Current Medications"}
                  </CardTitle>
                  {isDoctor ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <Pill className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDoctor ? "24" : "3"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "+7 from last week" : "Next refill in 12 days"}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <UpcomingAppointments />
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>{isDoctor ? "Recent Patients" : "Your Doctors"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ConnectedUsers />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => isDoctor ? setActiveTab("patients") : navigate('/specialties')}>
                    <User className="mr-2 h-4 w-4" />
                    {isDoctor ? "View All Patients" : "Find More Specialists"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
            {isDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage your patients and their medical records.</p>
                  {/* Patient management interface here */}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="doctors">
            {!isDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Healthcare Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View and manage your healthcare providers.</p>
                  {/* Doctors list here */}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your upcoming and past appointments.</p>
                {/* Appointments interface here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Medical Files</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access and manage your medical records and files.</p>
                {/* Medical files interface here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-assistant">
            {isDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Medical Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIChatAssistant />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
