const serverLink = "http://localhost:3000/expense";

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

const getFn = async () => {
  const response = await axios.get(serverLink);
  const expenses = response.data;
  for (let i = 0; i < expenses.length; i++) {
    expenseList.appendChild(createLi(expenses[i]));
  }
};

getFn();

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
    const id = e.target.parentElement.id;
    await axios.delete(`${serverLink}/${id}`);
    e.target.parentElement.remove();
  });
  return deleteButton;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const expense = {
    amount: amount.value,
    description: description.value,
    category: category.textContent,
  };
  const postFn = async () => {
    const response = await axios.post(serverLink, expense);
    console.log(response);
    const expenseWithId = response.data;
    expenseList.appendChild(createLi(expenseWithId));
    clearInputFields();
  };
  if (noEmptyFields(expense)) postFn();
});

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
