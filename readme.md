# Expense Tracker

## Project idea

Build a personal spending tracker where visitors enter expenses, view totals, filter by category, and remove entries. Data is stored in the browser. Use a single currency (EUR), with no login, bank connection, or backend.

## Technology and scope

Use plain HTML, CSS, and JavaScript. No frameworks, packages, build tools, backend, or external services are required. This initial repository contains the assignment only; students build the application through the tasks below.

The finished application should run by opening `index.html` in a modern browser. Use the same browser and file location when checking saved data; browser storage behavior for local files can vary. If needed, use your editor's local preview server consistently.

## Team assignments

- **student1**: tasks 01, 04, 07, 10.
- **student2**: tasks 02, 05, 08.
- **student3**: tasks 03, 06, 09.

There are exactly 10 tasks and each task has one owner. One student has four tasks and the other two have three each. Teammates review each other's pull requests.

## GitHub setup and pull request workflow

The teacher should create an empty GitHub repository for this project, push this local repository's `main` branch, and give all three students access. Replace the placeholders below with that repository's URL:

```sh
git remote add origin <github-repository-url>
git push -u origin main
```

Students then clone the GitHub repository. Complete the numbered tasks in order, merging each task before starting the next; later tasks build on earlier work. For every task, its owner must:

1. Update their local `main` branch and create a new task branch.
2. Implement only that task and manually check its completion criteria.
3. Commit and push the branch, then open one GitHub pull request targeting `main`.
4. Put the task number, changes, and manual-check results in the PR description; add a screenshot for visible UI changes.
5. Ask another team member to review, address feedback, and merge after approval. Mark the task checkbox complete in the same PR.

Example for task 01 (replace the student and task number for your own assignment):

```sh
git switch main
git pull --ff-only origin main
git switch -c student1/task-01
# Make and check your changes, then stage the files you changed.
git add .
git commit -m "Complete task 01: create page structure"
git push -u origin student1/task-01
```

Use GitHub's **Compare & pull request** button after pushing. Suggested PR title: `[Task 01] Create page structure (student1)`. Do not push task work directly to `main`. The finished project should have **10 task PRs**, one per task. PRs are submitted when students implement their tasks.

## Tasks

### 01. Create the page structure

- [ ] Complete and merge this task.
- **Owner:** student1
- **Branch:** `student1/task-01`
- **Work:** Create index.html with a heading, a labeled expense form (description, amount, category, date), summary area, category filter, expense-list container, and status-message area. Link styles.css and a deferred script.js; create both files.
- **Done when:** The page opens without missing-file errors and every form control has a visible label.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 02. Style the tracker

- [ ] Complete and merge this task.
- **Owner:** student2
- **Branch:** `student2/task-02`
- **Work:** Style the form, totals, expense rows, buttons, empty state, and focus indicators. Use a responsive layout that stacks on small screens.
- **Done when:** The tracker fits a 360px screen without horizontal overflow and amounts remain readable.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 03. Validate and add expenses

- [ ] Complete and merge this task.
- **Owner:** student3
- **Branch:** `student3/task-03`
- **Work:** In script.js, store entries with unique id, description, amountCents, category, and date. Trim descriptions; require a valid date, known category, and a positive finite amount with at most two decimals. Convert EUR amounts to integer cents.
- **Done when:** Valid submissions create one entry and reset the form; blank text, zero, negative values, and three-decimal amounts are rejected with useful messages.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 04. Render expense entries

- [ ] Complete and merge this task.
- **Owner:** student1
- **Branch:** `student1/task-04`
- **Work:** Render the array as labeled expense rows showing description, category, date, and EUR amount. Format cents consistently with Intl.NumberFormat and insert user text with textContent.
- **Done when:** Adding several entries displays the correct values, including a 1.50 EUR entry, without interpreting descriptions as HTML.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 05. Delete expenses

- [ ] Complete and merge this task.
- **Owner:** student2
- **Branch:** `student2/task-05`
- **Work:** Add an accessible delete button to each row and remove entries by id. Rerender after deletion and show a friendly empty state when the array is empty.
- **Done when:** Deleting one of two identical-looking entries removes only the selected id.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 06. Calculate the overall total

- [ ] Complete and merge this task.
- **Owner:** student3
- **Branch:** `student3/task-06`
- **Work:** Sum integer amountCents values and display the total in EUR. Update it after additions and deletions, independently of the selected category filter.
- **Done when:** Entries of 0.10 EUR and 0.20 EUR total 0.30 EUR; deleting either updates the total correctly.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 07. Filter by category

- [ ] Complete and merge this task.
- **Owner:** student1
- **Branch:** `student1/task-07`
- **Work:** Add All plus the form's categories to the filter. Render only matching entries without altering the stored array and show an empty message when no entries match.
- **Done when:** Changing categories shows the correct entries; All restores the complete list and the overall total remains unchanged.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 08. Show category totals

- [ ] Complete and merge this task.
- **Owner:** student2
- **Branch:** `student2/task-08`
- **Work:** Display a spending subtotal for each category, calculated from the full array. Recalculate after every addition or deletion and label these as totals across all entries.
- **Done when:** Category subtotals add up to the overall total and stay accurate while the list is filtered.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 09. Persist expenses locally

- [ ] Complete and merge this task.
- **Owner:** student3
- **Branch:** `student3/task-09`
- **Work:** Save expenses using a project-specific localStorage key and restore them on load. Validate stored records, ignore invalid entries, and handle malformed JSON or unavailable storage without crashing.
- **Done when:** Valid entries survive refresh when storage is available; corrupted saved content leaves the tracker usable.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.

### 10. Verify calculations and document checks

- [ ] Complete and merge this task.
- **Owner:** student1
- **Branch:** `student1/task-10`
- **Work:** Check validation, cent arithmetic, deletion, category filtering, totals, persistence, keyboard use, and the 360px layout. Fix issues and add a Manual testing section to this README.
- **Done when:** Record actual results and browser used; all checks pass, including 0.10 + 0.20 EUR and deleting duplicate-looking entries.
- **Deliverable:** One GitHub PR for this task, reviewed by another team member.
