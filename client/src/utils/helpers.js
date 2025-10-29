export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const getCategoryColor = (category) => {
  const colors = {
    Food: "#FF6B6B",
    Transport: "#4ECDC4",
    Shopping: "#45B7D1",
    Entertainment: "#FFA07A",
    Bills: "#98D8C8",
    Healthcare: "#F7DC6F",
    Education: "#BB8FCE",
    Other: "#95A5A6",
  };
  return colors[category] || "#95A5A6";
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const groupExpensesByDate = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const date = formatDate(expense.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});
};

export const calculateTotal = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};
