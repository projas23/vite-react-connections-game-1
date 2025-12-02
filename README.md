# Connections Game

A web-based puzzle game inspired by the NYT Connections, built with React, TypeScript, and MongoDB. Players group 16 words into 4 categories of 4 words each.

## 🎮 Live Demo

[Play the game here](https://vite-react-connections-game-1.vercel.app)

[View analytics dashboard](https://vite-react-connections-game-1.vercel.app/stats.html) (requires admin access)

## ✨ Features

- **Interactive gameplay** with visual feedback and animations
- **4 difficulty levels** with color-coded categories
- **Game state persistence** using localStorage
- **Real-time analytics** tracking with MongoDB
- **Admin dashboard** for viewing game statistics
- **Responsive design** optimized for desktop, tablet, and mobile
- **Dark mode support**

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Vercel Serverless Functions (Node.js)
- MongoDB Atlas for database
- RESTful API endpoints

**Deployment:**
- Vercel (automatic deployments from GitHub)

## 📊 Analytics Features

The game tracks the following metrics:
- Total plays
- Win/loss ratio
- Average mistakes per game
- Average completion time
- Categories solved and order
- Timestamp and session data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Vercel account for deployment

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/connections-game.git
cd connections-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET=your_admin_password
```

4. **Run locally**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
connections-game/
├── src/
│   ├── App.tsx           # Main game component
│   └── main.tsx          # Entry point
├── api/
│   ├── save-game.js      # API endpoint for saving game data
│   └── get-stats.js      # API endpoint for retrieving stats
├── public/
│   └── stats.html        # Admin analytics dashboard
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Save Game Data
```
POST /api/save-game
Content-Type: application/json

{
  "result": "won" | "lost",
  "mistakes": number,
  "timeToComplete": number,
  "categoriesSolved": [...]
}
```

### Get Statistics (Admin Only)
```
GET /api/get-stats?secret=YOUR_ADMIN_SECRET

Response:
{
  "totalPlays": number,
  "wins": number,
  "losses": number,
  "avgMistakes": number,
  "avgTimeToComplete": number,
  "plays": [...]
}
```

## 🎨 Customization

To customize the game categories, edit the `categories` object in `src/App.tsx`:

```typescript
const categories = {
  categoryName: {
    name: "DISPLAY NAME",
    words: ["WORD1", "WORD2", "WORD3", "WORD4"],
    color: "bg-purple-500", // Tailwind color class
    difficulty: "Hard"
  },
  // Add more categories...
}
```

## 🔐 Security Notes

- Admin dashboard is protected by a secret key
- API endpoints validate admin credentials
- User data is anonymized (IP addresses are hashed)
- No personally identifiable information is stored

## 📈 Future Enhancements

- [ ] Daily puzzle mode with new categories each day
- [ ] Leaderboard system
- [ ] Hint system
- [ ] Social sharing features
- [ ] Multiple difficulty modes
- [ ] Custom game creation

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

Built by Pedro Rojas

## 🙏 Acknowledgments

- Inspired by the New York Times Connections game
- Built as a portfolio project demonstrating full-stack development skills
