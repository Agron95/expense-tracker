document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const expenseCategorySelect = document.getElementById('expense-category');
  const categoryFilter = document.getElementById('category-filter');
  const expenseList = document.getElementById('expense-list');
  const statusMessage = document.getElementById('status-message');
  const totalAmountEl = document.getElementById('total-amount');
  const totalCountEl = document.getElementById('total-count');
  const dateInput = document.getElementById('expense-date');

  const CATEGORY_LABELS = {
    food: 'Food & Dining',
    transport: 'Transportation',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    other: 'Other',
  };

  const eurFormatter = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let expenses = [];

  function formatCents(cents) {
    return eurFormatter.format(cents / 100);
  }

  function showStatus(message) {
    statusMessage.textContent = message;
  }

  function updateSummary(items) {
    const totalCents = items.reduce((sum, item) => sum + item.cents, 0);
    totalAmountEl.textContent = formatCents(totalCents);
    totalCountEl.textContent = String(items.length);
  }

  function createLabeledField(labelText, valueText, fieldClass) {
    const field = document.createElement('div');
    field.className = `expense-field ${fieldClass}`;

    const label = document.createElement('span');
    label.className = 'field-label';
    label.textContent = labelText;

    const value = document.createElement('span');
    value.className = 'field-value';
    value.textContent = valueText;

    field.append(label, value);
    return field;
  }

  function renderExpenses() {
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const filtered =
      !selectedCategory || selectedCategory === 'all'
        ? expenses
        : expenses.filter((item) => item.category === selectedCategory);

    updateSummary(filtered);
    expenseList.textContent = '';

    if (filtered.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-state';
      emptyItem.textContent =
        expenses.length === 0
          ? 'No expenses recorded yet.'
          : 'No expenses match the selected category.';
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

    filtered.forEach((expense) => {
      const row = document.createElement('li');
      row.className = 'expense-row';

      const descriptionField = createLabeledField(
        'Description',
        expense.description,
        'expense-description'
      );
      const categoryField = createLabeledField(
        'Category',
        CATEGORY_LABELS[expense.category] || expense.category,
        'expense-category'
      );
      const dateField = createLabeledField(
        'Date',
        expense.date,
        'expense-date'
      );
      const amountField = createLabeledField(
        'Amount',
        formatCents(expense.cents),
        'expense-amount'
      );

      row.append(descriptionField, categoryField, dateField, amountField);
      expenseList.appendChild(row);
    });
  }

  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(expenseForm);
    const description = String(formData.get('description') || '').trim();
    const amountNum = Number.parseFloat(String(formData.get('amount') || ''));
    const category = String(formData.get('category') || '').trim();
    const date = String(formData.get('date') || '').trim();

    if (!description || !Number.isFinite(amountNum) || amountNum <= 0 || !category || !date) {
      showStatus('Please fill out all fields with a valid positive EUR amount.');
      return;
    }

    const cents = Math.round(amountNum * 100);
    expenses.push({
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      description,
      cents,
      category,
      date,
    });

    expenseForm.reset();
    showStatus(`Added "${description}" (${formatCents(cents)}).`);
    renderExpenses();
  });

  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderExpenses);
  }

  renderExpenses();
});
  const CATEGORY_LABELS = {
    food: 'Food & Dining',
    transport: 'Transportation',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    other: 'Other',
  };

  const eurFormatter = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let expenses = [];

  function formatCents(cents) {
    return eurFormatter.format(cents / 100);
  }

  function showStatus(message) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
  }

  // Sync filter options from the form categories while keeping "All" first
  function syncFilterOptions() {
    if (!categoryFilter) return;

    const previousSelection = categoryFilter.value || 'all';
    categoryFilter.textContent = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    categoryFilter.appendChild(allOption);

    if (expenseCategorySelect) {
      Array.from(expenseCategorySelect.options).forEach((option) => {
        if (!option.value) return;
        const cloned = document.createElement('option');
        cloned.value = option.value;
        cloned.textContent = option.textContent;
        categoryFilter.appendChild(cloned);
      });
    }

    const exists = Array.from(categoryFilter.options).some(
      (opt) => opt.value === previousSelection
    );
    categoryFilter.value = exists ? previousSelection : 'all';
  }

  // Always compute overall totals from the full stored array
  function updateOverallSummary() {
    const overallCents = expenses.reduce((sum, item) => sum + item.cents, 0);
    if (totalAmountEl) {
      totalAmountEl.textContent = formatCents(overallCents);
    }
    if (totalCountEl) {
      totalCountEl.textContent = String(expenses.length);
    }
  }

  function getFilteredExpenses() {
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    if (!selectedCategory || selectedCategory === 'all') {
      return [...expenses];
    }
    return expenses.filter((item) => item.category === selectedCategory);
  }

  function createLabeledField(labelText, valueText, fieldClass) {
    const field = document.createElement('div');
    field.className = `expense-field ${fieldClass}`;

    const label = document.createElement('span');
    label.className = 'field-label';
    label.textContent = labelText;

    const value = document.createElement('span');
    value.className = 'field-value';
    value.textContent = valueText;

    field.append(label, value);
    return field;
  }

  function renderExpenses() {
    updateOverallSummary();

    const visibleExpenses = getFilteredExpenses();
    expenseList.textContent = '';

    if (visibleExpenses.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-state';
      emptyItem.textContent =
        expenses.length === 0
          ? 'No expenses recorded yet.'
          : 'No expenses match the selected category.';
      expenseList.appendChild(emptyItem);
      return;
    }

    visibleExpenses.forEach((expense) => {
      const row = document.createElement('li');
      row.className = 'expense-row';

      const descriptionField = createLabeledField(
        'Description',
        expense.description,
        'expense-description'
      );
      const categoryField = createLabeledField(
        'Category',
        CATEGORY_LABELS[expense.category] || expense.category,
        'expense-category'
      );
      const dateField = createLabeledField(
        'Date',
        expense.date,
        'expense-date'
      );
      const amountField = createLabeledField(
        'Amount',
        formatCents(expense.cents),
        'expense-amount'
      );

      row.append(descriptionField, categoryField, dateField, amountField);
      expenseList.appendChild(row);
    });
  }

  if (expenseForm) {
    expenseForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(expenseForm);
      const description = String(formData.get('description') || '').trim();
      const amountNum = Number.parseFloat(String(formData.get('amount') || ''));
      const category = String(formData.get('category') || '').trim();
      const date = String(formData.get('date') || '').trim();

      if (!description || !Number.isFinite(amountNum) || amountNum <= 0 || !category || !date) {
        showStatus('Please fill out all fields with a valid positive EUR amount.');
        return;
      }

      const cents = Math.round(amountNum * 100);
      expenses.push({
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        description,
        cents,
        category,
        date,
      });

      expenseForm.reset();
      showStatus(`Added "${description}" (${formatCents(cents)}).`);
      renderExpenses();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderExpenses);
  }

  syncFilterOptions();
  renderExpenses();
});
