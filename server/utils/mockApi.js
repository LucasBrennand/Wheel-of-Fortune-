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

export const getMockSpin = () => {
  const totalWeight = PRIZE_CONFIG.reduce((acc, p) => acc + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  let winner = PRIZE_CONFIG[0];
  for (const prize of PRIZE_CONFIG) {
    if (random < prize.weight) {
      winner = prize;
      break;
    }
    random -= prize.weight;
  }

  const segmentAngle = 360 / PRIZE_CONFIG.length;
  const baseAngle = (360 - (winner.id * segmentAngle)) % 360;
  const halfSegment = segmentAngle / 2;
  const jitter = Math.random() * 20 - 10; 

  return {
    prize: winner.label,
    targetAngle: baseAngle - halfSegment + jitter,
    isMock: true
  };
};