import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Globe, 
  Shield,
  Calendar,
  Video,
  MessageCircle,
  Filter
} from "lucide-react";

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Martinez",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    specialization: ["Anxiety", "Depression", "Student Counseling"],
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviewCount: 127,
    location: "New York, NY",
    availability: "Available Today",
    sessionTypes: ["Video", "In-Person", "Chat"],
    experience: "8 years",
    verified: true,
    rate: "$120/session",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    specialization: ["ADHD", "Academic Stress", "Life Transitions"],
    languages: ["English", "Mandarin"],
    rating: 4.8,
    reviewCount: 89,
    location: "San Francisco, CA",
    availability: "Next Available: Tomorrow",
    sessionTypes: ["Video", "Chat"],
    experience: "6 years",
    verified: true,
    rate: "$110/session",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    photo: "https://images.unsplash.com/photo-1594824297862-0ad24ac046bd?w=150&h=150&fit=crop&crop=face",
    specialization: ["Crisis Intervention", "Trauma", "PTSD"],
    languages: ["English", "Portuguese"],
    rating: 4.9,
    reviewCount: 156,
    location: "Miami, FL",
    availability: "Available Now",
    sessionTypes: ["Video", "In-Person", "Emergency"],
    experience: "12 years",
    verified: true,
    rate: "$150/session",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    specialization: ["Relationship Issues", "Social Anxiety", "Self-Esteem"],
    languages: ["English", "French"],
    rating: 4.7,
    reviewCount: 203,
    location: "Seattle, WA",
    availability: "Available Today",
    sessionTypes: ["Video", "In-Person"],
    experience: "10 years",
    verified: true,
    rate: "$130/session",
  },
];

const specializations = ["All", "Anxiety", "Depression", "ADHD", "Trauma", "Student Counseling", "Crisis Intervention"];
const sessionTypes = ["All", "Video", "In-Person", "Chat", "Emergency"];

export default function Therapists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [selectedSessionType, setSelectedSessionType] = useState("All");

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === "All" || 
                                 therapist.specialization.includes(selectedSpecialization);
    const matchesSessionType = selectedSessionType === "All" || 
                              therapist.sessionTypes.includes(selectedSessionType);
    return matchesSearch && matchesSpecialization && matchesSessionType;
  });

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes("Available Now")) return "text-success";
    if (availability.includes("Available Today")) return "text-primary";
    return "text-warning";
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Find a Therapist</h1>
          <p className="text-muted-foreground">
            Connect with licensed mental health professionals who understand student life
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Session Type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Therapist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((therapist) => (
            <Card key={therapist.id} className="p-6 hover:shadow-[var(--shadow-card)] transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={therapist.photo}
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {therapist.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{therapist.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-current text-warning" />
                      <span className="text-sm font-medium">{therapist.rating}</span>
                      <span className="text-sm text-muted-foreground">({therapist.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialization.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {therapist.specialization.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{therapist.specialization.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{therapist.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{therapist.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${getAvailabilityColor(therapist.availability)}`} />
                    <span className={getAvailabilityColor(therapist.availability)}>
                      {therapist.availability}
                    </span>
                  </div>
                </div>

                {/* Session Types */}
                <div className="flex gap-1">
                  {therapist.sessionTypes.map((type) => {
                    const getIcon = () => {
                      switch (type) {
                        case "Video": return <Video className="h-3 w-3" />;
                        case "Chat": return <MessageCircle className="h-3 w-3" />;
                        case "In-Person": return <MapPin className="h-3 w-3" />;
                        case "Emergency": return <Shield className="h-3 w-3" />;
                        default: return null;
                      }
                    };
                    return (
                      <Badge key={type} variant="secondary" className="text-xs gap-1">
                        {getIcon()}
                        {type}
                      </Badge>
                    );
                  })}
                </div>

                {/* Rate and Actions */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{therapist.rate}</span>
                    <span className="text-sm text-muted-foreground">{therapist.experience} experience</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No therapists found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialization("All");
                setSelectedSessionType("All");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}