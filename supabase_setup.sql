-- =====================================================================
-- PRISM LIVE - Production Supabase SQL Setup & Seed Data Script
-- Paste this entire script into your Supabase SQL Editor and click "Run"
-- Supabase Project Ref: ayabomkpawjryvbyvqhr
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-provisioning
DROP TABLE IF EXISTS stream_analytics CASCADE;
DROP TABLE IF EXISTS bans CASCADE;
DROP TABLE IF EXISTS channel_moderators CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS clips CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS stream_sessions CASCADE;
DROP TABLE IF EXISTS stream_tags CASCADE;
DROP TABLE IF EXISTS streams CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;

-- 1. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'creator', 'moderator', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    country VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATORS
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_verified BOOLEAN DEFAULT FALSE,
    partner_tier VARCHAR(20) DEFAULT 'affiliate' CHECK (partner_tier IN ('affiliate', 'partner', 'ambassador')),
    revenue_share_percentage DECIMAL(5,2) DEFAULT 85.00,
    follower_count INT DEFAULT 0,
    subscriber_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CHANNELS
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID UNIQUE NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Welcome to my stream!',
    description TEXT,
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    rtmp_url TEXT DEFAULT 'rtmp://ingest.prismlive.io/live',
    is_live BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    icon_name VARCHAR(50),
    live_stream_count INT DEFAULT 0,
    total_viewers INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SUBCATEGORIES
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. STREAMS
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    thumbnail_url TEXT,
    language VARCHAR(10) DEFAULT 'en',
    is_live BOOLEAN DEFAULT TRUE,
    current_viewers INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CHAT MESSAGES
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    user_badge VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY & PUBLIC READ POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read Streams" ON streams FOR SELECT USING (true);
CREATE POLICY "Public Read Creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Public Read Chat Messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Chat Messages" ON chat_messages FOR INSERT WITH CHECK (true);

-- SEED 12 CATEGORIES
INSERT INTO categories (id, name, slug, description, cover_image_url, live_stream_count, total_viewers) VALUES
('c1000000-0000-0000-0000-000000000001', 'Gaming', 'gaming', 'Live gameplay, speedruns, esports tournaments, and interactive gaming communities.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', 542, 289400),
('c1000000-0000-0000-0000-000000000002', 'Entertainment', 'entertainment', 'Live comedy, reality shows, variety acts, celebrity broadcasts, and interactive challenges.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', 210, 142800),
('c1000000-0000-0000-0000-000000000003', 'Podcasts', 'podcasts', 'Live video podcasts, expert interviews, technology discussions, and personal growth talks.', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80', 318, 198400),
('c1000000-0000-0000-0000-000000000004', 'Music', 'music', 'Live DJ sets, synthwave concerts, freestyle sessions, music production, and live vocals.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', 195, 176200),
('c1000000-0000-0000-0000-000000000005', 'Sports', 'sports', 'Live sports analysis, watch parties, boxing, MMA scrims, football banter, and commentary.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80', 412, 231000),
('c1000000-0000-0000-0000-000000000006', 'Technology', 'technology', 'Software engineering, live coding, AI model building, gadgets, cybersecurity, and startups.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', 284, 154100),
('c1000000-0000-0000-0000-000000000007', 'Education', 'education', 'Interactive tutorials, math & science masterclasses, language learning, and career development.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80', 140, 89300),
('c1000000-0000-0000-0000-000000000008', 'Creative', 'creative', 'Digital art, 3D modeling, Blender jams, photography editing, design systems, and animation.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 164, 92600),
('c1000000-0000-0000-0000-000000000009', 'Lifestyle', 'lifestyle', 'Travel vlogs, live cooking shows, fitness workouts, fashion, beauty, and daily vlogs.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80', 230, 112400),
('c1000000-0000-0000-0000-000000000010', 'Talk & Discussion', 'talk', 'Live Q&A, current event debates, community roundtables, advice panels, and philosophy.', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80', 290, 165000),
('c1000000-0000-0000-0000-000000000011', 'News', 'news', 'Breaking global news broadcasts, political analysis, market trends, and world events.', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80', 180, 210500),
('c1000000-0000-0000-0000-000000000012', 'IRL', 'irl', 'In real life outdoor adventures, Tokyo nightwalks, event coverage, and city exploration.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', 310, 189300);

-- SEED SUBCATEGORIES FOR PODCASTS, TECH, MUSIC & GAMING
INSERT INTO subcategories (category_id, name, slug, description) VALUES
('c1000000-0000-0000-0000-000000000003', 'Technology', 'podcasts-technology', 'Live technology and AI discussions'),
('c1000000-0000-0000-0000-000000000003', 'Interviews', 'podcasts-interviews', 'Founder and celebrity live interviews'),
('c1000000-0000-0000-0000-000000000006', 'Programming', 'tech-programming', 'Fullstack React, Rust and AI live coding'),
('c1000000-0000-0000-0000-000000000004', 'DJ', 'music-dj', 'Electronic music & Synthwave live sets');
