export const formatDate = (date: Date): string => {
  if (!date) return "";
  const today = new Date().toLocaleDateString("en-US");
  const dateString = new Date(date).toLocaleDateString("en-US");
  return dateString === today ? "Today" : dateString;
};
