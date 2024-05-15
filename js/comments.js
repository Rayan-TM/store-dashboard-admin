const commentsTable = $.getElementById("comments-table");
const filterID = document.querySelector("#id");
const filterUsername = document.querySelector("#username");
const filterContent = document.querySelector("#content");
const filterComment = document.querySelector("#comment");
const filterDate = document.querySelector("#date");
const btnSearch = document.querySelector("#btn-search");
const pageButtonsContainer = document.querySelector("#page-buttons-container");

let allComments = null;

function getComments() {
  fetch(`${baseUrl}/comments`)
    .then((res) => res.json())
    .then((comments) => {
      allComments = comments;
      generateCurrentPageItems(allComments, 1, generateComments);
      generateButtons(pageButtonsContainer, allComments, generateComments);
    });
}

function generateComments(comments) {
  commentsTable.innerHTML = "";
  if (comments.length) {
    console.log("all comments =>", comments);

    const commentsFragment = $.createDocumentFragment();
    commentsTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="text-sm">
        <th>ID</th>
        <th>Username</th>
        <th>Product/Article</th>
        <th>Comment</th>
        <th>Date</th>
        <th>Hour</th>
        <th>Actions</th>
      </tr>`
    );
    comments.forEach((comment) => {
      const tableRow = $.createElement("tr");

      comment.isReply === 1 &&
        tableRow.classList.add("bg-esther", "border-2", "border-title");

      tableRow.insertAdjacentHTML(
        "beforeend",
        `<td>${comment.id}</td>
            <td>${comment.user_ID}</td>
            <td>${comment.content_ID}</td>
            <td>${comment.content}</td>
            <td>${comment.date}</td>
            <td>${comment.hour}</td>
            <td class="actions">
              <div>
                <button onclick=answerComment(${JSON.stringify([
                  comment.isProduct,
                  comment.id,
                ])}) title="Reply"><i class="fa-solid fa-comment-dots"></i></button>
                <button onclick="confirmComment(${comment.id}, ${
          comment.isConfirmed
        })" title="${comment.isConfirmed ? "reject" : "accept"}">${
          comment.isConfirmed
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-circle-check"></i>'
        }</button>
                <button onclick="removeComment(${
                  comment.id
                })" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                <button onclick="editComment(${comment.id}, '${
          comment.content
        }')" title="Edit"><i class="fa-solid fa-pencil"></i></button>
              </div>
            </td>`
      );
      commentsFragment.appendChild(tableRow);
      commentsTable.appendChild(commentsFragment);
    });
  } else {
    commentsTable.style.border = "none";

    commentsTable.innerHTML = "No comment found";
  }
}

function answerComment([isProduct, commentID]) {
  fetch(`${baseUrl}/comments/content/${isProduct}/${commentID}`)
    .then((res) => res.json())
    .then((data) => {
      const prevCommentData = data[0];
      mainAlert
        .fire({
          title: "Add a reply to a user's comment",
          input: "textarea",
          icon: false,
          confirmButtonText: "ADD",
          preConfirm: (content) => {
            if (!content) {
              Swal.showValidationMessage("Please fill in the answer field");
            }
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            const newComment = {
              userID: 7,
              contentID: prevCommentData.content_ID,
              category: prevCommentData.category,
              content: result.value,
              isReply: 1,
              isProduct: prevCommentData.isProduct,
              replyID: commentID,
              isConfirmed: 0,
              date: getDate(),
              hour: getTime(),
            };

            fetch(`${baseUrl}/comments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newComment),
            }).then(() => getComments());
          }
        });
    });
}

function confirmComment(commentID, prevConfirmState) {
  const isConfirmed = prevConfirmState ? 0 : 1;
  fetch(`${baseUrl}/comments/${commentID}/${isConfirmed}`, {
    method: "PUT",
  }).then(() => getComments());
}

function removeComment(commentID) {
  mainAlert
    .fire({
      title: "Are you sure to delete the comment?",
    })
    .then(
      (result) =>
        result.isConfirmed &&
        fetch(`${baseUrl}/comments/${commentID}`, {
          method: "DELETE",
        }).then(() => {
          getComments();
          detailsAlert.fire({ text: "The comment was deleted." });
        })
    );
}

function editComment(commentID, commentContent) {
  mainAlert
    .fire({
      title: "Edit user comments",
      input: "textarea",
      inputValue: commentContent,
      icon: false,
      confirmButtonText: "Edit",
      preConfirm: (content) => {
        if (!content) {
          Swal.showValidationMessage("Please fill in the comment field");
        }
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        const updatedContent = {
          content: result.value,
        };

        fetch(`${baseUrl}/comments/edit/${commentID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedContent),
        }).then(() => {
          getComments();
          detailsAlert.fire({ text: "The comment was edited." });
        });
      }
    });
}

window.addEventListener("load", getComments);

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  generateComments(
    filter({
      id: filterID.value.trim(),
      username: filterUsername.value.trim(),
      content: filterContent.value.trim(),
      commentValue: filterComment.value.trim(),
      date: filterDate.value,
    })
  );
});

function filter({ id, username, content, commentValue, date }) {
  const filteredItems = [...allComments]
    .filter((comment) => (id ? comment.id == id : comment))
    .filter((comment) => (username ? comment.user_ID == username : comment))
    .filter((comment) => (content ? comment.content_ID == content : comment))
    .filter((comment) =>
      commentValue ? comment.content == commentValue : comment
    )
    .filter((comment) => (date ? comment.date == date : comment));

  return filteredItems;
}
