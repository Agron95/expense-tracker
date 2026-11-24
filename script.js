
document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const categoryFilter = document.getElementById('category-filter');
  const expenseList = document.getElementById('expense-list');
  const statusMessage = document.getElementById('status-message');
  const totalAmountEl = document.getElementById('total-amount');
  const totalCountEl = document.getElementById('total-count');

  const categoryTotals = {
    food: document.getElementById('food-total'),
    transport: document.getElementById('transport-total'),
    utilities: document.getElementById('utilities-total'),
    entertainment: document.getElementById('entertainment-total'),
    other: document.getElementById('other-total')
  };

  const categoryOverallTotal = document.getElementById('category-overall-total');

  if (
    !expenseForm ||
    !categoryFilter ||
    !expenseList ||
    !statusMessage ||
    !totalAmountEl ||
    !totalCountEl ||
    !categoryOverallTotal ||
    Object.values(categoryTotals).some(element => !element)
  ) {
    console.error('One or more required expense tracker elements are missing.');
    return;
  }

  let expenses = [];

  const formatAmount = amount => {
    return `$${amount.toFixed(2)}`;
  };

  const categoryNames = {
    food: 'Food & Dining',
    transport: 'Transportation',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    other: 'Other'
  };

  function showStatus(message) {
    statusMessage.textContent = message;
  }

  function updateSummary() {
    const overallTotal = expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);

    totalAmountEl.textContent = formatAmount(overallTotal);
    totalCountEl.textContent = expenses.length;
  }

  function updateCategoryTotals() {
    const totals = {
      food: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      other: 0
    };

    expenses.forEach(expense => {
      if (totals[expense.category] !== undefined) {
        totals[expense.category] += expense.amount;
      }
    });

    Object.keys(totals).forEach(category => {
      categoryTotals[category].textContent = formatAmount(totals[category]);
    });

    const overallTotal = Object.values(totals).reduce((total, amount) => {
      return total + amount;
    }, 0);

    categoryOverallTotal.textContent = formatAmount(overallTotal);
  }

  function renderExpenses() {
    const selectedCategory = categoryFilter.value;

    const filteredExpenses = selectedCategory === 'all'
      ? expenses
      : expenses.filter(expense => expense.category === selectedCategory);

    expenseList.innerHTML = '';

    if (filteredExpenses.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'empty-state';
      emptyMessage.textContent = 'No expenses recorded yet.';
      expenseList.appendChild(emptyMessage);
      return;
    }

    filteredExpenses.forEach(expense => {
      const listItem = document.createElement('li');
      listItem.className = 'expense-item';

      const details = document.createElement('div');
      details.className = 'expense-details';

      const description = document.createElement('strong');
      description.textContent = expense.description;

      const category = document.createElement('span');
      category.textContent = categoryNames[expense.category];

      const date = document.createElement('span');
      date.textContent = expense.date;

      details.append(description, category, date);

      const amount = document.createElement('strong');
      amount.textContent = formatAmount(expense.amount);

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn-delete';
      deleteButton.textContent = 'Delete';
      deleteButton.dataset.id = expense.id;
      deleteButton.setAttribute('aria-label', `Delete ${expense.description}`);

      listItem.append(details, amount, deleteButton);
      expenseList.appendChild(listItem);
    });
  }

  function updateUI() {
    updateSummary();
    updateCategoryTotals();
    renderExpenses();
  }

  expenseForm.addEventListener('submit', event => {
    event.preventDefault();

    const description = document.getElementById('expense-description').value.trim();
    const amount = Number(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    if (!description || !Number.isFinite(amount) || amount <= 0 || !category || !date) {
      showStatus('Please enter valid expense details.');
      return;
    }

    const newExpense = {
      id: crypto.randomUUID(),
      description,
      amount,
      category,
      date
    };

    expenses.push(newExpense);

    expenseForm.reset();

    updateUI();
    showStatus('Expense added successfully.');
  });

  expenseList.addEventListener('click', event => {
    const deleteButton = event.target.closest('.btn-delete');

    if (!deleteButton) {
      return;
    }

    const expenseId = deleteButton.dataset.id;

    expenses = expenses.filter(expense => expense.id !== expenseId);

    updateUI();
    showStatus('Expense deleted successfully.');
  });

  categoryFilter.addEventListener('change', () => {
    renderExpenses();
  });

  updateUI();
});
