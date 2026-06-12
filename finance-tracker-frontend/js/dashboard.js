/* =========================
   USER INFO
========================= */

const username = document.getElementById("username");

if (username) {
    username.textContent =
        localStorage.getItem("userName") || "User";
}

/* =========================
   STORAGE
========================= */

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

/* =========================
   ELEMENTS
========================= */

const transactionsContainer =
    document.getElementById("transactions");

const balanceEl =
    document.getElementById("balance");

const incomeEl =
    document.getElementById("income");

const expenseEl =
    document.getElementById("expense");

const savingsEl =
    document.getElementById("savings");

const searchInput =
    document.getElementById("searchTransaction");

/* =========================
   ADD TRANSACTION
========================= */

function addTransaction() {

    const title =
        document.getElementById("title")
        .value
        .trim();

    const amount =
        parseFloat(
            document.getElementById("amount")
            .value
        );

    const type =
        document.getElementById("type")
        .value;

    if (!title || isNaN(amount)) {

        alert("Please enter all fields");

        return;
    }

    const transaction = {

        id: Date.now(),

        title,

        amount,

        type,

        date:
            new Date()
            .toLocaleDateString("en-IN")

    };

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    clearInputs();
}

/* =========================
   SAVE
========================= */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

/* =========================
   CLEAR INPUTS
========================= */

function clearInputs() {

    document.getElementById("title").value = "";

    document.getElementById("amount").value = "";

    document.getElementById("type").value = "income";

}

/* =========================
   DELETE
========================= */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            item => item.id !== id
        );

    saveTransactions();

    renderTransactions();

}

/* =========================
   TOTALS
========================= */

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach(item => {

        if (item.type === "income") {

            income += Number(item.amount);

        } else {

            expense += Number(item.amount);

        }

    });

    const balance =
        income - expense;

    if (balanceEl) {

        balanceEl.textContent =
            "₹" +
            balance.toLocaleString("en-IN");

    }

    if (incomeEl) {

        incomeEl.textContent =
            "₹" +
            income.toLocaleString("en-IN");

    }

    if (expenseEl) {

        expenseEl.textContent =
            "₹" +
            expense.toLocaleString("en-IN");

    }

    if (savingsEl) {

        savingsEl.textContent =
            "₹" +
            balance.toLocaleString("en-IN");

    }

    updateChart(
        income,
        expense
    );

}

/* =========================
   RENDER TRANSACTIONS
========================= */

function renderTransactions() {

    if (!transactionsContainer)
        return;

    transactionsContainer.innerHTML = "";

    let searchText = "";

    if (searchInput) {

        searchText =
            searchInput.value
            .toLowerCase();

    }

    const filteredTransactions =
        transactions.filter(item =>
            item.title
            .toLowerCase()
            .includes(searchText)
        );

    filteredTransactions
        .slice()
        .reverse()
        .forEach(item => {

            const div =
                document.createElement("div");

            div.className =
                "transaction-item";

            div.innerHTML = `

                <div class="transaction-info">

                    <h4>${item.title}</h4>

                    <p>${item.date}</p>

                </div>

                <div class="transaction-actions">

                    <span
                    class="${
                        item.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }"
                    >

                    ${
                        item.type === "income"
                        ? "+"
                        : "-"
                    }

                    ₹${item.amount}

                    </span>

                    <button
                    onclick="deleteTransaction(${item.id})"
                    >
                        Delete
                    </button>

                </div>

            `;

            transactionsContainer
                .appendChild(div);

        });

    updateSummary();

}

/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        renderTransactions
    );

}

/* =========================
   CHART
========================= */

const chartCanvas =
    document.getElementById(
        "financeChart"
    );

let financeChart;

function updateChart(
    income,
    expense
) {

    if (!chartCanvas)
        return;

    if (financeChart) {

        financeChart.destroy();

    }

    financeChart =
        new Chart(
            chartCanvas,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "Income",
                        "Expense"

                    ],

                    datasets: [

                        {

                            data: [

                                income,
                                expense

                            ],

                            backgroundColor: [

                                "#10b981",
                                "#ef4444"

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#ffffff"

                            }

                        }

                    }

                }

            }
        );

}
/* =========================
   NAVIGATION
========================= */

function showDashboard() {

    const section =
        document.getElementById(
            "dashboardSection"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}

function showTransactions() {

    const section =
        document.getElementById(
            "transactionsSection"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}

function showGoals() {

    const section =
        document.getElementById(
            "goalsSection"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}

function showReports() {

    const section =
        document.getElementById(
            "reportsSection"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}

/* =========================
   EXPORT CSV REPORT
========================= */

function exportTransactions() {

    if (transactions.length === 0) {

        alert(
            "No transactions available"
        );

        return;

    }

    let csv =
        "Title,Amount,Type,Date\n";

    transactions.forEach(t => {

        csv +=
            `${t.title},${t.amount},${t.type},${t.date}\n`;

    });

    const blob =
        new Blob(
            [csv],
            { type: "text/csv" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "transactions.csv";

    a.click();

}

window.showDashboard =
    showDashboard;

window.showTransactions =
    showTransactions;

window.showGoals =
    showGoals;

window.showReports =
    showReports;

window.exportTransactions =
    exportTransactions;

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "login.html";

}

/* =========================
   AUTH CHECK
========================= */

(function () {

    const loggedIn =
        localStorage.getItem(
            "isLoggedIn"
        );

    if (!loggedIn) {

        window.location.href =
            "login.html";

    }

})();

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.addTransaction =
    addTransaction;

window.deleteTransaction =
    deleteTransaction;

window.logout =
    logout;

/* =========================
   INIT
========================= */

renderTransactions();