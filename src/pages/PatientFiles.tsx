
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPatients, mockDiagnosticFiles } from '@/data/mockData';
import { PatientProfile, DiagnosticFile, DiagnosisResult } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, User, Clock, Calendar, 
  UploadCloud, Download, Plus, X, 
  AlertCircle, CheckCircle, Bot
} from 'lucide-react';
import AIChatAssistant from '@/components/chat/AIChatAssistant';

const mockDiagnosisResults: DiagnosisResult[] = [
  {
    id: 'diag1',
    appointmentId: 'app1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    date: new Date().toISOString(),
    result: 'Suspected early-stage melanoma',
    predictionScore: 0.87,
    treatmentPlan: 'Surgical excision recommended, followed by regular follow-ups and preventive measures.',
    followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedByDoctor: true
  },
  {
    id: 'diag2',
    appointmentId: 'app2',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    result: 'Benign skin lesion',
    predictionScore: 0.95,
    treatmentPlan: 'No treatment required. Continue regular skin checks.',
    followUpDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedByDoctor: true
  }
];

export default function PatientFiles() {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentUser } = useAuth();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [files, setFiles] = useState<DiagnosticFile[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<DiagnosticFile | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!patientId) return;
    
    // Find patient by ID
    const foundPatient = mockPatients.find(p => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient as PatientProfile);
    }

    // Get patient files
    const patientFiles = mockDiagnosticFiles.filter(file => file.patientId === patientId);
    setFiles(patientFiles);

    // Get diagnosis results
    const patientDiagnoses = mockDiagnosisResults.filter(
      diagnosis => diagnosis.patientId === patientId
    );
    setDiagnoses(patientDiagnoses);
  }, [patientId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create new diagnostic file(s)
      const newFiles: DiagnosticFile[] = Array.from(selectedFiles).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        patientId: patientId || '',
        appointmentId: 'current-appointment',
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        fileType: file.type
      }));
      
      // Add to files list
      setFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 1500);
  };

  const handleRequestFiles = () => {
    // In a real implementation, this would send a notification to the patient
    alert('File request has been sent to the patient.');
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const handleSelectFile = (file: DiagnosticFile) => {
    setSelectedFile(file);
  };

  const handleAddDiagnosis = () => {
    const newDiagnosis: DiagnosisResult = {
      id: `diag-${Date.now()}`,
      appointmentId: 'current-appointment',
      patientId: patientId || '',
      doctorId: currentUser?.id || '',
      date: new Date().toISOString(),
      result: 'Pending AI Analysis',
      predictionScore: undefined,
      treatmentPlan: '',
      reviewedByDoctor: false
    };
    
    setDiagnoses(prev => [...prev, newDiagnosis]);
    setActiveTab('diagnosis');
    setShowAIAssistant(true);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real implementation, this would save the note to the database
    setNewNote('');
    alert('Note has been added to the patient record.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Patient not found or you don't have permission to view this record.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Files</h1>
          <div className="flex gap-2">
            <Button onClick={handleRequestFiles} variant="outline">
              Request Files
            </Button>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              <Button onClick={handleUploadClick}>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          </div>
        </div>
        
        {/* Patient Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-20 w-20 bg-primary-light">
                  <User className="h-10 w-10 text-primary-dark" />
                </Avatar>
                <h2 className="text-xl font-bold mt-2">{patient.name}</h2>
                <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="font-medium">{patient.bloodType || 'Not recorded'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{patient.age || 'Not recorded'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{patient.gender || 'Not recorded'}</p>
                </div>
                
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500 mb-1">Medications</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications && patient.medications.length > 0 ? (
                      patient.medications.map((med, i) => (
                        <Badge key={i} variant="outline">{med}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No medications recorded</p>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500 mb-1">Chronic Diseases</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicDiseases && patient.chronicDiseases.length > 0 ? (
                      patient.chronicDiseases.map((disease, i) => (
                        <Badge key={i} variant="secondary">{disease}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No chronic diseases recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Files, Diagnosis, Notes */}
        <Tabs defaultValue="files" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Files Tab */}
          <TabsContent value="files" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">File List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {files.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-500">No files uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {files.map((file) => (
                          <div 
                            key={file.id}
                            onClick={() => handleSelectFile(file)}
                            className={`p-3 border rounded-md cursor-pointer flex items-center justify-between hover:bg-gray-50 ${selectedFile?.id === file.id ? 'border-primary bg-primary-light bg-opacity-10' : ''}`}
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium text-sm truncate max-w-[150px]">
                                  {file.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(file.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file.id);
                              }}
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="mt-4 p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <p className="text-sm">Uploading files...</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">File Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{selectedFile.fileName}</h3>
                            <p className="text-sm text-gray-500">
                              Uploaded on {formatDate(selectedFile.uploadDate)}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 border rounded-md min-h-[300px] flex items-center justify-center">
                          {selectedFile.fileType.startsWith('image/') ? (
                            <img 
                              src={selectedFile.fileUrl} 
                              alt={selectedFile.fileName} 
                              className="max-h-[300px] object-contain" 
                            />
                          ) : (
                            <div className="text-center p-4">
                              <FileText className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2">{selectedFile.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {selectedFile.fileType}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button onClick={handleAddDiagnosis}>
                            Run AI Diagnosis
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <FileText className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-gray-500">Select a file to preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {diagnoses.length > 0 ? (
                  diagnoses.map((diagnosis) => (
                    <Card key={diagnosis.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium">
                              {diagnosis.result}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(diagnosis.date)}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={diagnosis.reviewedByDoctor ? "default" : "outline"}
                          >
                            {diagnosis.reviewedByDoctor ? "Reviewed" : "Pending Review"}
                          </Badge>
                        </div>
                        
                        {diagnosis.predictionScore !== undefined && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">AI Confidence</span>
                              <span className="text-sm font-medium">
                                {Math.round(diagnosis.predictionScore * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${diagnosis.predictionScore > 0.8 ? 'bg-red-500' : 'bg-amber-500'}`}
                                style={{ width: `${diagnosis.predictionScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {diagnosis.treatmentPlan && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Treatment Plan</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                              {diagnosis.treatmentPlan}
                            </p>
                          </div>
                        )}
                        
                        {diagnosis.followUpDate && (
                          <div className="flex items-center p-3 bg-primary-light bg-opacity-10 rounded-md">
                            <Clock className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <p className="text-sm font-medium">Follow-up</p>
                              <p className="text-xs text-gray-600">{formatDate(diagnosis.followUpDate)}</p>
                            </div>
                          </div>
                        )}
                        
                        {!diagnosis.reviewedByDoctor && (
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline">Edit</Button>
                            <Button>Mark as Reviewed</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <h3 className="font-medium">No Diagnosis Records</h3>
                      <p className="text-gray-500">Select a file and run AI diagnosis to get started.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      AI Diagnosis Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showAIAssistant ? (
                      <div className="h-[400px]">
                        <AIChatAssistant forDoctors={true} />
                      </div>
                    ) : (
                      <div className="text-center py-8 space-y-4">
                        <Bot className="mx-auto h-12 w-12 text-gray-300" />
                        <div>
                          <p className="font-medium">AI Assistant</p>
                          <p className="text-sm text-gray-500 mb-4">
                            Get help with diagnosis and treatment recommendations
                          </p>
                          <Button onClick={() => setShowAIAssistant(true)}>
                            Start AI Diagnosis
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="note">Add Doctor's Note</Label>
                    <Textarea
                      id="note"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your notes about the patient's condition, treatment, or follow-up instructions..."
                      className="min-h-[120px] mt-2"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Previous Notes</h3>
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-2 text-gray-500">No previous notes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
