const selectCategory = document.querySelector("#category");

function checkInputsValidation() {
  const inputs = document.querySelectorAll(".form-filter input, select");

  inputs.forEach((input) => {
    if (input.value.length > 0) {
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
    }
    input.addEventListener("blur", (e) => {
      if (e.target.value.length > 0) {
        input.classList.add("valid");
      } else {
        input.classList.remove("valid");
      }
    });
  });
}

async function loadCategoryBox(isProduct, contentName) {
  selectCategory.innerHTML = "<option value=''>Uncategorized</option>";
  const allCategories = await fetch(`${baseUrl}/category/${isProduct}`)
    .then((res) => res.json())
    .then((data) => data);

  allCategories.forEach(
    (category) =>
      (selectCategory.innerHTML += `<option ${
        category.name === contentName && "selected"
      } value='${category.name}'>${category.name}</option>`)
  );
}

window.addEventListener("load", checkInputsValidation);
