const serverLink = "http://localhost:3000/password";

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(document.getElementById("email").value);
    await axios.post(`${serverLink}/forgotpassword`, {
      email: document.getElementById("email").value,
    });
    document.getElementById("email").value = "";
  });
