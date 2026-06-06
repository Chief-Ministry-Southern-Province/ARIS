export const formatLKR = (amount: number): string => {
  if (amount >= 1000000) {
    return `LKR ${(amount / 1000000).toFixed(1)}M`;
  }

  if (amount >= 1000) {
    return `LKR ${(amount / 1000).toFixed(0)}K`;
  }

  return `LKR ${amount}`;
};