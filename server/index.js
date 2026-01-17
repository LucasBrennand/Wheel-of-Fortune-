import express from 'express';
import { getWeightedPrize } from './utils/probability.js';
import db from './data/db.js';

const app = express();
app.use(express.json());

const PRIZES = [
  { id: 0, label: '-5%', weight: 60 },
  { id: 1, label: '-10%', weight: 25 },
  { id: 2, label: '-20%', weight: 10 },
  { id: 3, label: '-50%', weight: 5 },
];

app.post('/api/spin', (req, res) => {
  const { email } = req.body;
  const existing = db.prepare('SELECT * FROM spins WHERE email = ?').get(email);
  if (existing) {
    return res.status(403).json({ error: 'This email has already played!' });
  }
  const winningPrize = getWeightedPrize(PRIZES);
  const segmentAngle = 360 / PRIZES.length;
  const targetAngle = (winningPrize.id * segmentAngle);

  res.json({
    prize: winningPrize.label,
    targetAngle: targetAngle,
    spinToken: "secret-token-to-prevent-refresh-cheating" 
  });
});