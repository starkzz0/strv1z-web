import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Heart, BookOpen, Users, Coffee, Brain } from 'lucide-react';

const moods = [
  { id: 'excited', emoji: '😊', label: 'Excited', color: 'bg-[hsl(var(--mood-happy))]' },
  { id: 'nervous', emoji: '😰', label: 'Nervous', color: 'bg-[hsl(var(--mood-anxious))]' },
  { id: 'curious', emoji: '🤔', label: 'Curious', color: 'bg-[hsl(var(--mood-calm))]' },
  { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: 'bg-[hsl(var(--mood-sad))]' },
  { id: 'hopeful', emoji: '🌟', label: 'Hopeful', color: 'bg-[hsl(var(--mood-happy))]' }
];

const interests = [
  { id: 'stress-management', label: 'Stress Management', icon: Brain },
  { id: 'study-tips', label: 'Study Tips', icon: BookOpen },
  { id: 'social-anxiety', label: 'Social Connections', icon: Users },
  { id: 'sleep-health', label: 'Sleep & Rest', icon: Coffee },
  { id: 'mindfulness', label: 'Mindfulness', icon: Heart },
  { id: 'mental-health', label: 'Mental Health', icon: Heart },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentMood: '',
    selectedInterests: [] as string[],
    bio: ''
  });
  
  const { updateProfile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMoodSelect = (moodId: string) => {
    setFormData(prev => ({ ...prev, currentMood: moodId }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : [...prev.selectedInterests, interestId]
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    try {
      const { error } = await updateProfile({
        bio: formData.bio,
        privacy_level: 'private'
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to save profile information',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Welcome to Vibenest!',
          description: 'Your profile has been set up successfully.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.currentMood;
      case 2: return formData.selectedInterests.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i}
              </div>
              {i < 3 && (
                <div className={`w-8 h-1 mx-2 ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card className="card-soft">
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <CardTitle>How are you feeling today?</CardTitle>
                <p className="text-muted-foreground">Let's start with your current mood</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-4 rounded-[--radius] border transition-all ${
                        formData.currentMood === mood.id
                          ? 'border-primary bg-[hsl(var(--primary-soft))] text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <CardTitle>What interests you?</CardTitle>
                <p className="text-muted-foreground">Select topics you'd like to explore (choose at least one)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => {
                    const Icon = interest.icon;
                    const isSelected = formData.selectedInterests.includes(interest.id);
                    
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-3 rounded-[--radius] border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-[hsl(var(--primary-soft))] text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mb-2" />
                        <div className="text-sm font-medium">{interest.label}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="text-center">
                <CardTitle>Almost done!</CardTitle>
                <p className="text-muted-foreground">Add a short bio to introduce yourself (optional)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="w-full p-3 border border-border rounded-[--radius-sm] resize-none"
                    rows={4}
                    placeholder="Tell us a bit about yourself, your goals, or what you hope to find in this community..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Your interests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedInterests.map((interestId) => {
                      const interest = interests.find(i => i.id === interestId);
                      return (
                        <Badge key={interestId} variant="secondary">
                          {interest?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <div className="p-6 pt-0">
            <Button
              onClick={step === 3 ? handleComplete : handleNext}
              disabled={!canProceed()}
              className="w-full"
            >
              {step === 3 ? 'Complete Setup' : 'Continue'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}