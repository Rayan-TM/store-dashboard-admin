const filterID = document.querySelector("#id");
const filterTitle = document.querySelector("#title");
const filterCategory = document.querySelector("#category");
const filterStatus = document.querySelector("#status");
const filterIsAvailable = document.querySelector("#isAvailable");
const btnSearch = document.querySelector("#btn-search");
const pageButtonsContainer = document.querySelector("#page-buttons-container");

const productsTable = $.getElementById("products-table");
let mainProduct = null;
let allProducts = null;

function getProducts() {
  fetch("http://localhost:4000/products")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
      generateCurrentPageItems(allProducts, 1, generateProducts);
      generateButtons(pageButtonsContainer, allProducts, generateProducts);
    });
}

function generateProducts(products) {
  
  productsTable.innerHTML = "";
  if (products.length) {
    productsTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="text-sm">
    <th>شناسه</th>
    <th>عکس</th>
    <th>نام</th>
    <th>قیمت</th>
    <th>موجودی</th>
    <th>دسته بندی</th>
    <th>وضعیت</th>
    <th>عملیات</th>
  </tr>`
    );
    const productsFragment = $.createDocumentFragment();
    products.forEach((product) => {
      const tableRow = $.createElement("tr");

      tableRow.insertAdjacentHTML(
        "beforeend",
        ` <td>${product.id}</td>
        <td>
          <img src="${product.image || "./assets/default.png"}" alt="" />
        </td>
        <td>${product.name}</td>
        <td>${product.price ? product.price + " تومان" : "رایگان"}</td>
        <td>${product.isAvailable ? "موجود" : "ناموجود"}</td>
        <td>${product.category}</td>
        <td>${product.status ? "فعال" : "غیرفعال"}</td>
        <td class="actions">
          <div>
            <button><a title="نمایش"><i class="fa-solid fa-eye"></i></a></button>
            <button onclick=removeProduct(${
              product.id
            }) title="حذف"><i class="fa-solid fa-trash-can"></i></button>
            <button><a href="newContent.html?id=${
              product.id
            }&type=product" title="ویرایش"><i class="fa-solid fa-pencil"></i></a></button>
          </div>
        </td>`
      );
      productsFragment.appendChild(tableRow);
    });
    productsTable.appendChild(productsFragment);
    console.log("all products =>", products);
  } else {
    productsTable.style.border = "none";
    productsTable.innerHTML = "محصولی یافت نشد";
  }
}

function removeProduct(productID) {
  mainAlert
    .fire({
      text: "آیا از حذف محصول مطمئن هستید؟",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/products/${productID}`, {
          method: "DELETE",
        }).then(() => {
          getProducts();
          detailsAlert.fire({ text: "محصول حذف شد." });
        })
    );
}

function filter({ id, title, category, status, isAvailable }) {
  const filteredItems = [...allProducts]
    .filter((product) => (id ? product.id == id : product))
    .filter((product) => (title ? product.name == title : product))
    .filter((product) => (category ? product.category == category : product))
    .filter((product) => (status ? product.status == status : product))
    .filter((product) =>
      isAvailable ? product.isAvailable == isAvailable : product
    );

  return filteredItems;
}

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  generateProducts(
    filter({
      id: filterID.value.trim(),
      title: filterTitle.value.trim(),
      category: filterCategory.value,
      status: filterStatus.value,
      isAvailable: filterIsAvailable.value,
    })
  );
});

window.addEventListener("load", () => {
  getProducts();
  loadCategoryBox(1);
});
