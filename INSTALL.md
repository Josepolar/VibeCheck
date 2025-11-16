# VibeCheck Installation Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Josepolar/VibeCheck.git
   cd VibeCheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to: http://localhost:3001

## Development Mode

For development with auto-reload:
```bash
npm run dev
```

## Configuration (Optional)

Create a `.env` file in the root directory to customize settings:

```env
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Note**: The `.env` file is optional. Default values are provided.

## First Time Setup

1. Open http://localhost:3001
2. Click "Sign Up" to create an account
3. Start creating your micro-goals!

## Features to Try

### Create Your First Goal
1. Fill in the "Create a Micro-Goal" form
2. Choose a category (health, study, wellness, social, other)
3. Click "Create Goal"
4. Your goal appears in the Challenge Board and My Streaks

### Build a Streak
1. Click "Mark Complete Today" on any of your goals
2. Complete it daily to build your streak
3. Watch your fire emoji count grow! 🔥

### Social Interaction
1. React to others' goals with 👍
2. Boost goals with 🚀 to show support
3. Join challenges to copy and track similar goals

### Mood Check-in
1. Click on a mood emoji (😊 😐 😔 💪 😰)
2. Optionally add a note about how you're feeling
3. Track your mood over time

### Community Support
1. Post anonymous messages for support or encouragement
2. Read others' messages
3. Feel the community support without pressure

## Troubleshooting

### Port Already in Use
If port 3001 is already in use, change the port in `.env`:
```env
PORT=3002
```

### Database Issues
The SQLite database is created automatically on first run.
If you encounter issues, delete `vibecheck.db` and restart the server.

### Module Not Found
Make sure you've run `npm install` before starting the server.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite (file-based, no setup needed)
- **Frontend**: Vanilla JavaScript
- **Authentication**: JWT tokens

## Security Note

For production deployment:
- Change the JWT_SECRET to a strong, random value
- Add rate limiting middleware
- Use HTTPS
- Configure proper CORS settings
- Use a production-grade database (PostgreSQL, MySQL)

## Support

For issues or questions, please open an issue on GitHub.

Enjoy VibeCheck! 🎯
