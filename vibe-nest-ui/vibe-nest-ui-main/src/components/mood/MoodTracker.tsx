import { useState } from "react";
import { Smile, Frown, Meh, Angry, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const moods = [
  { id: "happy", icon: Smile, label: "Happy", color: "mood-happy" },
  { id: "calm", icon: Heart, label: "Calm", color: "mood-calm" },
  { id: "neutral", icon: Meh, label: "Okay", color: "bg-muted text-muted-foreground" },
  { id: "anxious", icon: Frown, label: "Anxious", color: "mood-anxious" },
  { id: "sad", icon: Frown, label: "Sad", color: "mood-sad" },
  { id: "angry", icon: Angry, label: "Angry", color: "mood-angry" },
];

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hasTrackedToday, setHasTrackedToday] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setHasTrackedToday(true);
  };

  if (hasTrackedToday) {
    const mood = moods.find(m => m.id === selectedMood);
    return (
      <Card className="p-6 text-center space-y-4 bg-[hsl(var(--primary-soft))] border-primary/20">
        <div className="flex justify-center">
          {mood && <mood.icon className="h-12 w-12 text-primary" />}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Mood logged for today!</h3>
          <p className="text-sm text-muted-foreground">
            You're feeling {mood?.label.toLowerCase()}. Take care of yourself! 💚
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">How are you feeling today?</h3>
        <p className="text-sm text-muted-foreground">
          Track your daily mood to better understand your mental wellness journey
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moods.map(({ id, icon: Icon, label, color }) => (
          <Button
            key={id}
            variant="outline"
            className={`h-16 flex-col gap-2 border-2 hover:border-primary transition-all ${
              selectedMood === id ? "border-primary bg-[hsl(var(--primary-soft))]" : ""
            }`}
            onClick={() => handleMoodSelect(id)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <Button 
          className="w-full bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground"
          onClick={() => setHasTrackedToday(true)}
        >
          Log Mood
        </Button>
      )}
    </Card>
  );
};