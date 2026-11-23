document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const categoryFilter = document.getElementById('category-filter');
  const expenseList = document.getElementById('expense-list');
  const statusMessage = document.getElementById('status-message');
  const totalAmountEl = document.getElementById('total-amount');
  const totalCountEl = document.getElementById('total-count');
  const dateInput = document.getElementById('expense-date');

  if (
    !expenseForm ||
    !categoryFilter ||
    !expenseList ||
    !statusMessage ||
    !totalAmountEl ||
    !totalCountEl ||
    !dateInput
  ) {
    console.error('One or more required expense tracker elements are missing.');
    return;
  }

  const STORAGE_KEY = 'expense-tracker-expenses';
  const categoryNames = {
    food: 'Food & Dining',
    transport: 'Transportation',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    other: 'Other'
  };
  const categoryIcons = {
    food: '🍽',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    other: '📦'
  };

  let expenses = loadExpenses();

  dateInput.value = getLocalDate();
  renderExpenses();
  updateSummary();

  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(expenseForm);
    const description = String(formData.get('description')).trim();
    const amount = Number(formData.get('amount'));
    const category = String(formData.get('category'));
    const date = String(formData.get('date'));

    if (!description || !Number.isFinite(amount) || amount <= 0 || !categoryNames[category] || !date) {
      showStatus('Please enter valid expense details.', true);
      return;
    }

    const expense = {
      id: createId(),
      description,
      amount: Math.round(amount * 100) / 100,
      category,
      date
    };

    expenses.unshift(expense);
    saveExpenses();
    renderExpenses();
    updateSummary();
    expenseForm.reset();
    dateInput.value = getLocalDate();
    showStatus('Expense added successfully.');
  });

  categoryFilter.addEventListener('change', renderExpenses);

  expenseList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete-id]');

    if (!deleteButton) {
      return;
    }

    const expenseId = deleteButton.dataset.deleteId;
    expenses = expenses.filter((expense) => String(expense.id) !== expenseId);

    saveExpenses();
    renderExpenses();
    updateSummary();
    showStatus('Expense deleted.');
  });

  function loadExpenses() {
    try {
      const savedExpenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      if (!Array.isArray(savedExpenses)) {
        return [];
      }

      return savedExpenses.filter((expense) =>
        expense &&
        expense.id !== undefined &&
        typeof expense.description === 'string' &&
        Number.isFinite(Number(expense.amount)) &&
        categoryNames[expense.category] &&
        typeof expense.date === 'string'
      );
    } catch (error) {
      console.error('Could not load saved expenses:', error);
      return [];
    }
  }

  function saveExpenses() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Could not save expenses:', error);
      showStatus('Your changes could not be saved in this browser.', true);
    }
  }

  function renderExpenses() {
    const selectedCategory = categoryFilter.value;
    const filteredExpenses = selectedCategory === 'all'
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

    expenseList.replaceChildren();

    if (filteredExpenses.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-state';

      const icon = document.createElement('span');
      icon.className = 'empty-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '+';

      const title = document.createElement('strong');
      title.textContent = expenses.length === 0 ? 'No expenses yet' : 'No expenses in this category';

      const message = document.createElement('span');
      message.textContent = expenses.length === 0
        ? 'Add your first expense using the form above.'
        : 'Try selecting another category.';

      emptyItem.append(icon, title, message);
      expenseList.appendChild(emptyItem);
      return;
    }

    filteredExpenses
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((expense) => {
        const item = document.createElement('li');
        item.className = 'expense-item';

        const icon = document.createElement('span');
        icon.className = 'category-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = categoryIcons[expense.category];

        const details = document.createElement('div');
        details.className = 'expense-details';

        const description = document.createElement('p');
        description.className = 'expense-description';
        description.textContent = expense.description;

        const meta = document.createElement('div');
        meta.className = 'expense-meta';

        const category = document.createElement('span');
        category.className = 'expense-category';
        category.textContent = categoryNames[expense.category];

        const date = document.createElement('span');
        date.textContent = formatDate(expense.date);

        meta.append(category, date);
        details.append(description, meta);

        const actions = document.createElement('div');
        actions.className = 'expense-actions';

        const amount = document.createElement('strong');
        amount.className = 'expense-amount';
        amount.textContent = formatCurrency(Number(expense.amount));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn-delete';
        deleteButton.dataset.deleteId = String(expense.id);
        deleteButton.setAttribute('aria-label', `Delete ${expense.description}`);
        deleteButton.title = 'Delete expense';
        deleteButton.textContent = '×';

        actions.append(amount, deleteButton);
        item.append(icon, details, actions);
        expenseList.appendChild(item);
      });
  }

  function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    totalAmountEl.textContent = formatCurrency(total);
    totalCountEl.textContent = String(expenses.length);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  }

  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle('error', isError);
  }
});
