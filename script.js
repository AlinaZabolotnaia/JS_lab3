/**
 * Array to hold transaction objects.
 * @type {Array<{id: number, date: string, amount: number, category: string, description: string}>}
 */
const transactions = [];

/**
 * Function to generate a unique ID for each transaction.
 * @returns {number} Unique ID
 */
function generateId() {
    return transactions.length ? transactions[transactions.length - 1].id + 1 : 1;
}

/**
 * Adds a transaction to the transactions array and updates the table.
 * @param {Event} e Event object
 */
function addTransaction(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    const transaction = {
        id: generateId(),
        date: new Date().toLocaleString(),
        amount,
        category,
        description
    };
    
    transactions.push(transaction);
    appendTransactionToTable(transaction);
    calculateTotal();
    
    document.getElementById('transaction-form').reset();
}

/**
 * Appends a transaction to the table.
 * @param {Object} transaction Transaction object
 */
function appendTransactionToTable(transaction) {
    const table = document.getElementById('transaction-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.setAttribute('data-id', transaction.id);
    row.className = transaction.amount >= 0 ? 'income' : 'expense';
    
    row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.date}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.category}</td>
        <td>${transaction.description.split(' ').slice(0, 4).join(' ')}...</td>
        <td><button class="delete-btn">Delete</button></td>
    `;
}

/**
 * Calculates and updates the total amount of all transactions.
 */
function calculateTotal() {
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

/**
 * Deletes a transaction by ID.
 * @param {number} id Transaction ID
 */
function deleteTransaction(id) {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
        transactions.splice(index, 1);
        document.querySelector(`tr[data-id="${id}"]`).remove();
        calculateTotal();
    }
}

/**
 * Displays full details of a transaction.
 * @param {number} id Transaction ID
 */
function showTransactionDetails(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (transaction) {
        const detailsDiv = document.getElementById('transaction-details');
        detailsDiv.innerHTML = `
            <h3>Transaction ID: ${transaction.id}</h3>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Amount:</strong> ${transaction.amount}</p>
            <p><strong>Category:</strong> ${transaction.category}</p>
            <p><strong>Description:</strong> ${transaction.description}</p>
        `;
        detailsDiv.style.display = 'block';
    }
}

// Event Listeners
document.getElementById('transaction-form').addEventListener('submit', addTransaction);

document.getElementById('transaction-table').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.closest('tr').getAttribute('data-id'));
        deleteTransaction(id);
    } else if (e.target.closest('tr')) {
        const id = parseInt(e.target.closest('tr').getAttribute('data-id'));
        showTransactionDetails(id);
    }
});
