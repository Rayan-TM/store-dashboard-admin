const $ = document;
const themeList = $.querySelector(".theme-list");
const themeItems = $.querySelectorAll(".theme-list span");
const btnTheme = $.querySelector(".btn-theme");
const btnToggleSidebar = $.querySelector(".fa-bars");
const sidebar = $.querySelector("aside");
const sidebarTitle = $.querySelector(".sidebar-title");

const baseUrl = "http://localhost:4000";

function formatDate(value) {
  return value < 10 ? `0${value}` : value;
}

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${formatDate(month)}-${formatDate(day)}`;
}

function getTime() {
  const date = new Date();

  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${hour}:${minute}`;
}

const mainAlert = Swal.mixin({
  icon: "question",
  confirmButtonText: "Delete",
  showCancelButton: true,
  cancelButtonText: "Cancel",
  customClass: {
    confirmButton: "bg-primary text-white py-2 px-4 rounded-md",
    cancelButton: "bg-esther text-title py-2 px-4 rounded-md",
    actions: "gap-3",
  },
  buttonsStyling: false,
});

const detailsAlert = Swal.mixin({
  icon: "info",
  confirmButtonText: "OK",
  customClass: {
    container: "main-table",
    confirmButton: "bg-primary text-white py-2 px-4 rounded-md",
  },
  buttonsStyling: false,
});

window.addEventListener("click", (e) => {
  if (!btnTheme.contains(e.target) && !themeList.contains(e.target)) {
    themeList.classList.add("hidden");
  }
});

btnToggleSidebar.addEventListener("click", () => {
  if (sidebar.classList.contains("w-[250px]")) {
    sidebar.classList.replace("w-[250px]", "w-[50px]");
    sidebar.classList.add('active')
    sidebar.classList.add("responsive")
  } else {
    sidebar.classList.replace("w-[50px]", "w-[250px]");
    sidebar.classList.remove('active')
    sidebar.classList.remove("responsive")
  }
});

btnTheme.addEventListener("click", (e) => {
  if (themeList.classList.contains("hidden")) {
    themeList.classList.remove("hidden");
  } else {
    themeList.classList.add("hidden");
  }
});

themeItems.forEach((list) =>
  list.addEventListener("click", (e) => {
    localStorage.setItem("theme", e.target.innerText);
    document.documentElement.dataset.theme = localStorage.getItem("theme");
  })
);

window.addEventListener("load", () => {
  const currentTheme = localStorage.getItem("theme");
  let documentTheme = document.documentElement.dataset.theme;
  currentTheme
    ? (documentTheme = localStorage.getItem("theme"))
    : (documentTheme = "Classic");
});
