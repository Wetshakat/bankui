document.addEventListener("DOMContentLoaded", function () {
  const balanceText = document.getElementById("balance");
  const addFundsBtn = document.getElementById("addFunds");
  const loanBtn = document.getElementById("loan");
  const repayLoanBtn = document.getElementById("repayLoan");
  const withdrawBtn = document.getElementById("withdraw");
  const transferBtn = document.getElementById("transfer");
  const logoutBtn = document.getElementById("logout");

  const usernameDisplay = document.querySelector(".text-gray-600");
  const accountNumberDisplay = document.getElementById("account-number");
  const loanText = document.getElementById("loan-amount"); 
 
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("No user logged in. Redirecting to login...");
    window.location.href = "login.html";
    return;
  }

  usernameDisplay.innerText = `Hi, ${loggedInUser.fullName}`;
  accountNumberDisplay.innerText = `Acc No: ${loggedInUser.accountNumber}`;

  let userData =
    users.find((user) => user.accountNumber === loggedInUser.accountNumber) ||
    loggedInUser;
  let balance = userData.balance !== undefined ? userData.balance : 0;
  let loanAmount = userData.loanAmount || 0;

  function updateBalanceDisplay() {
    balanceText.innerText = `$${balance.toFixed(2)}`;
    loanText.innerText = `Loan: $${loanAmount.toFixed(2)}`; 
    loggedInUser.balance = balance;
    loggedInUser.loanAmount = loanAmount;

   
    users = users.map((user) =>
      user.accountNumber === loggedInUser.accountNumber
        ? { ...user, balance, loanAmount }
        : user
    );
    localStorage.setItem("userData", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  }

  function handleTransaction(type) {
    let amount = parseFloat(prompt(`Enter amount to ${type}:`));
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
          alert(
            `You are trying to repay more than your loan. Your remaining loan is $${loanAmount}`
          );
          return;
        }
        balance -= amount;
        loanAmount -= amount;
        alert(
          `$${amount} loan repaid successfully! Remaining loan: $${loanAmount}`
        );
        break;
    }
    updateBalanceDisplay();
  }

  function transferMoney() {
    let recipientAccNumber = prompt("Enter recipient's account number:");
    let amount = parseFloat(prompt("Enter amount to transfer:"));

    if (!recipientAccNumber || isNaN(amount) || amount <= 0) {
      alert("Invalid input. Please enter valid details.");
      return;
    }

    if (amount > balance) {
      alert("Insufficient balance for this transfer.");
      return;
    }

    let recipient = users.find(
      (user) => user.accountNumber === recipientAccNumber
    );

    if (!recipient) {
      alert(
        "Recipient not found. Transfers can only be made to registered users."
      );
      return;
    }

    balance -= amount;
    recipient.balance = (recipient.balance || 0) + amount;

    users = users.map((user) => {
      if (user.accountNumber === loggedInUser.accountNumber) {
        return { ...loggedInUser, balance };
      } else if (user.accountNumber === recipient.accountNumber) {
        return { ...recipient };
      }
      return user;
    });

    localStorage.setItem("userData", JSON.stringify(users));
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ ...loggedInUser, balance })
    );

    updateBalanceDisplay();
    alert(
      `$${amount} transferred to account ${recipientAccNumber} successfully!`
    );
  }

  addFundsBtn.addEventListener("click", () => handleTransaction("add"));
  loanBtn.addEventListener("click", () => handleTransaction("loan"));
  repayLoanBtn.addEventListener("click", () => handleTransaction("repayLoan"));
  withdrawBtn.addEventListener("click", () => handleTransaction("withdraw"));
  transferBtn.addEventListener("click", transferMoney);

  logoutBtn.addEventListener("click", () => {
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });

  updateBalanceDisplay();
});
