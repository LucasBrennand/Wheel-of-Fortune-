export const generateCoupon = async (discountPercent) => {
  if (process.env.NODE_ENV === 'production') {

  }
  
  return `SHOW-${discountPercent}-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
};