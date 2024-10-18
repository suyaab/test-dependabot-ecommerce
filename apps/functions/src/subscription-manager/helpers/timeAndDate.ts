export const getNextOrderDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 28);
  return currentDate.toISOString();
};
