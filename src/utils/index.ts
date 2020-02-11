export const formatDate = (date: Date): string => {
  if (!date) return "";
  const today = new Date().toLocaleDateString("en-US");
  const dateString = date.toLocaleDateString("en-US");
  return dateString === today ? "Today" : dateString;
};
