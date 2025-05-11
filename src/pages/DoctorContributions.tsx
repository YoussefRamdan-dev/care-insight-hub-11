
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { FileText, FilePlus, MessageCircle, ThumbsUp } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface Contribution {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  date: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'doctor' | 'patient';
  content: string;
  date: string;
}

// Mock contributions data
const mockContributions: Contribution[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    doctorSpecialty: 'brain-cancer',
    title: 'Latest Advancements in Brain Cancer Treatment',
    content: 'Recent studies have shown promising results in targeted therapies for glioblastoma. These new approaches focus on...',
    tags: ['Brain Cancer', 'Research', 'Treatment'],
    likes: 24,
    comments: [
      {
        id: 'c1',
        userId: '101',
        userName: 'Sarah Johnson',
        userRole: 'patient',
        content: 'This is really informative, thank you for sharing!',
        date: '2025-05-01T14:30:00Z'
      }
    ],
    date: '2025-04-28T14:30:00Z'
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Dr. Emily Johnson',
    doctorSpecialty: 'skin-cancer',
    title: 'Preventing Skin Cancer: What You Need to Know',
    content: 'Sun protection is crucial in preventing skin cancer. Here are some key measures everyone should take...',
    tags: ['Skin Cancer', 'Prevention', 'Sun Protection'],
    likes: 18,
    comments: [],
    date: '2025-04-25T09:15:00Z'
  }
];

const DoctorContributions = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newContribution, setNewContribution] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    // In a real app, this would be an API call
    setContributions(mockContributions);
  }, []);
  
  const handleCreateContribution = () => {
    if (!currentUser || currentUser.role !== 'doctor') {
      toast({
        title: "Not Authorized",
        description: "Only doctors can create contributions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newContribution.title.trim() || !newContribution.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and content for your contribution.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new contribution
    const contribution: Contribution = {
      id: `contrib-${Date.now()}`,
      doctorId: currentUser.id,
      doctorName: currentUser.name || 'Doctor',
      doctorSpecialty: currentUser.specialty || 'general',
      doctorImage: currentUser.profileImage,
      title: newContribution.title,
      content: newContribution.content,
      tags: newContribution.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      likes: 0,
      comments: [],
      date: new Date().toISOString()
    };
    
    // In a real app, this would be an API call
    setContributions([contribution, ...contributions]);
    setIsCreating(false);
    setNewContribution({ title: '', content: '', tags: '' });
    
    toast({
      title: "Contribution Published",
      description: "Your contribution has been published successfully.",
    });
  };
  
  const handleLike = (contributionId: string) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to like this contribution.",
        variant: "destructive",
      });
      return;
    }
    
    // Update contribution likes
    const updatedContributions = contributions.map(contrib => {
      if (contrib.id === contributionId) {
        return { ...contrib, likes: contrib.likes + 1 };
      }
      return contrib;
    });
    
    setContributions(updatedContributions);
  };
  
  const handleComment = (contributionId: string) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to comment.",
        variant: "destructive",
      });
      return;
    }
    
    const text = commentText[contributionId];
    if (!text || !text.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name || 'User',
      userRole: currentUser.role,
      content: text,
      date: new Date().toISOString()
    };
    
    // Update contribution with new comment
    const updatedContributions = contributions.map(contrib => {
      if (contrib.id === contributionId) {
        return {
          ...contrib,
          comments: [...contrib.comments, newComment]
        };
      }
      return contrib;
    });
    
    setContributions(updatedContributions);
    setCommentText({...commentText, [contributionId]: ''});
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully.",
    });
  };
  
  const filteredContributions = activeTab === 'all' 
    ? contributions 
    : contributions.filter(contrib => contrib.doctorSpecialty === activeTab);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Doctor Contributions</h1>
          
          {currentUser && currentUser.role === 'doctor' && !isCreating && (
            <Button 
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={() => setIsCreating(true)}
            >
              <FilePlus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          )}
        </div>
        
        {/* Create Contribution Form */}
        {isCreating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Contribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={newContribution.title}
                  onChange={(e) => setNewContribution({...newContribution, title: e.target.value})}
                  placeholder="Enter a title for your contribution"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="content"
                  value={newContribution.content}
                  onChange={(e) => setNewContribution({...newContribution, content: e.target.value})}
                  placeholder="Share your medical knowledge, research, or advice..."
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  id="tags"
                  value={newContribution.tags}
                  onChange={(e) => setNewContribution({...newContribution, tags: e.target.value})}
                  placeholder="e.g. Cancer, Treatment, Research"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewContribution({ title: '', content: '', tags: '' });
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={handleCreateContribution}
              >
                Publish
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Filter Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="brain-cancer">Brain Cancer</TabsTrigger>
            <TabsTrigger value="skin-cancer">Skin Cancer</TabsTrigger>
            <TabsTrigger value="chest-cancer">Chest Cancer</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Contributions List */}
        <div className="space-y-6">
          {filteredContributions.length > 0 ? (
            filteredContributions.map((contribution) => (
              <Card key={contribution.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary-light">
                      {contribution.doctorImage ? (
                        <img 
                          src={contribution.doctorImage} 
                          alt={contribution.doctorName} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <span className="text-lg text-primary-dark">
                          {contribution.doctorName.charAt(0)}
                        </span>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{contribution.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        By {contribution.doctorName} · {new Date(contribution.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 mb-4">{contribution.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contribution.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-primary-light text-primary-dark text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 border-t border-b py-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleLike(contribution.id)}
                    >
                      <ThumbsUp size={16} />
                      <span>{contribution.likes} Likes</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                    >
                      <MessageCircle size={16} />
                      <span>{contribution.comments.length} Comments</span>
                    </Button>
                  </div>
                  
                  {/* Comments section */}
                  <div className="mt-4 space-y-4">
                    {contribution.comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{comment.userName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                    
                    {/* Add comment form */}
                    {currentUser && (
                      <div className="flex gap-2 items-center">
                        <Input 
                          value={commentText[contribution.id] || ''} 
                          onChange={(e) => setCommentText({
                            ...commentText, 
                            [contribution.id]: e.target.value
                          })}
                          placeholder="Add a comment..." 
                        />
                        <Button 
                          onClick={() => handleComment(contribution.id)}
                          size="sm"
                        >
                          Post
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText size={36} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No contributions found for this topic.</p>
              {currentUser?.role === 'doctor' && (
                <Button 
                  className="mt-4 bg-primary hover:bg-primary-dark text-white"
                  onClick={() => setIsCreating(true)}
                >
                  Create First Post
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorContributions;
