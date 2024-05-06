const blogsTable = $.getElementById("blogs-table");
const filterID = document.querySelector("#id");
const filterTitle = document.querySelector("#title");
const filterCategory = document.querySelector("#category");
const filterStatus = document.querySelector("#status");
const filterDate = document.querySelector("#date");
const btnSearch = document.querySelector("#btn-search");
const pageButtonsContainer = document.querySelector("#page-buttons-container");

let allBlogs = null;

function getBlogs() {
  fetch("http://localhost:4000/blogs")
    .then((res) => res.json())
    .then((blogs) => {
      allBlogs = blogs;
      generateCurrentPageItems(allBlogs, 1, generateBlog);
      generateButtons(pageButtonsContainer, allBlogs, generateBlog);
    });
}

function generateBlog(blogs) {
  blogsTable.innerHTML = "";
  if (blogs.length) {
    const blogsFragment = $.createDocumentFragment();

    blogsTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="text-sm">
        <th>شناسه</th>
        <th>عکس</th>
        <th>نام</th>
        <th>تاریخ</th>
        <th>ساعت</th>
        <th>دسته بندی</th>
        <th>وضعیت</th>
        <th>عملیات</th>
      </tr>`
    );

    console.log("all blogs =>", blogs);
    blogs.forEach((blog) => {
      const tableRow = $.createElement("tr");

      tableRow.insertAdjacentHTML(
        "beforeend",
        `<td>${blog.id}</td>
            <td>
              <img src="${blog.image || "./assets/default.png"}" alt="" />
            </td>
            <td>${blog.title}</td>
            <td>${blog.date}</td>
            <td>${blog.hour}</td>
            <td>${blog.category}</td>
            <td>${blog.status ? "فعال" : "غیرفعال"}</td>
            <td class="actions">
                <div>
                  <button><a title="نمایش"><i class="fa-solid fa-eye"></i></a></button>
                  <button onclick=removeBlog(${
                    blog.id
                  }) title="حذف"><i class="fa-solid fa-trash-can"></i></button>
                  <button><a href="newContent.html?id=${
                    blog.id
                  }&type=blog" title="ویرایش"><i class="fa-solid fa-pencil"></i></a></button>
                </div>
              </td>`
      );
      blogsFragment.appendChild(tableRow);
    });
    blogsTable.appendChild(blogsFragment);
  } else {
    blogsTable.style.border = "none";

    blogsTable.innerHTML = "مقاله ای یافت نشد";
  }
}

function removeBlog(blogID) {
  mainAlert
    .fire({
      text: "آیا از حذف مقاله مطمئن هستید؟",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/blogs/${blogID}`, {
          method: "DELETE",
        }).then(() => {
          getBlogs();
          detailsAlert.fire({ text: "مقاله حذف شد." });
        })
    );
}

window.addEventListener("load", () => {
  getBlogs();
  loadCategoryBox(0);
});

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  generateBlog(
    filter({
      id: filterID.value.trim(),
      title: filterTitle.value.trim(),
      category: filterCategory.value,
      status: filterStatus.value,
      date: filterDate.value,
    })
  );
});

function filter({ id, title, category, status, date }) {
  console.log(date);
  const filteredItems = [...allBlogs]
    .filter((blog) => (id ? blog.id == id : blog))
    .filter((blog) => (title ? blog.name == title : blog))
    .filter((blog) => (category ? blog.category == category : blog))
    .filter((blog) => (status ? blog.status == status : blog))
    .filter((blog) => (date ? blog.date == date : blog));

  return filteredItems;
}
