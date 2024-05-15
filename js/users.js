import {
  validatePassword,
  validateEmail,
  validateName,
  validateUsername,
  validatePhone,
} from "../validation/userValidation.js";

const usersTable = $.getElementById("users-table");
const filterID = document.querySelector("#id");
const filterUsername = document.querySelector("#username");
const filterPassword = document.querySelector("#password");
const filterPhone = document.querySelector("#phone");
const filterEmail = document.querySelector("#email");
const btnSearch = document.querySelector("#btn-search");
const pageButtonsContainer = document.querySelector("#page-buttons-container");

let allCities = null;
let allUsers = null;

window.editUser = editUser;
window.showUserDetails = showUserDetails;
window.removeUser = removeUser;
window.filterCities = filterCities;

fetch(`${baseUrl}/location/city`)
  .then((res) => res.json())
  .then((data) => (allCities = [...data]));

function getUsers() {
  fetch(`${baseUrl}/users`)
    .then((res) => res.json())
    .then((users) => {
      allUsers = users;
      generateCurrentPageItems(allUsers, 1, generateUsers);
      generateButtons(pageButtonsContainer, allUsers, generateUsers);
    });
}

function generateUsers(users) {
  usersTable.innerHTML = "";

  if (users.length) {
    const usersFragment = $.createDocumentFragment();

    console.log("all users =>", users);
    usersTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="text-sm">
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>`
    );
    users.forEach((user) => {
      const tableRow = $.createElement("tr");

      tableRow.insertAdjacentHTML(
        "beforeend",
        `<td>${user.id}</td>
             <td>${user.firstname} ${user.lastname}</td>
             <td>${user.username}</td>
             <td>${user.password}</td>
             <td>${user.phone}</td>
             <td>${user.email}</td>
             <td class="actions">
              <div>
                <button onclick=showUserDetails(${JSON.stringify(
                  user
                )}) title="Show Details"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="removeUser(${
                  user.id
                })" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                <button onclick=editUser(${JSON.stringify(
                  user
                )}) title="Edit"><i class="fa-solid fa-pencil"></i></button>
              </div>
             </td>`
      );
      usersFragment.appendChild(tableRow);
    });
    usersTable.appendChild(usersFragment);
  } else {
    usersTable.style.border = "none";

    usersTable.innerHTML = "User not found";
  }
}

function showUserDetails(user) {
  detailsAlert.fire({
    text: "test",
    html: `<table>
    <tr>
      <th>City</th>
      <th>Province</th>
      <th>Gender</th>
    </tr>
    <tr>
      <td>${user.city}</td>
      <td>${user.province}</td>
      <td>${user.gender}</td>
  </table>`,
  });
}

function removeUser(userID) {
  mainAlert
    .fire({
      text: "Are you sure you want to delete the user?",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/users/${userID}`, {
          method: "DELETE",
        }).then(() => {
          getUsers();
          detailsAlert.fire({ text: "User deleted." });
        })
    );
}

function filterCities() {
  city.innerHTML = `<option value="">City</option>`;
  city.disabled = false;

  const provinceID = JSON.parse(province.value).id;
  const filteredCities = allCities.filter(
    (city) => city.province_id === provinceID
  );

  filteredCities.map(
    (filteredCity) =>
      (city.innerHTML += `<option value=${filteredCity.name}>${filteredCity.name}</option>`)
  );
}

async function editUser(user) {
  let provinces = null;

  await fetch(`${baseUrl}/location/province`)
    .then((res) => res.json())
    .then((data) => (provinces = [...data]));

  mainAlert
    .fire({
      title: "Edit user",
      icon: false,
      confirmButtonText: "Edit",
      html: `<form class="form-edit form-filter flex flex-wrap gap-3 mt-10">
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formFirstname" value="${
        user.firstname
      }"/>
      <span class="input-error" id="firstnameError"></span>
      <label for="formFirstname" class="form-label">First Name</label>
    </div>
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formLastname" value="${
        user.lastname
      }"/>
      <span class="input-error" id="lastnameError"></span>
      <label for="formLastname" class="form-label">Last Name</label>
    </div>
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formUsername" value="${
        user.username
      }"/>
      <span class="input-error" id="usernameError"></span>
      <label for="formUsername" class="form-label">Username</label>
    </div>
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formPassword" value="${
        user.password
      }"/>
      <span class="input-error" id="passwordError"></span>
      <label for="formPassword" class="form-label">Password</label>
    </div>
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formPhone" value="${
        user.phone
      }"/>
      <span class="input-error" id="phoneError"></span>
      <label for="formPhone" class="form-label">Phone Number</label>
    </div>
    <div class="form-group mb-5">
      <input type="text" class="form-field" id="formEmail" value="${
        user.email
      }"/>
      <span class="input-error" id="emailError"></span>
      <label for="formEmail" class="form-label">Email</label>
    </div>
    <div class="form-group mb-5">
      <select id="formCity" class="form-field" required>
        <option value="">City</option>
        <option value=${user.city} selected>${user.city}</option>
      </select>
      <span class="input-error" id="cityError"></span>
      <label for="formCity" class="form-label invisible">City</label>
    </div>

    <div class="form-group mb-5">
      <select id="formProvince" class="form-field" required onchange=filterCities()>
        <option value="">Province</option>
        ${provinces.map(
          (province) =>
            `<option ${
              province.name === user.province && "selected"
            } value=${JSON.stringify(province)}>${province.name}</option>`
        )}
      </select>
      <span class="input-error" id="provinceError"></span>
      <label for="formProvince" class="form-label invisible">Province</label>
    </div>

    <div class="form-group mb-5">
      <select id="formGender" class="form-field" required>
        <option value="">Gender</option>
        ${["male", "female"].map(
          (gender) =>
            `<option ${
              gender === user.gender && "selected"
            } value=${gender}>${gender}</option>`
        )}
      </select>
      <span class="input-error" id="genderError"></span>

      <label for="formGender" class="form-label invisible">Gender</label>
    </div>
  </form>`,
      didOpen: () => {
        const popup = swal.getPopup();
        checkInputsValidation();
      },
      preConfirm: () => {
        console.log(formUsername);
        firstnameError.innerText = validateName(
          formFirstname.value,
          "firstname",
          2
        );
        lastnameError.innerText = validateName(
          formLastname.value,
          "lastname",
          4
        );
        usernameError.innerText = validateUsername(formUsername.value);
        passwordError.innerText = validatePassword(formPassword.value, 8);
        emailError.innerText = validateEmail(formEmail.value);
        phoneError.innerText = validatePhone(formPhone.value);
        cityError.innerText = !formCity.value ? "select city" : "";
        provinceError.innerText = !formProvince.value ? "select province" : "";
        genderError.innerText = !formGender.value ? "select gender" : "";
        const inputs = [
          lastnameError,
          firstnameError,
          usernameError,
          passwordError,
          emailError,
          phoneError,
          cityError,
          provinceError,
          genderError,
        ];
        const hasInputErrors = inputs.some((input) => input.innerText !== "");

        if (hasInputErrors) {
          Swal.showValidationMessage("Please fill in the answer field");
        }
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        const updatedUser = {
          city: formCity.value,
          gender: formGender.value,
          province: JSON.parse(formProvince.value).name,
          email: formEmail.value,
          firstname: formFirstname.value,
          lastname: formLastname.value,
          password: formPassword.value,
          phone: formPhone.value,
          username: formUsername.value,
        };
        fetch(`${baseUrl}/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((res) => res.json())
          .then(() => {
            getUsers();
            detailsAlert.fire({ text: "The user was edited." });
          });
      }
    });
}

window.addEventListener("load", getUsers);

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  generateUsers(
    filter({
      id: filterID.value.trim(),
      username: filterUsername.value.trim(),
      password: filterPassword.value.trim(),
      phone: filterPhone.value.trim(),
      email: filterEmail.value.trim(),
    })
  );
});

function filter({ id, username, password, phone, email }) {
  const filteredItems = [...allUsers]
    .filter((user) => (id ? user.id == id : user))
    .filter((user) => (username ? user.username == username : user))
    .filter((user) => (password ? user.password == password : user))
    .filter((user) => (phone ? user.phone == phone : user))
    .filter((user) => (email ? user.email == email : user));

  return filteredItems;
}
