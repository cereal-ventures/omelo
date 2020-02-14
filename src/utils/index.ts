export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const dateString = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return dateString === today ? 'Today' : dateString;
};
