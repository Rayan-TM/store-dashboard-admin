let itemsPerPage = 5;
let currentPage = 1;

function generateCurrentPageItems(allItems, currentPage, generateItems) {
  let endIndex = itemsPerPage * currentPage;
  let startIndex = endIndex - itemsPerPage;
  generateItems(allItems.slice(startIndex, endIndex));
}

function generateButtons(buttonsContainer, allItems, generateItems) {
  buttonsContainer.innerHTML = "";
  let pagesCount = Math.ceil(allItems.length / itemsPerPage);
  if (currentPage > pagesCount) {
    currentPage--;
  }
  for (let i = 1; i <= pagesCount; i++) {
    const button = document.createElement("li");
    button.innerText = i;
    if (i === currentPage) {
      button.classList.add("active");
      generateCurrentPageItems(allItems, currentPage, generateItems);
    }

    button.addEventListener("click", () => {
      currentPage = i;
      console.log(currentPage);
      generateCurrentPageItems(allItems, currentPage, generateItems);
      const prevPageButton = document.querySelector("li.active");
      prevPageButton?.classList.remove("active");
      button.classList.add("active");
    });
    buttonsContainer.appendChild(button);
  }
}
