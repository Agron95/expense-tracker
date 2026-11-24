document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'expense_tracker_entries_v1';

  const expenseForm = document.getElementById('expense-form');
  const categoryFilter = document.getElementById('category-filter');
  const expenseList = document.getElementById('expense-list');
  const statusMessage = document.getElementById('status-message');
  const totalAmountEl = document.getElementById('total-amount');
  const totalCountEl = document.getElementById('total-count');

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