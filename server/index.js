import express from "express";
import cors from "cors";
import db from "./data/db.js";
import { getWeightedPrize } from "./utils/probability.js";

const app = express();
app.use(cors());
app.use(express.json());

const PRIZE_CONFIG = [
  { id: 0, label: "-5%", weight: 15 },
  { id: 1, label: "-10%", weight: 10 },
  { id: 2, label: "-20%", weight: 5 },
  { id: 3, label: "-50%", weight: 2 },
  { id: 4, label: "-5%", weight: 15 },
  { id: 5, label: "-10%", weight: 10 },
  { id: 6, label: "-20%", weight: 5 },
  { id: 7, label: "-50%", weight: 2 },
];

app.post("/api/spin", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = db
      .prepare("SELECT * FROM spins WHERE email = ?")
      .get(email);
    if (existing) {
      return res.status(403).json({ error: "This email has already played!" });
    }
    const winner = getWeightedPrize(PRIZE_CONFIG);
    const segmentAngle = 360 / PRIZE_CONFIG.length;
    const baseAngle = (360 - winner.id * segmentAngle) % 360;
    const halfSegment = segmentAngle / 2;
    const jitter = Math.random() * 20 - 10;
    const targetAngle = baseAngle - halfSegment + jitter;
    const insert = db.prepare(
      "INSERT INTO spins (email, prize_label, prize_id) VALUES (?, ?, ?)",
    );
    insert.run(email, winner.label, winner.id);

    console.log(
      `Spin Success: ${email} won ${winner.label} (${targetAngle}deg)`,
    );

    res.json({
      prize: winner.label,
      targetAngle: targetAngle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/claim", async (req, res) => {
  const { email, name, prizeLabel } = req.body;

  try {
    const update = db.prepare(
      "UPDATE spins SET name = ? WHERE email = ? AND name IS NULL",
    );
    const result = update.run(name, email);

    if (result.changes === 0) {
      return res
        .status(400)
        .json({ error: "Invalid claim or already claimed" });
    }

    console.log(`Sending ${prizeLabel} coupon to ${email}...`);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Claim failed" });
  }
});

app.listen(3000, () => console.log(`Server ready at http://localhost:3000`));
