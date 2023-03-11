const serverLink = "http://localhost:3000";

const amount = document.getElementById("amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const form = document.getElementById("expenseAdd");
const options = document.getElementsByClassName("option");
const expenseList = document.getElementById("expense-list");
const error = document.getElementById("status");

for (let i = 0; i < 3; i++) {
  options[i].addEventListener("click", () => {
    category.textContent = options[i].textContent;
  });
}

async function getExpenses() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${serverLink}/expense`, {
    headers: { Authorization: token },
  });
  const expenses = response.data;
  for (let i = 0; i < expenses.length; i++) {
    expenseList.appendChild(createLi(expenses[i]));
  }
}

async function getUser() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${serverLink}/expense/user`, {
    headers: { Authorization: token },
  });
  document.getElementById("userEmail").innerHTML = response.data.userEmail;
  const res = await axios.post(`${serverLink}/user/ispremium`, {
    userEmail: response.data.userEmail,
  });
  if (res.data.isPremium) {
    document.getElementById("premium").innerHTML = `You are a premium user`;
    document.getElementById(
      "premium"
    ).innerHTML += `<a id="showLeaderboard" type="button" class="btn btn-light">Show Leaderboard</a>`;
    document.getElementById("showLeaderboard").onclick = async function (e) {
      const response = await axios.get(`${serverLink}/premium/leaderboard`, {
        headers: { Authorization: token },
      });
      const users = response.data;
      const size = users.length;
      document.getElementById("leaderboard").innerHTML = "";
      for (let i = 0; i < size; i++) {
        const li = document.createElement("li");
        li.textContent = `name: ${users[i].name} totalExpense: ${users[i].totalExpense}`;
        document.getElementById("leaderboard").appendChild(li);
      }
    };
  } else {
    document.getElementById(
      "premium"
    ).innerHTML = `<a id="buyPremium" type="button" class="btn btn-light">Buy Premium</a>`;
    document.getElementById("buyPremium").onclick = async function (e) {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverLink}/purchase/premiummembership`,
        {
          headers: { Authorization: token },
        }
      );
      const options = {
        key: response.data.key_id,
        order_id: response.data.order_id,
        handler: async function (response) {
          await axios.post(
            `${serverLink}/purchase/updatetransactionstatus`,
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );
          alert("You are a Premium User Now");
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on("payment.failed", async function (response) {
        console.log(response);
        alert("Something went wrong");
        console.log(options);
        axios.post(
          `${serverLink}/purchase/transactionfailed`,
          {
            order_id: options.order_id,
          },
          { headers: { Authorization: token } }
        );
      });
    };
  }
}

getUser();
getExpenses();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const expense = {
    amount: amount.value,
    description: description.value,
    category: category.textContent,
  };
  const postFn = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${serverLink}/expense`, expense, {
      headers: { Authorization: token },
    });
    console.log(response);
    const expenseWithId = response.data;
    expenseList.appendChild(createLi(expenseWithId));
    clearInputFields();
    document.getElementById("leaderboard").innerHTML = "";
  };
  if (noEmptyFields(expense)) postFn();
});

function createLi({ id, amount, description, category }) {
  const li = document.createElement("li");
  li.textContent = `${amount}-${category}-${description}`;
  li.id = id;
  li.appendChild(createDeleteButton());
  return li;
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";
  deleteButton.className = "btn btn-danger mt-1";
  deleteButton.addEventListener("click", async (e) => {
    const token = localStorage.getItem("token");
    const id = e.target.parentElement.id;
    await axios.delete(`${serverLink}/expense/${id}`, {
      headers: { Authorization: token },
    });
    if (document.getElementById("leaderboard").innerHTML != "") {
      const response = await axios.get(`${serverLink}/premium/leaderboard`, {
        headers: { Authorization: token },
      });
      const users = response.data;
      const size = users.length;
      document.getElementById("leaderboard").innerHTML = "";
      for (let i = 0; i < size; i++) {
        const li = document.createElement("li");
        li.textContent = `name: ${users[i].name} totalExpense: ${users[i].totalExpense}`;
        document.getElementById("leaderboard").appendChild(li);
      }
    }
    e.target.parentElement.remove();
  });
  return deleteButton;
}

function noEmptyFields({ amount, description, category }) {
  error.innerHtml = "<br>";
  if (amount == "") error.innerHTML += "Amount cannot be empty. ";
  if (description == "") error.innerHTML += "Description cannot be empty. ";
  if (category == "Category") error.innerHTML += "Choose a category.";
  if (amount == "" || description == "" || category == "Category") return false;
  return true;
}

function clearInputFields() {
  amount.value = "";
  description.value = "";
  category.textContent = "Category";
}
