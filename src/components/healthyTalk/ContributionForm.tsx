
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ContributionType = 'article' | 'research' | 'case';

interface ContributionFormProps {
  onClose?: () => void;
  inModal?: boolean;
}

const ContributionForm = ({ onClose, inModal = false }: ContributionFormProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContributionType>('article');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('write');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate saving a contribution
      const newContribution = {
        id: uuidv4(),
        title,
        content,
        publishedAt: new Date().toISOString(),
        doctor: {
          id: currentUser?.id || '',
          name: currentUser?.name || '',
          specialty: currentUser?.role === 'doctor' ? (currentUser as any).specialty : '',
          profileImage: currentUser?.profileImage
        },
        likes: [],
        comments: [],
        category: type,
        date: new Date().toISOString(),
        doctorId: currentUser?.id || '',
        likes_count: 0,
        comments_count: 0
      };
      
      console.log('New contribution:', newContribution);
      
      // In a real app with a backend, we would add the contribution to the database
      
      // Show success notification
      toast({
        title: "Contribution published",
        description: "Your contribution has been published successfully"
      });
      
      // Navigate back or close modal
      if (inModal && onClose) {
        onClose();
      } else {
        navigate('/healthy-talk');
      }
      
    } catch (error) {
      console.error('Error publishing contribution:', error);
      toast({
        title: "Publication failed",
        description: "There was an error publishing your contribution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={inModal ? "" : "max-w-3xl mx-auto my-8"}>
      <CardHeader>
        <CardTitle className="text-2xl">Create New Contribution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              placeholder="Enter a descriptive title for your contribution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Contribution Type</Label>
            <Select 
              value={type} 
              onValueChange={(value: ContributionType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type of contribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="research">Research Paper</SelectItem>
                <SelectItem value="case">Case Study</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="mt-0">
                <Textarea 
                  id="content"
                  placeholder="Write your contribution content here..."
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format your content with clear sections and paragraphs for better readability
                </p>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="min-h-[300px] p-4 border rounded-md overflow-auto">
                  {content ? (
                    <div className="prose max-w-none">
                      <h2>{title || 'Untitled Contribution'}</h2>
                      <p className="text-muted-foreground text-sm mb-4">
                        {type === 'article' ? 'Article' : type === 'research' ? 'Research Paper' : 'Case Study'} • {new Date().toLocaleDateString()}
                      </p>
                      <div>
                        {content.split('\n').map((paragraph, i) => (
                          paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12">
                      Your content preview will appear here
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end space-x-2">
            {inModal && onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Contribution"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContributionForm;
