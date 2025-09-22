import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Headphones, Download, Bookmark } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "stress", name: "Stress Management", color: "bg-[hsl(var(--mood-anxious))] text-white", count: 15 },
  { id: "sleep", name: "Better Sleep", color: "bg-[hsl(var(--mood-calm))] text-white", count: 12 },
  { id: "anxiety", name: "Anxiety Support", color: "bg-[hsl(var(--secondary))] text-white", count: 18 },
  { id: "mindfulness", name: "Mindfulness", color: "bg-[hsl(var(--accent))] text-white", count: 22 },
  { id: "relationships", name: "Relationships", color: "bg-[hsl(var(--mood-happy))] text-white", count: 9 },
  { id: "academic", name: "Academic Success", color: "bg-[hsl(var(--primary))] text-white", count: 14 },
];

const resources = [
  {
    id: "1",
    title: "Progressive Muscle Relaxation Guide",
    type: "audio",
    duration: "15 min",
    category: "stress",
    description: "A step-by-step audio guide to help you release tension and find calm.",
    isSaved: false,
  },
  {
    id: "2",
    title: "Building Healthy Study Habits",
    type: "article",
    readTime: "8 min read",
    category: "academic",
    description: "Evidence-based strategies for sustainable learning and better retention.",
    isSaved: true,
  },
  {
    id: "3",
    title: "Mindful Breathing for Anxiety",
    type: "video",
    duration: "12 min",
    category: "anxiety",
    description: "Learn practical breathing techniques to manage anxiety in real-time.",
    isSaved: false,
  },
  {
    id: "4",
    title: "Sleep Hygiene Checklist",
    type: "article",
    readTime: "5 min read",
    category: "sleep",
    description: "Simple changes to improve your sleep quality and energy levels.",
    isSaved: false,
  },
];

const getResourceIcon = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "audio": return Headphones;
    default: return BookOpen;
  }
};

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Wellness Resources</h1>
          <p className="text-muted-foreground">
            Curated resources to support your mental health and wellbeing journey
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`h-auto p-4 flex-col gap-2 border-2 transition-all ${
                  selectedCategory === category.id 
                    ? "border-primary bg-[hsl(var(--primary-soft))]" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.count} resources</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filter */}
        {selectedCategory && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Showing:</span>
              <Badge variant="secondary" className="gap-2">
                {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            </div>
          </div>
        )}

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const IconComponent = getResourceIcon(resource.type);
            return (
              <Card key={resource.id} className="p-6 hover:shadow-[var(--shadow-card)] transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{resource.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{resource.duration || resource.readTime}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {categories.find(c => c.id === resource.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bookmark className={`h-4 w-4 ${resource.isSaved ? "fill-current text-primary" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}