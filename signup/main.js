const serverLink = "http://localhost:3000";

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("signUpForm");
const error = document.getElementById("error");

form.addEventListener("submit", submitFn);

function submitFn(e) {
  e.preventDefault();
  if (noEmptyFields()) {
    const user = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    const postFn = async () => {
      const result = await axios.post(`${serverLink}/user/signup`, user);
      console.log(result);
      if (result.data == "Added New User") {
        clearFields();
        error.innerHTML = "<br>User added successfully";
      } else if (result.data == "not_unique") {
        error.innerHTML = "<br>User already exists.";
      } else {
        error.innerHTML = `<br>Failed add because it is ${result.data}`;
      }
    };
    postFn();
  }
}

function noEmptyFields() {
  error.innerHTML = "<br>";
  if (name.value == "") error.innerHTML += "Name cannot be empty.";
  if (email.value == "") error.innerHTML += " Email cannot be empty.";
  if (password.value == "") error.innerHTML += " Password cannot be empty.";
  if (name.value == "" || email.value == "" || password.value == "")
    return false;
  error.innerHTML = "";
  return true;
}

function clearFields() {
  name.value = "";
  email.value = "";
  password.value = "";
}
