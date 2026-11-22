document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const categoryFilter = document.getElementById('category-filter');
  const expenseList = document.getElementById('expense-list');
  const statusMessage = document.getElementById('status-message');
  const totalAmountEl = document.getElementById('total-amount');
  const totalCountEl = document.getElementById('total-count');

  // Verify required DOM hooks are mounted cleanly
  if (
    !expenseForm ||
    !categoryFilter ||
    !expenseList ||
    !statusMessage ||
    !totalAmountEl ||
    !totalCountEl
  ) {
    console.error('One or more required expense tracker elements are missing.');
  }
});