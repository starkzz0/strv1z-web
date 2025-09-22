import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  Heart,
  MessageCircle,
  Shield,
  Clock
} from "lucide-react";

const moodTrendData = [
  { period: "This Week", happy: 45, calm: 30, anxious: 15, sad: 10 },
  { period: "Last Week", happy: 40, calm: 35, anxious: 20, sad: 5 },
  { period: "This Month", happy: 42, calm: 32, anxious: 18, sad: 8 },
];

const crisisAlerts = [
  { id: 1, user: "Anonymous User #1247", severity: "High", timestamp: "2h ago", status: "Contacted" },
  { id: 2, user: "Anonymous User #8934", severity: "Medium", timestamp: "5h ago", status: "Pending" },
  { id: 3, user: "Anonymous User #2156", severity: "High", timestamp: "1d ago", status: "Resolved" },
];

const communityStats = [
  { name: "Exam Support", members: 1247, posts: 89, activity: "High", growth: "+12%" },
  { name: "Anxiety Warriors", members: 892, posts: 156, activity: "Very High", growth: "+8%" },
  { name: "Sleep Better", members: 634, posts: 67, activity: "Medium", growth: "+15%" },
  { name: "LGBTQ+ Students", members: 445, posts: 78, activity: "High", growth: "+20%" },
];

const therapistSessions = [
  { therapist: "Dr. Sarah Martinez", sessions: 24, rating: 4.9, specialization: "Anxiety & Depression" },
  { therapist: "Dr. Michael Chen", sessions: 18, rating: 4.8, specialization: "Student Counseling" },
  { therapist: "Dr. Emily Rodriguez", sessions: 31, rating: 4.9, specialization: "Crisis Intervention" },
];

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [alertFilter, setAlertFilter] = useState("all");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-success text-success-foreground";
      case "Contacted": return "bg-primary text-primary-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "Very High": return "text-success";
      case "High": return "text-primary";
      case "Medium": return "text-warning";
      case "Low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor student mental health trends and community wellness
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary-soft))] flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3,218</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent-soft))] flex items-center justify-center">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.2/5</p>
                <p className="text-sm text-muted-foreground">Avg Mood</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary-soft))] flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,847</p>
                <p className="text-sm text-muted-foreground">Posts Today</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--mood-angry))] flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Crisis Alerts</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mood Trends */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Student Mood Trends
              </h3>
              <Select defaultValue="week">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              {moodTrendData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.period}</span>
                    <span className="text-muted-foreground">100 responses</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                    <div 
                      className="bg-[hsl(var(--mood-happy))]" 
                      style={{ width: `${data.happy}%` }}
                    />
                    <div 
                      className="bg-[hsl(var(--mood-calm))]" 
                      style={{ width: `${data.calm}%` }}
                    />
                    <div 
                      className="bg-[hsl(var(--mood-anxious))]" 
                      style={{ width: `${data.anxious}%` }}
                    />
                    <div 
                      className="bg-[hsl(var(--mood-sad))]" 
                      style={{ width: `${data.sad}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>😊 {data.happy}%</span>
                    <span>😌 {data.calm}%</span>
                    <span>😰 {data.anxious}%</span>
                    <span>😢 {data.sad}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Crisis Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Crisis Alerts
              </h3>
              <Select value={alertFilter} onValueChange={setAlertFilter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              {crisisAlerts.map((alert) => (
                <div key={alert.id} className="space-y-2 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{alert.user}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </div>
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              View All Alerts
            </Button>
          </Card>
        </div>

        {/* Community Health & Therapist Sessions */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Community Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Community Health
            </h3>
            
            <div className="space-y-4">
              {communityStats.map((community, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{community.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {community.members.toLocaleString()} members • {community.posts} posts
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getActivityColor(community.activity)}`}>
                      {community.activity}
                    </div>
                    <div className="text-xs text-success">{community.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Therapist Sessions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Therapist Performance
            </h3>
            
            <div className="space-y-4">
              {therapistSessions.map((therapist, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{therapist.therapist}</p>
                    <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {therapist.sessions} sessions
                    </div>
                    <div className="text-xs text-success">⭐ {therapist.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}