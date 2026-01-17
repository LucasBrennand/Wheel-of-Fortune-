export const getWeightedPrize = (prizes) => {
  const totalWeight = prizes.reduce((acc, p) => acc + p.weight, 0);
  let random = Math.random() * totalWeight;

  for (const prize of prizes) {
    if (random < prize.weight) return prize;
    random -= prize.weight;
  }
};
