export const formatDate = (value, options = {}) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  }).format(new Date(value));
};

export const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value || 0));

export const initials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
