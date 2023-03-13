const expenses = [
  {
    date: "12-1-1999",
    description: "first item",
    category: "food",
    amount: 200,
  },
  {
    date: "12-1-1999",
    description: "second item",
    category: "others",
    amount: 1000,
  },
  {
    date: "12-1-1999",
    description: "first item",
    category: "fuel",
    amount: 100,
  },
];

expenses.forEach((expense) => {
  document.getElementById("tableBody").innerHTML += `<tr>
    <td scope="row">${expense.date}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>${expense.amount}</td>
  </tr>`;
});
