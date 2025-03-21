document.addEventListener("DOMContentLoaded", function () {
    const balanceText = document.getElementById("balance"); 
    const addFundsBtn = document.getElementById("addFunds");
    const loanBtn = document.getElementById("loan");
    const repayLoanBtn = document.getElementById("repayLoan");
    const withdrawBtn = document.getElementById("withdraw");
    const logoutBtn = document.getElementById("logout");
    
    const usernameDisplay = document.querySelector(".text-gray-600"); 
    const accountNumberDisplay = document.getElementById("account-number");
     
    const loggedInEmail = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInEmail) {
        alert("No user logged in. Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    usernameDisplay.innerText = `Hi, ${loggedInEmail.fullName}`;
    accountNumberDisplay.innerText = loggedInEmail.accountNumber;
    let balance = loggedInEmail.balance || 0;
    let loanAmount = loggedInEmail.loanAmount || 0;
    
    function updateBalanceDisplay() {
        balanceText.innerText = `$${balance.toFixed(2)}`;
        loggedInEmail.balance = balance;
        loggedInEmail.loanAmount = loanAmount;
        
        let users = JSON.parse(localStorage.getItem("userData")) || [];
        users = users.map(user => user.email === loggedInEmail.email ? loggedInEmail : user);
        localStorage.setItem("userData", JSON.stringify(users));
    }

    function handleTransaction(type) {
        let amount = parseFloat(prompt(`Enter amount to ${type}:`).trim());
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        switch (type) {
            case "add":
                balance += amount;
                alert(`$${amount} added successfully!`);
                break;
            case "loan":
                if (loanAmount > 0) {
                    alert("You must repay your current loan before taking another!");
                    return;
                }
                if (amount > 5000) {
                    alert("Loan limit exceeded! Max: $5000");
                    return;
                }
                balance += amount;
                loanAmount += amount;
                alert(`You have taken a loan of $${amount}.`);
                break;
            case "withdraw":
                if (amount > balance) {
                    alert("Insufficient balance!");
                    return;
                }
                balance -= amount;
                alert(`$${amount} withdrawn successfully!`);
                break;
            case "repayLoan":
                if (loanAmount === 0) {
                    alert("You have no loan to repay!");
                    return;
                }
                if (amount > balance) {
                    alert("Insufficient balance to repay loan!");
                    return;
                }
                if (amount > loanAmount) {
                    alert(`You are trying to repay more than your loan. Your remaining loan is $${loanAmount}`);
                    return;
                }
                balance -= amount;
                loanAmount -= amount;
                alert(`$${amount} loan repaid successfully! Remaining loan: $${loanAmount}`);
                break;
        }
        updateBalanceDisplay();
    }

    addFundsBtn.addEventListener("click", () => handleTransaction("add"));
    loanBtn.addEventListener("click", () => handleTransaction("loan"));
    repayLoanBtn.addEventListener("click", () => handleTransaction("repayLoan"));
    withdrawBtn.addEventListener("click", () => handleTransaction("withdraw"));
    
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser"); 
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

    updateBalanceDisplay();
});