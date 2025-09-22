import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, User, BookOpen, Heart, Award, Edit3 } from "lucide-react";

const userStats = [
  { label: "Posts", value: "12", icon: Edit3 },
  { label: "Saved", value: "28", icon: BookOpen },
  { label: "Helped", value: "45", icon: Heart },
  { label: "Streak", value: "7 days", icon: Award },
];

const achievements = [
  { name: "First Post", description: "Shared your first post with the community", unlocked: true },
  { name: "Mood Tracker", description: "Logged your mood for 7 consecutive days", unlocked: true },
  { name: "Helpful Member", description: "Received 50+ helpful votes", unlocked: false },
  { name: "Community Builder", description: "Joined 5+ communities", unlocked: false },
];

const recentActivity = [
  { action: "Posted", content: "Tips for managing exam stress", time: "2h ago" },
  { action: "Commented on", content: "Breathing exercises for anxiety", time: "1d ago" },
  { action: "Saved", content: "Building healthy study habits", time: "2d ago" },
  { action: "Helped", content: "Someone with sleep issues", time: "3d ago" },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Alex Johnson</h1>
                <p className="text-muted-foreground">Computer Science Student</p>
                <Badge variant="secondary" className="mt-1 text-xs">Active Supporter</Badge>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {userStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-muted mx-auto mb-2 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="font-semibold text-foreground text-lg">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-[var(--radius)] border-2 transition-all ${
                  achievement.unlocked
                    ? "border-primary bg-[hsl(var(--primary-soft))]"
                    : "border-border bg-muted/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${
                  achievement.unlocked 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Award className="h-4 w-4" />
                </div>
                <h3 className={`font-medium text-sm ${
                  achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-muted-foreground">"{activity.content}"</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Activity
          </Button>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto p-4 flex-col gap-2">
            <Settings className="h-5 w-5" />
            <span className="text-sm">Settings</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">My Posts</span>
          </Button>
        </div>
      </div>
    </div>
  );
}