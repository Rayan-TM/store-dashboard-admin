const offsTable = $.getElementById("offs-table");
const filterID = document.querySelector("#id");
const filterDiscountCode = document.querySelector("#discount-code");
const filterDiscountPercent = document.querySelector("#discount-percent");
const filterRegisterDate = document.querySelector("#register-date");
const filterExpireDate = document.querySelector("#expire-date");
const filterProduct = document.querySelector("#product");
const btnSearch = document.querySelector("#btn-search");
const pageButtonsContainer = document.querySelector("#page-buttons-container");

let allOffs = null;

function getOffs() {
  fetch(`${baseUrl}/offs`)
    .then((res) => res.json())
    .then((offs) => {
      allOffs = offs;
      generateCurrentPageItems(allOffs, 1, generateOffs);
      generateButtons(pageButtonsContainer, allOffs, generateOffs);
    });
}

function generateOffs(offs) {
  offsTable.innerHTML = "";
  console.log(offs);
  if (offs.length) {
    const offsFragment = $.createDocumentFragment();
    offsTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="text-sm">
        <th>ID</th>
        <th>Discount Code</th>
        <th>Discount Percent</th>
        <th>Date of Registration</th>
        <th>Expiration date</th>
        <th>Used for product</th>
        <th>Actions</th>
      </tr>`
    );
    offs.forEach((off) => {
      const tableRow = $.createElement("tr");

      tableRow.insertAdjacentHTML(
        "beforeend",
        `<td>${off.id}</td>
            <td>${off.discount_code}</td>
            <td>${off.discount_percent} %</td>
            <td>${off.register_date}</td>
            <td>${off.expire_date}</td>
            <td>${off.product_ID}</td>
            <td class="actions">
              <div>
                <button onclick="changeConfirmState(${off.id}, ${
          off.isConfirmed
        })" title="${off.isConfirmed ? "Reject" : "Confirm"}">${
          off.isConfirmed
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-circle-check"></i>'
        }</button>
                <button onclick="removeOff(${
                  off.id
                })" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </td>`
      );
      offsFragment.appendChild(tableRow);
    });
    offsTable.appendChild(offsFragment);
  } else {
    offsTable.style.border = "none";
    offsTable.innerHTML = "No discount found";
  }
}

function changeConfirmState(offID, prevConfirmState) {
  const isConfirmed = prevConfirmState ? 0 : 1;
  fetch(`${baseUrl}/offs/${offID}/${isConfirmed}`, {
    method: "PUT",
  }).then(() => getOffs());
}

function removeOff(offID) {
  mainAlert
    .fire({
      text: "Are you sure about removing the discount?",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/offs/${offID}`, {
          method: "DELETE",
        }).then(() => {
          getOffs();
          detailsAlert.fire({ text: "Discount removed." });
        })
    );
}

window.addEventListener("load", getOffs);

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  generateOffs(
    filter({
      id: filterID.value.trim(),
      discount_code: filterDiscountCode.value.trim(),
      discount_percent: filterDiscountPercent.value.trim(),
      register_date: filterRegisterDate.value,
      expire_date: filterExpireDate.value,
      product: filterProduct.value.trim(),
    })
  );
});

function filter({
  id,
  discount_code,
  discount_percent,
  register_date,
  expire_date,
  product,
}) {
  const filteredItems = [...allOffs]
    .filter((off) => (id ? off.id == id : off))
    .filter((off) => (discount_code ? off.discount_code == discount_code : off))
    .filter((off) =>
      discount_percent ? off.discount_percent == discount_percent : off
    )
    .filter((off) => (register_date ? off.register_date == register_date : off))
    .filter((off) => (expire_date ? off.expire_date == expire_date : off))
    .filter((off) => (product ? off.product_ID == product : off));

  return filteredItems;
}
