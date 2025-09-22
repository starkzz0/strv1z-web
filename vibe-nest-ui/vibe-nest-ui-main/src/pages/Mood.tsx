import { MoodTracker } from "@/components/mood/MoodTracker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, TrendingUp, BookOpen } from "lucide-react";

const moodHistory = [
  { date: "Today", mood: "Happy", color: "bg-[hsl(var(--mood-happy))]" },
  { date: "Yesterday", mood: "Calm", color: "bg-[hsl(var(--mood-calm))]" },
  { date: "2 days ago", mood: "Anxious", color: "bg-[hsl(var(--mood-anxious))]" },
  { date: "3 days ago", mood: "Happy", color: "bg-[hsl(var(--mood-happy))]" },
  { date: "4 days ago", mood: "Okay", color: "bg-muted" },
];

const insights = [
  {
    title: "Your mood patterns",
    description: "You tend to feel more positive in the mornings. Consider scheduling important tasks early in the day.",
    icon: TrendingUp,
  },
  {
    title: "Helpful resources",
    description: "Based on your recent mood logs, you might find breathing exercises helpful for managing anxiety.",
    icon: BookOpen,
  },
];

export default function Mood() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Mood Tracking</h1>
          <p className="text-muted-foreground">
            Track your daily emotions to better understand your mental wellbeing
          </p>
        </div>

        {/* Today's Mood Tracker */}
        <div className="mb-6">
          <MoodTracker />
        </div>

        {/* Mood History */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Mood History</h2>
          </div>
          
          <div className="space-y-3">
            {moodHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${entry.color}`}></div>
                  <span className="text-sm font-medium text-foreground">{entry.date}</span>
                </div>
                <span className="text-sm text-muted-foreground">{entry.mood}</span>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            View Full History
          </Button>
        </Card>

        {/* Insights */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary-soft))] flex items-center justify-center">
                    <insight.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Journal Entry</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">View Insights</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}