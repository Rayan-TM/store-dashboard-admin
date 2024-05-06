const blogList = document.querySelector("#blog-list");
const blogsCount = document.querySelector("#blogs-count");
const productsCount = document.querySelector("#products-count");

let allProducts = null;
let allBlogs = null;

function getAllProducts() {
  fetch(`${baseUrl}/products`)
    .then((res) => res.json())
    .then((products) => {
      productsCount.innerText = products.length;
    });
}

function getAllBlogs() {
  fetch(`${baseUrl}/blogs`)
    .then((res) => res.json())
    .then((blogs) => {
      blogsCount.innerText = blogs.length;
      generateBlogsList(blogs);
    });
}

function generateBlogsList(blogs) {
  const todaysBlogs = blogs.filter((blog) => blog.date == getDate());
  todaysBlogs.forEach(
    (blog) => (blogList.innerHTML += `<li><a href="#">${blog.title}</a></li>`)
  );
}

window.addEventListener("load", async () => {
  getAllProducts();
  getAllBlogs();
});
