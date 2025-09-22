-- Phase 1: Core Database Schema for Advanced Vibenest Features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE mood_intensity AS ENUM ('very_low', 'low', 'moderate', 'high', 'very_high');
CREATE TYPE crisis_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE user_role AS ENUM ('student', 'therapist', 'admin', 'institution_admin');
CREATE TYPE challenge_status AS ENUM ('not_started', 'in_progress', 'completed', 'abandoned');
CREATE TYPE intervention_status AS ENUM ('detected', 'notified', 'escalated', 'resolved');

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    institution TEXT,
    year_of_study INTEGER,
    department TEXT,
    bio TEXT,
    avatar_url TEXT,
    privacy_level TEXT DEFAULT 'private' CHECK (privacy_level IN ('public', 'friends', 'private')),
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "crisis_alerts": true}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Mood entries table
CREATE TABLE public.mood_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    intensity mood_intensity NOT NULL,
    context TEXT,
    triggers TEXT[],
    coping_strategies TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Journal entries table
CREATE TABLE public.journal_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood_at_time INTEGER CHECK (mood_at_time >= 1 AND mood_at_time <= 10),
    ai_analysis JSONB,
    crisis_flags TEXT[],
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community posts table
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mood_context INTEGER CHECK (mood_context >= 1 AND mood_context <= 10),
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT false,
    crisis_detected BOOLEAN DEFAULT false,
    crisis_severity crisis_severity,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Post comments table
CREATE TABLE public.post_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User connections (friendships)
CREATE TABLE public.user_connections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(requester_id, addressee_id)
);

-- Trusted contacts for crisis situations
CREATE TABLE public.trusted_contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    relationship TEXT,
    is_emergency_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crisis alerts and interventions
CREATE TABLE public.crisis_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID, -- Could reference journal_entries or posts
    content_type TEXT CHECK (content_type IN ('journal', 'post', 'message')),
    severity crisis_severity NOT NULL,
    ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
    detected_keywords TEXT[],
    status intervention_status DEFAULT 'detected',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievements and badges
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    category TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    earned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Wellness challenges
CREATE TABLE public.challenges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    category TEXT,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    instructions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User challenge progress
CREATE TABLE public.user_challenge_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    status challenge_status DEFAULT 'not_started',
    current_day INTEGER DEFAULT 0,
    completion_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- Daily boosts (quotes, activities)
CREATE TABLE public.daily_boosts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('quote', 'activity', 'tip')),
    category TEXT,
    author TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support groups
CREATE TABLE public.support_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    topic TEXT,
    is_anonymous BOOLEAN DEFAULT true,
    member_count INTEGER DEFAULT 0,
    moderator_id UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group memberships
CREATE TABLE public.group_memberships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_moderator BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- Group messages
CREATE TABLE public.group_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    crisis_detected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mentor relationships
CREATE TABLE public.mentor_relationships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'paused')),
    matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can manage their own mood entries" ON public.mood_entries
FOR ALL USING (auth.uid() = user_id);

-- Journal entries policies  
CREATE POLICY "Users can manage their own journal entries" ON public.journal_entries
FOR ALL USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Users can view public posts" ON public.posts
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own posts" ON public.posts
FOR ALL USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Users can view comments on posts" ON public.post_comments
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own comments" ON public.post_comments
FOR ALL USING (auth.uid() = user_id);

-- User connections policies
CREATE POLICY "Users can view their connections" ON public.user_connections
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create connection requests" ON public.user_connections
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connection requests" ON public.user_connections
FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Trusted contacts policies
CREATE POLICY "Users can manage their trusted contacts" ON public.trusted_contacts
FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

-- Achievements are public read
CREATE POLICY "Anyone can view achievements" ON public.achievements
FOR SELECT USING (true);

-- Challenge progress policies
CREATE POLICY "Users can manage their challenge progress" ON public.user_challenge_progress
FOR ALL USING (auth.uid() = user_id);

-- Challenges are public read
CREATE POLICY "Anyone can view challenges" ON public.challenges
FOR SELECT USING (is_active = true);

-- Daily boosts are public read
CREATE POLICY "Anyone can view daily boosts" ON public.daily_boosts
FOR SELECT USING (is_active = true);

-- Support groups policies
CREATE POLICY "Users can view active support groups" ON public.support_groups
FOR SELECT USING (is_active = true);

-- Group membership policies
CREATE POLICY "Users can view their group memberships" ON public.group_memberships
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join groups" ON public.group_memberships
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Group messages policies
CREATE POLICY "Group members can view messages" ON public.group_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.group_memberships 
        WHERE group_id = group_messages.group_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Group members can post messages" ON public.group_messages
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.group_memberships 
        WHERE group_id = group_messages.group_id 
        AND user_id = auth.uid()
    )
);

-- Mentor relationship policies
CREATE POLICY "Users can view their mentor relationships" ON public.mentor_relationships
FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can create mentor requests" ON public.mentor_relationships
FOR INSERT WITH CHECK (auth.uid() = mentee_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON public.mood_entries(created_at DESC);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_crisis_alerts_user_id ON public.crisis_alerts(user_id);
CREATE INDEX idx_crisis_alerts_severity ON public.crisis_alerts(severity);
CREATE INDEX idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX idx_group_messages_created_at ON public.group_messages(created_at DESC);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_connections_updated_at
    BEFORE UPDATE ON public.user_connections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
    
    -- Assign default student role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, points) VALUES
('First Journal Entry', 'Write your first journal entry', '📝', 'journaling', 10),
('Daily Mood Tracker', 'Log your mood for 7 consecutive days', '📊', 'mood', 50),
('Community Helper', 'Receive 10 likes on your supportive comments', '🤝', 'community', 25),
('Wellness Warrior', 'Complete your first wellness challenge', '🌟', 'challenges', 100),
('Mindful Moments', 'Complete 10 meditation sessions', '🧘', 'mindfulness', 75),
('Sleep Champion', 'Maintain good sleep habits for 2 weeks', '😴', 'sleep', 150),
('Gratitude Guardian', 'Write 30 gratitude entries', '🙏', 'gratitude', 200);

-- Insert sample wellness challenges
INSERT INTO public.challenges (name, description, duration_days, category, difficulty_level, instructions) VALUES
('Digital Detox Week', 'Reduce screen time and focus on offline activities', 7, 'digital_wellness', 3, '{"daily_goals": ["Set phone to Do Not Disturb for 2 hours", "Read a book instead of scrolling", "Take a walk without phone"]}'),
('Sleep Reset Challenge', 'Establish healthy sleep patterns', 14, 'sleep', 2, '{"daily_goals": ["Sleep by 10 PM", "No screens 1 hour before bed", "Wake up at consistent time"]}'),
('Gratitude Practice', 'Cultivate daily gratitude habits', 21, 'mindfulness', 1, '{"daily_goals": ["Write 3 things you are grateful for", "Thank someone in your life", "Practice mindful appreciation"]}'),
('Stress Buster Week', 'Learn and practice stress management techniques', 7, 'stress_management', 3, '{"daily_goals": ["Practice deep breathing for 10 minutes", "Try a new stress relief technique", "Reflect on stress triggers"]}');

-- Insert daily boosts
INSERT INTO public.daily_boosts (content, type, category, author) VALUES
('Take three deep breaths and remember: you are capable of handling whatever comes your way today.', 'activity', 'mindfulness', 'Vibenest Team'),
('Your mental health is just as important as your physical health. Both deserve attention and care.', 'quote', 'self_care', 'Anonymous'),
('Write down one thing you accomplished today, no matter how small. Progress is progress.', 'activity', 'productivity', 'Vibenest Team'),
('You are not alone in your struggles. Reaching out for help is a sign of strength, not weakness.', 'quote', 'support', 'Mental Health Advocate'),
('Take a 5-minute break to step outside and notice something beautiful in nature.', 'activity', 'nature', 'Vibenest Team');