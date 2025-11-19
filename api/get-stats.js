import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // Check secret key (only you can access)
  const { secret } = req.query;
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('connections-game');
    
    const games = await db.collection('games').find({}).sort({ timestamp: -1 }).toArray();

    const stats = {
      totalPlays: games.length,
      wins: games.filter(g => g.result === 'won').length,
      losses: games.filter(g => g.result === 'lost').length,
      avgMistakes: games.length > 0 
        ? (games.reduce((sum, g) => sum + (g.mistakes || 0), 0) / games.length).toFixed(2)
        : 0,
      avgTimeToComplete: games.length > 0
        ? (games.reduce((sum, g) => sum + (g.timeToComplete || 0), 0) / games.length).toFixed(0)
        : 0,
      plays: games.map(g => ({
        timestamp: g.timestamp,
        result: g.result,
        mistakes: g.mistakes,
        timeToComplete: g.timeToComplete,
        categoriesSolved: g.categoriesSolved,
        ipHash: g.ipHash
      }))
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
