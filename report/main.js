const serverLink = "http://localhost:3000";

async function getExpenses() {
  const token = localStorage.getItem("token");
  const { data: expenses } = await axios.get(`${serverLink}/expense`, {
    headers: { Authorization: token },
  });
  expenses.forEach((expense) => {
    document.getElementById("tableBody").innerHTML += `<tr>
      <td scope="row">${expense.updatedAt.slice(0, 10)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td>${expense.amount}</td>
    </tr>`;
  });
}

async function getDailyAndMonthlyExpenses() {
  const token = localStorage.getItem("token");
  const { data: expenses } = await axios.get(`${serverLink}/expense/daily`, {
    headers: { Authorization: token },
  });
  expenses.forEach((expense) => {
    expense.day = expense.updatedAt.slice(0, 10);
    expense.month = expense.updatedAt.slice(0, 7);
  });
  const size = expenses.length;
  if (size == 0) {
    document.getElementById("dailyTableBody").innerHTML = "";
    document.getElementById("monthlyTableBody").innerHTML = "";
    return;
  }
  const dailyExpenses = [{ ...expenses[0] }];
  const monthlyExpenses = [{ ...expenses[0] }];

  let last = 0;
  for (let i = 1; i < size; i++) {
    if (dailyExpenses[last].day == expenses[i].day) {
      dailyExpenses[last].amount += expenses[i].amount;
    } else {
      dailyExpenses.push({ day: expenses[i].day, amount: expenses[i].amount });
      last++;
    }
  }

  last = 0;
  for (let i = 1; i < size; i++) {
    if (monthlyExpenses[last].month == expenses[i].month) {
      monthlyExpenses[last].amount += expenses[i].amount;
    } else {
      monthlyExpenses.push({
        month: expenses[i].month,
        amount: expenses[i].amount,
      });
      last++;
    }
  }

  dailyExpenses.forEach((expense) => {
    document.getElementById("dailyTableBody").innerHTML += `<tr>
      <td scope="row">${expense.day}</td>
      <td>${expense.amount}</td>
    </tr>`;
  });

  monthlyExpenses.forEach((expense) => {
    document.getElementById("monthlyTableBody").innerHTML += `<tr>
      <td scope="row">${expense.month}</td>
      <td>${expense.amount}</td>
    </tr>`;
  });
}

document
  .getElementById("download")
  .addEventListener("click", async function (e) {
    const { data } = await axios.get(`${serverLink}/expense/download`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    const a = document.createElement("a");
    a.download = "myexpense.csv";
    a.href = data.fileUrl;
    a.click();
  });

async function getDownloadHistory() {
  const { data: downloadHistory } = await axios.get(
    `${serverLink}/expense/download-history`,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );
  downloadHistory.forEach((item) => {
    document.getElementById(
      "downloadHistory"
    ).innerHTML += `<li class="list-group-item"><a href=${
      item.fileUrl
    } class="btn btn-secondary">${item.fileUrl.slice(-85, -49)}</a></li>`;
  });
}

getExpenses();
getDailyAndMonthlyExpenses();
getDownloadHistory();
