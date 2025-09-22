import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  UserPlus, 
  MessageCircle, 
  Heart, 
  Send,
  Smile,
  MoreHorizontal,
  Clock,
  Check
} from "lucide-react";

const friends = [
  {
    id: 1,
    name: "Maya Chen",
    avatar: "MC",
    status: "online",
    lastSeen: "Active now",
    mood: "happy",
    moodColor: "bg-[hsl(var(--mood-happy))]",
    lastMessage: "Thanks for checking in! Feeling much better today 😊",
    timestamp: "2m ago",
    unread: 0,
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    avatar: "AR",
    status: "offline",
    lastSeen: "Last seen 1h ago",
    mood: "calm",
    moodColor: "bg-[hsl(var(--mood-calm))]",
    lastMessage: "The breathing exercise you shared really helped!",
    timestamp: "45m ago",
    unread: 2,
  },
  {
    id: 3,
    name: "Jordan Kim",
    avatar: "JK",
    status: "online",
    lastSeen: "Active now",
    mood: "anxious",
    moodColor: "bg-[hsl(var(--mood-anxious))]",
    lastMessage: "Having a tough day with the exam prep 😰",
    timestamp: "1h ago",
    unread: 1,
  },
];

const suggestedFriends = [
  { id: 4, name: "Sam Parker", avatar: "SP", mutualFriends: 3, reason: "From Anxiety Warriors community" },
  { id: 5, name: "Taylor Swift", avatar: "TS", mutualFriends: 1, reason: "Similar mood patterns" },
  { id: 6, name: "Casey Johnson", avatar: "CJ", mutualFriends: 5, reason: "Active in Sleep Better community" },
];

const wellnessReminders = [
  { id: 1, friend: "Maya Chen", message: "Haven't heard from you today - sending positive vibes! 💚", type: "check-in" },
  { id: 2, friend: "Alex Rodriguez", message: "Remember to take breaks during study sessions!", type: "reminder" },
];

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFriendData = selectedFriend ? friends.find(f => f.id === selectedFriend) : null;

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic here
      setMessageInput("");
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "calm": return "😌";
      case "anxious": return "😰";
      case "sad": return "😢";
      case "angry": return "😠";
      default: return "😊";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Friends</h1>
            <p className="text-muted-foreground">
              Stay connected with your wellness support network
            </p>
          </div>
          <Button className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Friends List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-0 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Active Friends */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Your Friends</h3>
              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend.id)}
                    className={`flex items-center gap-3 p-3 rounded-[var(--radius-sm)] cursor-pointer transition-colors ${
                      selectedFriend === friend.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {friend.avatar}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${friend.moodColor} border-2 border-background flex items-center justify-center`}>
                        <span className="text-xs">{getMoodEmoji(friend.mood)}</span>
                      </div>
                      {friend.status === "online" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground truncate">{friend.name}</p>
                        {friend.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {friend.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{friend.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{friend.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Suggested Friends */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Suggested Friends</h3>
              <div className="space-y-3">
                {suggestedFriends.map((person) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {person.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.reason}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 space-y-6">
            {selectedFriendData ? (
              <Card className="p-0 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {selectedFriendData.avatar}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${selectedFriendData.moodColor} border-2 border-background flex items-center justify-center`}>
                          <span className="text-xs">{getMoodEmoji(selectedFriendData.mood)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{selectedFriendData.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedFriendData.lastSeen}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {selectedFriendData.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-[var(--radius-sm)] p-3 max-w-md">
                        <p className="text-sm text-foreground">{selectedFriendData.lastMessage}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{selectedFriendData.timestamp}</span>
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-md">
                      <div className="bg-primary rounded-[var(--radius-sm)] p-3">
                        <p className="text-sm text-primary-foreground">
                          I'm here for you! Remember that tough times don't last, but tough people do 💪
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <Check className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">5m ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Send a supportive message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} size="icon" className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center h-[600px] flex items-center justify-center">
                <div>
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a friend to start chatting</p>
                </div>
              </Card>
            )}

            {/* Wellness Reminders */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Wellness Check-ins
              </h3>
              <div className="space-y-3">
                {wellnessReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-[var(--radius-sm)] bg-[hsl(var(--accent-soft))]">
                    <Clock className="h-4 w-4 text-accent mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Check in with {reminder.friend}
                      </p>
                      <p className="text-sm text-muted-foreground">{reminder.message}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Send
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}