
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, UserRound, FileText, Calendar, MessageSquare, 
  Upload, AlertTriangle, CheckCircle, Brain, FileBarChart2 
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/data/mockData';
import { PatientProfile, DiagnosticFile, DiagnosisResult } from '@/types';

// Mock data for patient files and diagnosis
const mockFiles: DiagnosticFile[] = [
  {
    id: 'file-1',
    patientId: 'patient-1',
    appointmentId: 'appt-1',
    fileUrl: '/placeholder.svg',
    fileName: 'brain_scan_1.jpg',
    uploadDate: '2023-05-15T10:30:00Z',
    fileType: 'image/jpeg'
  },
  {
    id: 'file-2',
    patientId: 'patient-1',
    appointmentId: 'appt-1',
    fileUrl: '/placeholder.svg',
    fileName: 'brain_scan_2.jpg',
    uploadDate: '2023-05-15T10:31:00Z',
    fileType: 'image/jpeg'
  },
  {
    id: 'file-3',
    patientId: 'patient-1',
    appointmentId: 'appt-1',
    fileUrl: '/placeholder.svg',
    fileName: 'lab_results.pdf',
    uploadDate: '2023-05-14T09:15:00Z',
    fileType: 'application/pdf'
  }
];

const mockDiagnosis: DiagnosisResult = {
  id: 'diag-1',
  appointmentId: 'appt-1',
  patientId: 'patient-1',
  doctorId: 'doctor-1',
  date: '2023-05-16T11:30:00Z',
  result: 'No significant abnormalities detected in the brain scan.',
  predictionScore: 0.92,
  treatmentPlan: '',
  followUpDate: '',
  reviewedByDoctor: false
};

const PatientFiles = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [files, setFiles] = useState<DiagnosticFile[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [diagnosisReviewed, setDiagnosisReviewed] = useState(false);
  
  // AI diagnosis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiDiagnosis, setShowAiDiagnosis] = useState(false);
  
  useEffect(() => {
    // In a real app, these would be API calls
    if (patientId) {
      const foundPatient = mockPatients.find(p => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient as PatientProfile);
      }
      
      // Load patient files
      setFiles(mockFiles.filter(file => file.patientId === patientId));
      
      // Check if diagnosis exists
      if (mockDiagnosis.patientId === patientId) {
        setDiagnosis(mockDiagnosis);
        setDiagnosisReviewed(mockDiagnosis.reviewedByDoctor);
      }
    }
  }, [patientId]);
  
  if (!currentUser || currentUser.role !== 'doctor') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Access restricted. Only doctors can view patient files.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Patient not found</p>
        </div>
      </DashboardLayout>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const handleRunAiDiagnosis = () => {
    // Simulate AI analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAiDiagnosis(true);
      
      toast({
        title: "AI Analysis Complete",
        description: "The diagnostic images have been successfully analyzed.",
      });
    }, 3000);
  };
  
  const handleSubmitReview = () => {
    if (!treatmentPlan) {
      toast({
        title: "Treatment Plan Required",
        description: "Please provide a treatment plan before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the diagnosis with doctor's review
    if (diagnosis) {
      const updatedDiagnosis = {
        ...diagnosis,
        treatmentPlan,
        followUpDate: followUpDate || undefined,
        reviewedByDoctor: true
      };
      setDiagnosis(updatedDiagnosis);
      setDiagnosisReviewed(true);
      
      toast({
        title: "Review Submitted",
        description: "Your review and treatment plan have been saved.",
      });
    }
  };
  
  const handleSendToPatient = () => {
    toast({
      title: "Sent to Patient",
      description: "The diagnosis and treatment plan have been sent to the patient.",
    });
    
    // In a real app, this would trigger a notification to the patient
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Files</h1>
            <p className="text-gray-600">
              View and manage medical files for {patient.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserRound className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  {patient.profileImage ? (
                    <img 
                      src={patient.profileImage} 
                      alt={patient.name} 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserRound className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">{patient.name}</h3>
                  <p className="text-gray-500 text-sm">{patient.email}</p>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  {patient.age && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Age</span>
                      <span className="font-medium text-sm">{patient.age} years</span>
                    </div>
                  )}
                  
                  {patient.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Gender</span>
                      <span className="font-medium text-sm">{patient.gender}</span>
                    </div>
                  )}
                  
                  {patient.bloodType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Blood Type</span>
                      <span className="font-medium text-sm">{patient.bloodType}</span>
                    </div>
                  )}
                </div>
                
                {patient.medications && patient.medications.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {patient.medications.map((med, i) => (
                        <li key={i} className="text-gray-700">{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Chronic Conditions</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {patient.chronicDiseases.map((disease, i) => (
                        <li key={i} className="text-gray-700">{disease}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="diagnostic-files" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="diagnostic-files">Diagnostic Files</TabsTrigger>
                <TabsTrigger value="ai-diagnosis">AI Diagnosis</TabsTrigger>
                <TabsTrigger value="treatment-plan">Treatment Plan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagnostic-files">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {files.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {files.filter(file => file.fileType.startsWith('image/')).map(file => (
                            <div key={file.id} className="border rounded-lg overflow-hidden">
                              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img
                                  src={file.fileUrl}
                                  alt={file.fileName}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-medium text-sm">{file.fileName}</p>
                                <p className="text-xs text-gray-500">Uploaded on {formatDate(file.uploadDate)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <h3 className="text-sm font-medium mb-3">Other Files</h3>
                          {files.filter(file => !file.fileType.startsWith('image/')).map(file => (
                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-md mb-2">
                              <div className="flex items-center">
                                <FileText className="h-8 w-8 mr-3 text-gray-400" />
                                <div>
                                  <p className="font-medium text-sm">{file.fileName}</p>
                                  <p className="text-xs text-gray-500">{formatDate(file.uploadDate)}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">Download</Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Files
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-600">No medical files available</p>
                        <Button className="mt-4">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai-diagnosis">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Diagnostic Tool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showAiDiagnosis ? (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                          <Brain className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium">AI Diagnostic Assistant</p>
                            <p className="mt-1">Upload brain, skin, or breast cancer diagnostic images to get AI-powered analysis. The model will provide preliminary findings to assist your diagnosis.</p>
                          </div>
                        </div>
                        
                        {files.length > 0 ? (
                          <div>
                            <h3 className="text-sm font-medium mb-3">Select files for AI analysis</h3>
                            <div className="space-y-2">
                              {files.filter(file => file.fileType.startsWith('image/')).map(file => (
                                <div key={file.id} className="flex items-center p-3 border rounded-md">
                                  <input 
                                    type="checkbox" 
                                    id={`file-${file.id}`} 
                                    className="mr-3 h-4 w-4 text-primary" 
                                  />
                                  <label htmlFor={`file-${file.id}`} className="flex items-center flex-1 cursor-pointer">
                                    <img 
                                      src={file.fileUrl} 
                                      alt={file.fileName} 
                                      className="w-12 h-12 object-cover mr-3 rounded" 
                                    />
                                    <span className="text-sm">{file.fileName}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <Button 
                                onClick={handleRunAiDiagnosis}
                                disabled={isAnalyzing}
                              >
                                {isAnalyzing ? (
                                  <>Analyzing Files...</>
                                ) : (
                                  <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Run AI Diagnosis
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <AlertTriangle className="h-12 w-12 mx-auto text-gray-300" />
                            <p className="mt-2 text-gray-600">No diagnostic images available for AI analysis</p>
                            <p className="text-sm text-gray-500 mt-1">Upload images in the Diagnostic Files tab</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <div className="text-sm text-green-700">
                            <p className="font-medium">AI Analysis Complete</p>
                            <p className="mt-1">The diagnostic images have been successfully analyzed. Please review the findings below.</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">AI Diagnostic Results</h3>
                            <div className="flex items-center mt-1">
                              <FileBarChart2 className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-500">
                                Analyzed on {formatDate(new Date().toISOString())}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium">Assessment</h4>
                            <p className="mt-2 text-gray-700">{diagnosis?.result}</p>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span>AI Confidence Level</span>
                                <span className="font-medium">{diagnosis?.predictionScore ? Math.round(diagnosis.predictionScore * 100) : 0}%</span>
                              </div>
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary"
                                  style={{ width: `${diagnosis?.predictionScore ? diagnosis.predictionScore * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium">AI Interpretation</h4>
                            <p className="mt-2 text-gray-700">
                              Based on the provided images, the AI model has not detected significant abnormalities that would indicate cancer. 
                              The anatomical structures appear normal with no signs of lesions, masses, or irregular tissue growth.
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-6">
                          <Button onClick={() => setShowAiDiagnosis(false)} variant="outline" className="mr-2">
                            Run New Analysis
                          </Button>
                          <Button onClick={() => document.querySelector('[data-value="treatment-plan"]')?.click()}>
                            Create Treatment Plan
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="treatment-plan">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Plan & Doctor's Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {diagnosisReviewed ? (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <div className="text-sm text-green-700">
                            <p className="font-medium">Review Complete</p>
                            <p className="mt-1">Your review and treatment plan have been saved.</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium">Doctor's Assessment</h4>
                          <p className="mt-2 text-gray-700">{diagnosis?.result}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium">Treatment Plan</h4>
                          <p className="mt-2 text-gray-700">{diagnosis?.treatmentPlan}</p>
                        </div>
                        
                        {diagnosis?.followUpDate && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium">Follow-Up Date</h4>
                            <p className="mt-2 text-gray-700">{formatDate(diagnosis.followUpDate)}</p>
                          </div>
                        )}
                        
                        <div className="pt-6">
                          <Button onClick={handleSendToPatient}>
                            Send to Patient
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium">Treatment Plan</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Enter your professional assessment and recommended treatment
                          </p>
                          <Textarea 
                            placeholder="Enter treatment plan here..." 
                            className="mt-2"
                            value={treatmentPlan}
                            onChange={e => setTreatmentPlan(e.target.value)}
                            rows={6}
                          />
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium">Follow-Up Appointment</h3>
                          <input
                            type="date"
                            className="mt-2 w-full p-2 border rounded"
                            value={followUpDate}
                            onChange={e => setFollowUpDate(e.target.value)}
                          />
                        </div>
                        
                        <Button onClick={handleSubmitReview} className="w-full">
                          Submit Review
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientFiles;
