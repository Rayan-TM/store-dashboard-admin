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
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th class="date">Date</th>
        <th class="hour">Hour</th>
        <th class="category">Category</th>
        <th class="status">Status</th>
        <th class="actions">Actions</th>
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
            <td class="date">${blog.date}</td>
            <td class="hour">${blog.hour}</td>
            <td class="category">${blog.category}</td>
            <td class="status">${blog.status ? "Active" : "Inactive"}</td>
            <td class="actions">
                <div>
                  <button><a title="Show"><i class="fa-solid fa-eye"></i></a></button>
                  <button onclick=removeBlog(${
                    blog.id
                  }) title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                  <button><a href="newContent.html?id=${
                    blog.id
                  }&type=blog" title="Edit"><i class="fa-solid fa-pencil"></i></a></button>
                </div>
              </td>`
      );
      blogsFragment.appendChild(tableRow);
    });
    blogsTable.appendChild(blogsFragment);
  } else {
    blogsTable.style.border = "none";

    blogsTable.innerHTML = "No article found";
  }
}

function removeBlog(blogID) {
  mainAlert
    .fire({
      text: "Are you sure to delete the article?",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/blogs/${blogID}`, {
          method: "DELETE",
        }).then(() => {
          getBlogs();
          detailsAlert.fire({ text: "The article was deleted." });
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
