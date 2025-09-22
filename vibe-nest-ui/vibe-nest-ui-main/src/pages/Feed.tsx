import { useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { MoodTracker } from "@/components/mood/MoodTracker";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const samplePosts = [
  {
    id: "1",
    author: "Sarah M",
    timeAgo: "2h ago",
    title: "Anyone else feeling overwhelmed with final exams?",
    content: "I've been studying for weeks but still feel like I'm behind. The pressure is getting to me and I'm having trouble sleeping. Would love to hear how others are coping with exam stress.",
    tags: ["ExamStress", "StudentLife", "Anxiety"],
    likes: 24,
    comments: 8,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "2",
    author: "Dr. Martinez",
    timeAgo: "4h ago",
    title: "5 Quick Breathing Exercises for Instant Calm",
    content: "Here are some evidence-based breathing techniques you can use anywhere: 1) Box breathing (4-4-4-4 count) 2) 4-7-8 technique 3) Simple belly breathing. Try these during stressful moments!",
    tags: ["MentalHealth", "BreathingExercises", "Wellness"],
    likes: 89,
    comments: 12,
    isLiked: true,
    isVerified: true,
  },
  {
    id: "3",
    author: "Anonymous",
    isAnonymous: true,
    timeAgo: "6h ago",
    title: "Struggling with social anxiety in group projects",
    content: "Every time we have group assignments, I get so anxious about speaking up or sharing my ideas. I end up doing most of the work alone just to avoid confrontation. Has anyone found ways to manage this?",
    tags: ["SocialAnxiety", "GroupWork", "Confidence"],
    likes: 15,
    comments: 23,
    isSaved: false,
  },
  {
    id: "4",
    author: "Mike Chen",
    timeAgo: "8h ago",
    title: "Celebrating small wins: Went to class despite feeling down",
    content: "Yesterday was tough but I made it to all my classes. Sometimes just showing up is enough. Reminded myself that progress isn't always linear and that's okay. 🌱",
    tags: ["SelfCare", "Progress", "Motivation"],
    likes: 67,
    comments: 18,
    isLiked: true,
  }
];

const tabs = ["Trending", "Latest", "Following"];

export default function Feed() {
  const [activeTab, setActiveTab] = useState("Trending");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Mood Tracker */}
        <div className="mb-6">
          <MoodTracker />
        </div>

        {/* Feed Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex border border-border rounded-[var(--radius-sm)] bg-muted p-1">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`rounded-[var(--radius-sm)] ${
                  activeTab === tab 
                    ? "bg-background shadow-sm" 
                    : "hover:bg-transparent"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          <Button
            size="sm"
            className="md:hidden bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground rounded-[var(--radius-sm)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {samplePosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="w-full md:w-auto">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}