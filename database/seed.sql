-- VibeCheck Sample Data

-- Insert Sample Users
INSERT INTO users (username, email, password_hash, full_name, bio) VALUES
('john_doe', 'john@example.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'John Doe', 'Creative designer and mood enthusiast'),
('jane_smith', 'jane@example.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Jane Smith', 'Art lover and digital creator'),
('alex_wonder', 'alex@example.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Alex Wonder', 'Photography and aesthetic explorer'),
('emma_creative', 'emma@example.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Emma Creative', 'Minimalist designer'),
('mike_vibes', 'mike@example.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Mike Vibes', 'Music and visual arts enthusiast');

-- Insert Sample Admins
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin_super', 'admin@vibecheck.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Super Admin', 'super_admin'),
('mod_sarah', 'sarah@vibecheck.com', '$2b$10$XQvZ5jN9W6M4.Bb3YQZ5Z.G4K4K4K4K4K4K4K4K4K4K4K4K4K4', 'Sarah Moderator', 'moderator');

-- Insert Sample Communities
INSERT INTO communities (name, description, category, created_by, member_count) VALUES
('Aesthetic Vibes', 'Share your aesthetic mood boards and inspiration', 'Art & Design', 1, 150),
('Minimalist Living', 'Clean, simple, and beautiful designs', 'Lifestyle', 2, 230),
('Nature Photography', 'Capture the beauty of nature', 'Photography', 3, 180),
('Retro Wave', 'Vintage and retro-inspired aesthetics', 'Art & Design', 1, 95),
('Urban Exploration', 'City life and street photography', 'Photography', 4, 120);

-- Insert Sample Moodboards
INSERT INTO moodboards (user_id, title, description, mood_category, tags, is_public, likes_count, views_count) VALUES
(1, 'Summer Vibes 2024', 'Bright and sunny summer aesthetic', 'Happy', '["summer", "bright", "warm", "beach"]', TRUE, 45, 320),
(2, 'Minimalist Workspace', 'Clean and productive work environment', 'Calm', '["minimal", "workspace", "productivity", "clean"]', TRUE, 67, 450),
(3, 'Nature Serenity', 'Peaceful natural landscapes', 'Peaceful', '["nature", "landscape", "green", "calm"]', TRUE, 89, 560),
(1, 'Dark Academia', 'Classic literature and vintage vibes', 'Mysterious', '["academia", "vintage", "books", "classic"]', TRUE, 123, 780),
(4, 'Pastel Dreams', 'Soft pastel color palette', 'Dreamy', '["pastel", "soft", "pink", "aesthetic"]', TRUE, 56, 390),
(5, 'Cyberpunk City', 'Neon lights and futuristic urban scenes', 'Energetic', '["cyberpunk", "neon", "city", "future"]', TRUE, 94, 620);

-- Insert Sample Posts
INSERT INTO posts (user_id, community_id, moodboard_id, content, post_type, likes_count, comments_count) VALUES
(1, 1, 1, 'Just created a new summer-inspired moodboard! Check it out!', 'moodboard', 23, 5),
(2, 2, 2, 'Finally got my workspace exactly how I wanted it. Minimal and functional!', 'moodboard', 34, 8),
(3, 3, 3, 'Spent the weekend hiking and captured these amazing views', 'moodboard', 45, 12),
(1, 4, NULL, 'Anyone else obsessed with the dark academia aesthetic?', 'text', 19, 7),
(4, 1, 5, 'Pastel color palettes are my favorite for spring!', 'moodboard', 28, 6);

-- Insert Sample Reports
INSERT INTO reports (reporter_id, reported_user_id, post_id, reason, description, status) VALUES
(2, 5, NULL, 'Inappropriate content', 'User posted offensive material', 'pending'),
(3, NULL, 4, 'Spam', 'This post appears to be spam', 'reviewed');

-- Insert Sample Logs
INSERT INTO logs (admin_id, action_type, target_type, target_id, description) VALUES
(1, 'user_suspended', 'user', 5, 'Suspended user for violating community guidelines'),
(2, 'report_reviewed', 'report', 1, 'Reviewed report #1 and took action'),
(1, 'community_created', 'community', 5, 'Created new community: Urban Exploration'),
(1, 'post_removed', 'post', 4, 'Removed post for spam violation');

-- Update community member counts (if needed)
UPDATE communities SET member_count = (SELECT COUNT(*) FROM posts WHERE posts.community_id = communities.community_id);
