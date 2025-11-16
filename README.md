# VibeCheck 🎨

**VibeCheck** is a full-stack moodboard platform where users can create, share, and discover inspiring visual collections. Built with React.js, Node.js/Express, and MySQL.

## ✨ Features

### User Features
- 🔐 User authentication (Register/Login with JWT)
- 🎨 Create and manage moodboards
- 📱 Browse community moodboards
- 🏷️ Tag and categorize by mood
- ❤️ Like and view counters
- 👤 User profiles

### Admin Features
- 📊 Admin dashboard with statistics
- 👥 User management
- 📝 Content moderation
- 📜 Activity logs
- ⚠️ Report management

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting

## 📁 Project Structure

```
VibeCheck/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (Auth)
│   │   ├── utils/           # API utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Database & Cloudinary config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── .env
│   └── package.json
│
└── database/                 # SQL files
    ├── schema.sql           # Database schema
    └── seed.sql             # Sample data
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- XAMPP (or any MySQL server)

### 1. Database Setup

Start your MySQL server (XAMPP) and create the database:

```sql
CREATE DATABASE vibecheck;
```

Import the schema and seed data:

```bash
mysql -u root -p vibecheck < database/schema.sql
mysql -u root -p vibecheck < database/seed.sql
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file (already created, update if needed):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vibecheck

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account

### Moodboards
- `GET /api/moodboards/public` - Get all public moodboards
- `GET /api/moodboards/:id` - Get moodboard by ID
- `POST /api/moodboards` - Create moodboard (auth required)
- `PUT /api/moodboards/:id` - Update moodboard (auth required)
- `DELETE /api/moodboards/:id` - Delete moodboard (auth required)
- `POST /api/moodboards/:id/like` - Like moodboard (auth required)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/logs` - Get activity logs

## 🎯 Usage

### For Users
1. Register or login to your account
2. Browse moodboards on the home page
3. Create new moodboards with titles, descriptions, and tags
4. Explore community moodboards by mood category
5. Like and view moodboards from other users

### For Admins
1. Login with admin credentials at `/admin/login`
2. View dashboard statistics
3. Manage users and content
4. Review activity logs
5. Handle reports

## 🔐 Default Credentials

### Sample User
- Email: `john@example.com`
- Password: (Use the hashed password or create new user)

### Sample Admin
- Email: `admin@vibecheck.com`
- Password: (Use the hashed password or create new admin)

**Note:** Change default passwords in production!

## 🖼️ Cloudinary Setup (Optional)

For image uploads, create a free account at [Cloudinary](https://cloudinary.com/) and add your credentials to the backend `.env` file.

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 👨‍💻 Author

Created with ❤️ for the VibeCheck community

---

**Happy Moodboarding! 🎨✨**
