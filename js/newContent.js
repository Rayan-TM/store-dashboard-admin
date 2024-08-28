const availableCheckbox = document.querySelector("#available-checkbox");
const statusContainer = document.querySelector("#status-container");
const title = document.querySelector("#title");
const selectType = document.querySelector("#post-type");
const statusCheckBox = document.querySelector("#status");
const commentEnabledCheckBox = document.querySelector("#comment-enabled");
const submitBtn = document.querySelector("#submit-btn");
const productPrice = document.querySelector("#product-price");
const productPriceContainer = document.querySelector(".price-container");

const singleUploader = document.querySelector("#single-img");
const multiUploader = document.querySelector("#multi-img");
const output = document.querySelector(".multi-img-container");
const singleUploaderIcon = document.querySelector(".single-upload-icon");
const singleImageContainer = document.querySelector(".single-image-container");
const multiImageContainer = document.querySelector(".multi-image-container");
const container = document.createElement("div");
const colorPickerContainer = document.querySelector(".color-picker");
const colorInput = document.querySelector(".color-input");
const selectColor = document.querySelector(".select-color");
const colorsContainer = document.querySelector(".colors-container");

container.className = "relative group single-img-container";

let imageContainer = null;
let colors = null;
let selectedColors = [];
let prevColors = null;
let albums = "";
let singleImage = null;
let file = null;

const locationSearch = location.search;
const urlParams = new URLSearchParams(locationSearch);
const contentID = urlParams.get("id");
const contentUrl = urlParams.get("url");
const contentType = urlParams.get("type");
let myEditor = null;

ClassicEditor.create(document.getElementById("editor"))
  .then((editor) => (myEditor = editor))
  .catch((err) => console.log(err));

function loadContentImage(image) {
  if (image) {
    container.innerHTML = `<img src="${image}" alt="" />
    <button onclick="removeSingleImage()" class="group-hover:flex w-5 h-5 block"><i class="fa-solid fa-xmark"></i></button>`;
    singleUploaderIcon.replaceWith(container);
  }
}

function loadMultiImage(image) {
  albums += `,${image}`;
  let randomId = crypto.randomUUID().slice(0, 6);
  output.innerHTML += `
  <div id='image${randomId}' class="relative group basis-[28%] h-10 bg-cover">
    <button onclick='removeImage(event)' class="group-hover:flex"><i class="fa-solid fa-xmark"></i></button>
  </div>`;

  imageContainer = document.querySelector(`#image${randomId}`);
  imageContainer.style.backgroundImage = `url('${image}')`;
}

async function loadNewContentInputs() {
  if (contentID === null) {
    submitBtn.innerText = "ADD";
  } else {
    selectType.classList.add("hidden");
    if (contentType === "product") {
      const [currentProduct] = await fetch(`${baseUrl}/products/${contentUrl}`)
        .then((res) => res.json())
        .then((product) => product);

      title.value = currentProduct.name;
      myEditor.setData(currentProduct.description);
      checkSelectType("product", currentProduct.category);
      productPrice.value = currentProduct.price;
      productPrice.focus();
      title.focus();
      statusCheckBox.checked = currentProduct.status;
      availableCheckbox.checked = currentProduct.isAvailable;
      commentEnabledCheckBox.checked = currentProduct.allowComment;
      loadContentImage(currentProduct.image);

      if (currentProduct.album.length) {
        const albumUrls = currentProduct.album.split(",");
        output.classList.replace("hidden", "flex");
        albumUrls.forEach((url) => loadMultiImage(url));
      }

      prevColors = JSON.parse(currentProduct.colors) || [];
      generateColorsInContainer(prevColors);
    } else {
      const [currentBlog] = await fetch(`${baseUrl}/blogs/${contentID}`)
        .then((res) => res.json())
        .then((blog) => blog);

      title.value = currentBlog.title;
      myEditor.setData(currentBlog.content);
      checkSelectType("blog", currentBlog.category);
      statusCheckBox.checked = currentBlog.status;
      commentEnabledCheckBox.checked = currentBlog.allowComment;
      loadContentImage(currentBlog.image);

      console.log(currentBlog);
    }
    submitBtn.innerText = "Edit";
  }
}

function checkSelectType(type, contentName = "") {
  if (type === "product") {
    availableCheckbox.disabled = false;
    availableCheckbox.classList.remove("opacity-50");
    statusContainer.classList.remove("pointer-events-none", "opacity-50");
    multiImageContainer.classList.remove("hidden");
    colorPickerContainer.classList.remove("hidden");
    productPriceContainer.classList.remove("hidden");
    selectCategory.classList.remove("hidden");
    submitBtn.disabled = false;
    loadCategoryBox(1, contentName);
  } else if (type === "blog") {
    multiImageContainer.classList.add("hidden");
    availableCheckbox.disabled = true;
    availableCheckbox.classList.add("opacity-50");
    statusContainer.classList.remove("pointer-events-none", "opacity-50");
    colorPickerContainer.classList.add("hidden");
    productPriceContainer.classList.add("hidden");
    selectCategory.classList.remove("hidden");
    submitBtn.disabled = false;
    loadCategoryBox(0, contentName);
  } else {
    multiImageContainer.classList.add("hidden");
    colorPickerContainer.classList.add("hidden");
    statusContainer.classList.add("pointer-events-none", "opacity-50");
    productPriceContainer.classList.add("hidden");
    selectCategory.classList.add("hidden");
    submitBtn.disabled = true;
  }
}

function addContent() {
  if (selectType.value === "product") {
    const newProduct = {
      name: title.value || "Unknown",
      price: productPrice.value || 0,
      description: myEditor.getData() || "",
      colors: JSON.stringify(selectedColors) || [],
      category: selectCategory.value || "Uncategorized",
      image: singleImage?.getAttribute("src") || "",
      album: albums.split(",").slice(1).join(",") || "",
      status: statusCheckBox.checked ? 1 : 0,
      isAvailable: availableCheckbox.checked ? 1 : 0,
      allowComment: commentEnabledCheckBox.checked ? 1 : 0,
    };

    fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    }).then(() => {
      detailsAlert
        .fire({ text: "Product added successfully.", icon: "success" })
        .then(() => location.reload());
    });
  } else {
    const newBlog = {
      title: title.value || "Unknown",
      content: myEditor.getData() || "",
      category: selectCategory.value || "Uncategorized",
      image: singleImage?.getAttribute("src") || "",
      status: statusCheckBox.checked ? 1 : 0,
      allowComment: commentEnabledCheckBox.checked ? 1 : 0,
      date: getDate(),
      hour: getTime(),
    };

    fetch(`${baseUrl}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBlog),
    }).then(() => {
      detailsAlert
        .fire({ text: "Article successfully added.", icon: "success" })
        .then(() => location.reload());
    });

    console.log(newBlog);
  }
}

function updateContent() {
  if (contentType === "product") {
    const updatedProduct = {
      name: title.value + "" || "Unknown",
      price: +productPrice.value || 0,
      description: myEditor.getData() || "",
      colors: JSON.stringify(selectedColors) || [],
      category: selectCategory.value || "Uncategorized",
      image: singleImage?.getAttribute("src") || "",
      album: albums.split(",").slice(1).join(",") || "",
      status: statusCheckBox.checked ? 1 : 0,
      isAvailable: availableCheckbox.checked ? 1 : 0,
      allowComment: commentEnabledCheckBox.checked ? 1 : 0,
    };

    fetch(`${baseUrl}/products/${contentID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    }).then(() =>
      detailsAlert.fire({
        text: "The product has been edited successfully.",
        icon: "success",
      })
    );
  } else {
    const updatedBlog = {
      title: title.value || "Unknown",
      content: myEditor.getData() || "",
      category: selectCategory.value || "Uncategorized",
      image: singleImage?.getAttribute("src") || "",
      status: statusCheckBox.checked ? 1 : 0,
      allowComment: commentEnabledCheckBox.checked ? 1 : 0,
    };

    fetch(`${baseUrl}/blogs/${contentID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBlog),
    }).then(() => {
      detailsAlert.fire({
        text: "The article has been edited successfully.",
        icon: "success",
      });
    });
  }
}

selectType.addEventListener("change", () => checkSelectType(selectType.value));

window.addEventListener("load", () => {
  checkSelectType(selectType.value);
  loadNewContentInputs();
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  singleImage = document.querySelector(".single-img-container img");
  if (submitBtn.innerText === "ADD") {
    addContent();
  } else {
    updateContent();
  }
});

//***************** start color picker  ****************/

fetch(`${baseUrl}/colors`)
  .then((res) => res.json())
  .then((data) => (colors = [...data]));

function toggleSelectColor(color) {
  const currentColorElem = event.target;
  if (currentColorElem.className === "bg-primary text-secondary") {
    currentColorElem.className = "";
    selectedColors = selectedColors.filter(
      (color) => color.title !== currentColorElem.innerText
    );
  } else {
    currentColorElem.className = "bg-primary text-secondary";
    selectedColors.push(color);
  }
  console.log(selectedColors);
  generateColorsInContainer(selectedColors);
}

function generateColorsInSelectBox(currentColors) {
  selectColor.innerHTML = "";
  currentColors.forEach((color) => {
    selectColor.insertAdjacentHTML(
      "beforeend",
      `<span onclick=toggleSelectColor(${JSON.stringify(color)})>${
        color.title
      }</span>`
    );
  });
}

function generateColorsInContainer(colorContainer) {
  colorsContainer.innerHTML = "";

  colorContainer.forEach((color) => {
    colorsContainer.insertAdjacentHTML(
      "beforeend",
      `<div id=${color.code}>
      <span>${color.title}</span>
    </div>`
    );
    const colorElem = document.getElementById(`${color.code}`);

    colorElem.style.backgroundColor = color.code;
  });
}

colorInput.addEventListener("click", () => {
  if (selectColor.classList.contains("hidden")) {
    selectColor.classList.replace("hidden", "flex");
    generateColorsInSelectBox(colors, prevColors);
  } else {
    selectColor.classList.replace("flex", "hidden");
  }
});

colorInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();
  if (inputValue !== "") {
    selectColor.innerHTML = "";
    selectColor.classList.replace("hidden", "flex");
    colors.forEach((color) => {
      if (color.title.includes(inputValue)) {
        selectColor.insertAdjacentHTML(
          "beforeend",
          `<span onclick=toggleSelectColor(${JSON.stringify(color)})>${
            color.title
          }</span>`
        );
      }
    });
  } else {
    generateColorsInSelectBox(colors);
  }
});

//***************** finish color picker  ****************/

//***************** start image uploader  ****************/

function getFileSize(file) {
  const bytesPerMegabyte = 1000000;
  const fileSize = Math.floor(file?.size / bytesPerMegabyte);
  return fileSize;
}

function uploadImage(file) {
  if (isUserDeviceCompatible) {
    const fileSize = getFileSize(file);

    if (file.type.match("image") && fileSize < 5) {
      container.innerHTML = "";
      loadContentImage(`./assets/images/${file.name}`);
    } else if (fileSize > 5) {
      alert("The file size should not be more than 5 MB");
      singleUploaderIcon.classList.remove("text-title");
    } else {
      alert("The selected file must be a photo");
      singleUploaderIcon.classList.remove("text-title");
    }
  } else {
    alert("Your device is not compatible to upload the file");
  }
}

const isUserDeviceCompatible = Boolean(
  window.File && window.FileReader && window.FileList && window.Blob
);

singleUploader.addEventListener("change", (e) => {
  const file = e.target.files[0];
  uploadImage(file);
});

singleImageContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  singleUploaderIcon.classList.add("text-title");
});

singleImageContainer.addEventListener("dragleave", (e) => {
  e.preventDefault();
  singleUploaderIcon.classList.remove("text-title");
});

singleImageContainer.addEventListener("drop", (e) => {
  e.preventDefault();

  file = e.dataTransfer.files[0];
  uploadImage(file);
});

multiUploader.addEventListener("change", (e) => {
  if (isUserDeviceCompatible) {
    const files = e.target.files;

    for (const file of files) {
      const fileSize = getFileSize(file);
      if (!file.type.match("image")) continue;
      if (fileSize > 5) {
        alert(`${file.name} Image size is larger than 5 MB`);
      } else {
        output.classList.replace("hidden", "flex");
        console.log(file.name);
        loadMultiImage(`./assets/images/${file.name}`);
      }
    }
  } else {
    alert("Your device is not compatible to upload the file");
  }
});

function removeImage(e) {
  const imgContainer = e.target.parentElement.parentElement;
  output.removeChild(imgContainer);
  if (output.children.length <= 0) {
    output.classList.replace("flex", "hidden");
  }
}

function removeSingleImage() {
  container.replaceWith(singleUploaderIcon);
  singleUploaderIcon.classList.remove("text-title");
}

//***************** finish image uploader  ****************/
