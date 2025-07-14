import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SummaryEditModal } from './SummaryEditModal';
import {
  Edit,
  Plus,
  FileText,
  Upload,
  Briefcase,
  User,
  Award,
  Trash2,
  Building2,
  X
} from 'lucide-react';
import { experiences, auth } from '@/lib/api';
import { Experience } from '@/types/experience';
import { ExperienceDialog } from './ExperienceDialog';
import { useToast } from '@/hooks/use-toast';
import { formatDateRange } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const AddEditSkillsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  skills: string[];
  onSave: (skills: string[]) => void;
}> = ({ open, onClose, skills: initialSkills, onSave }) => {
  const [input, setInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initialSkills);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills, open]);

  const handleAddSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      setSkills([...skills, input.trim()]);
      setInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = () => {
    onSave(skills);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add or Edit Skills</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(); }}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type a skill and press Enter"
          />
          <Button size="sm" onClick={handleAddSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map(skill => (
            <span key={skill} className="relative inline-flex items-center bg-primary/10 text-primary rounded px-3 py-1 text-sm">
              {skill}
              <button
                className="absolute -top-2 -right-2 bg-white rounded-full border border-gray-300 p-0.5 hover:bg-red-100 shadow"
                onClick={() => handleRemoveSkill(skill)}
                aria-label="Remove skill"
                style={{ lineHeight: 0 }}
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={skills.length === 0}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export const ProfileDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [userExperiences, setUserExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const data = await experiences.getAll();
      setUserExperiences(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load experiences',
        variant: 'destructive',
      });
    }
  };

  const handleAddExperience = () => {
    setSelectedExperience(undefined);
    setIsExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsExperienceDialogOpen(true);
  };

  const handleDeleteExperience = async (experience: Experience) => {
    try {
      await experiences.delete(experience.id);
      await loadExperiences();
      toast({
        title: 'Experience deleted',
        description: 'Your work experience has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete experience. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveExperience = async (data: any) => {
    try {
      if (selectedExperience) {
        await experiences.update(selectedExperience.id, data);
      } else {
        await experiences.create(data);
      }
      await loadExperiences();
      setIsExperienceDialogOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSaveSkills = async (newSkills: string[]) => {
    try {
      const response = await auth.updateProfile({ skills: newSkills });
      updateUser(response);
      setSkills(newSkills);
      toast({ title: 'Skills updated', description: 'Your skills have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update skills.', variant: 'destructive' });
    }
  };

  const handleDeleteSkill = async (skill: string) => {
    try {
      const updatedSkills = (skills || []).filter(s => s !== skill);
      const response = await auth.updateProfile({ skills: updatedSkills });
      updateUser(response);
      setSkills(updatedSkills);
      toast({ title: 'Skill removed', description: 'Skill has been deleted.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete skill.', variant: 'destructive' });
    }
  };

  const displaySkills = user.skills && user.skills.length > 0 ? user.skills : [];

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Summary Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Summary
          </CardTitle>
          <SummaryEditModal>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </SummaryEditModal>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: user.career_summary || '' }} />
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Skills
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditSkillsOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add or Edit Skills
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsExtracting(true)}>
              <FileText className="w-4 h-4 mr-1" /> Extract Skills from your Resume
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(skills && skills.length > 0 ? skills : []).map(skill => (
              <span key={skill} className="inline-flex items-center bg-primary/10 text-primary rounded px-3 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
          {skills && skills.length === 0 && (
            <div className="text-gray-500 text-sm mt-2">No skills added yet.</div>
          )}
        </CardContent>
      </Card>
      <AddEditSkillsModal open={isEditSkillsOpen} onClose={() => setIsEditSkillsOpen(false)} skills={skills} onSave={handleSaveSkills} />
      {/* Optionally, show a modal or toast for resume extraction feature coming soon */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <FileText className="w-8 h-8 mx-auto text-primary mb-2" />
            <h2 className="text-lg font-semibold mb-2">Extract Skills from your Resume</h2>
            <p className="text-gray-600 mb-4">This feature will let you upload your resume and automatically extract your skills. Coming soon!</p>
            <Button onClick={() => setIsExtracting(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Work Experience Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Your work experience
            <Badge variant="secondary">{userExperiences.length}</Badge>
          </CardTitle>
          <Button onClick={handleAddExperience} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userExperiences.map((exp) => (
              <div key={exp.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <h3 className="font-medium">{exp.position_title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {exp.logo_url ? (
                          <img
                            src={exp.logo_url}
                            alt={exp.organization_name}
                            className={cn(
                              "w-full h-full object-contain p-1",
                              "transition-opacity duration-200 ease-in-out"
                            )}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center';
                              if (target.parentElement) {
                                target.parentElement.appendChild(<Building2 className="w-4 h-4 text-gray-400" /> as unknown as Node);
                              }
                            }}
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className="inline-flex gap-1.5 items-center">
                        <span className="font-medium text-gray-700">{exp.organization_name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{exp.employment_type}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDateRange(exp.start_month, exp.start_year, exp.end_month, exp.end_year, exp.is_current)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditExperience(exp)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteExperience(exp)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {userExperiences.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No experiences added yet. Click 'Add Experience' to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience Dialog */}
      <ExperienceDialog
        isOpen={isExperienceDialogOpen}
        onClose={() => setIsExperienceDialogOpen(false)}
        experience={selectedExperience}
        onSave={handleSaveExperience}
      />

      {/* Files Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your files
            <Badge variant="secondary">1</Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload your files
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-500" />
                <span className="font-medium">resume.pdf</span>
              </div>
              <Button variant="outline" size="sm">
                Preview File
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Upload more files
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Upload your resume to automatically extract skills and experience
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
