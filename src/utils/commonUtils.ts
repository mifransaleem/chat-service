export const getTodayDate = () => {
  const dateObject = new Date();
  return dateObject.toISOString().split('T')[0]; // return in format YYYY-MM-DD
};
