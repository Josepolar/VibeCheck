# VibeCheck 🎯

A web app that turns daily micro-goals into a social challenge board. Users set tiny goals (drink water, study 20 mins, go for a walk), friends can react, boost, or join the challenge. Built-in streaks, mood check-ins, and anonymous community support make self-improvement feel social, fun, and low-pressure.

## Features

### 🎯 Micro-Goals
- Create tiny, achievable daily goals
- Categorize goals (health, study, wellness, social, etc.)
- Public or private goal visibility
- Track daily completions

### 🔥 Streak Tracking
- Automatic streak counting for daily completions
- View current and longest streaks
- Visual streak displays for motivation

### 👥 Social Features
- React to friends' goals with emojis
- Boost goals to show support
- Join challenges by copying friends' goals
- Friend requests and connections

### 😊 Mood Check-ins
- Daily mood tracking with emoji selection
- Optional notes for mood entries
- View mood history over time

### 💬 Anonymous Community Support
- Post anonymous messages for support
- Browse community messages
- Low-pressure help and encouragement

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Security**: bcryptjs for password hashing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Josepolar/VibeCheck.git
cd VibeCheck
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults provided):
```env
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Goals
- `GET /api/goals` - Get public goals feed
- `GET /api/goals/my-goals` - Get user's goals
- `POST /api/goals` - Create a new goal
- `POST /api/goals/:id/complete` - Mark goal as completed today
- `POST /api/goals/:id/react` - React to a goal
- `POST /api/goals/:id/boost` - Boost a goal
- `POST /api/goals/:id/join` - Join a challenge
- `DELETE /api/goals/:id` - Delete a goal

### Mood Check-ins
- `POST /api/mood` - Create a mood check-in
- `GET /api/mood/my-moods` - Get user's mood history

### Community
- `POST /api/community/messages` - Post anonymous message
- `GET /api/community/messages` - Get community messages

### Friends
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `GET /api/friends/list` - Get friends list
- `GET /api/friends/goals` - Get friends' goals

## Database Schema

The app uses SQLite with the following tables:
- `users` - User accounts
- `goals` - User goals
- `streaks` - Streak tracking
- `daily_completions` - Daily goal completions
- `mood_checkins` - Mood check-in records
- `reactions` - Goal reactions
- `boosts` - Goal boosts
- `joined_challenges` - Joined challenges tracking
- `friendships` - Friend connections
- `community_messages` - Anonymous community messages

## Usage

1. **Sign Up/Login**: Create an account or login
2. **Create Goals**: Set your tiny daily goals
3. **Track Progress**: Mark goals complete each day
4. **Build Streaks**: Maintain daily streaks for motivation
5. **Social Interaction**: React, boost, or join friends' challenges
6. **Mood Check-ins**: Track your daily mood
7. **Community Support**: Share or read anonymous support messages

## Development

The application structure:
```
VibeCheck/
├── server.js                 # Main server file
├── server/
│   ├── config/
│   │   └── database.js      # Database initialization
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   └── routes/
│       ├── auth.js          # Authentication routes
│       ├── goals.js         # Goals routes
│       ├── mood.js          # Mood check-in routes
│       ├── community.js     # Community routes
│       └── friends.js       # Friends routes
├── public/
│   └── index.html           # Frontend application
└── package.json
```

## License

ISC
