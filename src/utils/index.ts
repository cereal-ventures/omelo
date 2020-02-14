
export const formatDate = (date: Date | string): string => {
  if (!date) return "";
  const today = new Date().toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
  const dateString = new Date(date).toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
  return dateString === today ? "Today" : dateString;
};
