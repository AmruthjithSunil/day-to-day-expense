const serverLink = "http://localhost:3000";

const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form.addEventListener("submit", submitFn);

function submitFn(e) {
  e.preventDefault();
  if (noEmptyFields()) {
    const user = {
      email: email.value,
      password: password.value,
    };
    const postFn = async () => {
      const result = await axios.post(`${serverLink}/user/login`, user);
      console.log(result);
      if (result.data == "not_unique") {
        error.innerHTML = "<br>User already exists.";
      } else {
        clearFields();
      }
    };
    postFn();
  }
}

function noEmptyFields() {
  error.innerHTML = "<br>";
  if (email.value == "") error.innerHTML += " Email cannot be empty.";
  if (password.value == "") error.innerHTML += " Password cannot be empty.";
  if (name.value == "" || email.value == "" || password.value == "")
    return false;
  error.innerHTML = "";
  return true;
}

function clearFields() {
  email.value = "";
  password.value = "";
  error.innerHTML = "";
}
