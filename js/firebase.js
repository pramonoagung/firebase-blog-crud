let config = {
  apiKey: "<API-KEY>",
  authDomain: "<AUTH-DOMAIN>",
  databaseURL: "<DATABASE-URL>",
  projectId: "<PROJECT-ID>",
  storageBucket: "<STORAGE-BUCKET>",
  messagingSenderId: "<MESSAGING-SENDER-ID>"
};

firebase.initializeApp(config);
let db = firebase.database();

//Create
let preview = document.getElementById("preview");
let titleId = document.getElementById("titleId");
let title = document.getElementById("title");
let content = document.getElementById("content");
let url = document.getElementById("url");

preview.addEventListener("submit", e => {
  e.preventDefault();

  if (!titleId.value || !title.value || !content.value || !url.value)
    return null;

  db.ref("posts/" + titleId.value).set({
    title: title.value,
    url: url.value,
    content: content.value
  });

  titleId.value = "";
  content.value = "";
  title.value = "";
  url.value = "";
});

// READ
let list = document.getElementById("list-of-posts");
let listRef = db.ref("/posts");

listRef.on("child_added", data => {
  let titleId = data.key;
  let title = data.val().title;
  let content = data.val().content;
  let url = data.val().url;

  let div = document.createElement("div");
  div.id = titleId;
  div.setAttribute("class", "column");
  div.innerHTML = card(titleId, title, content, url);
  list.appendChild(div);
});

list.addEventListener("click", e => {
  let listNode = e.target.parentNode.parentNode;

  // UPDATE
  if (e.target.id == "edit") {
    titleId.value = listNode.querySelector("#data-titleId").innerText;
    title.value = listNode.querySelector("#data-title").innerText;
    content.value = listNode.querySelector("#data-content").innerText;
    url.value = listNode.querySelector("#data-url").innerText;
  }

  // DELETE
  if (e.target.id == "delete") {
    if (confirm("Are you sure?")) {
      let id = listNode.querySelector("#data-titleId").innerText;
      db.ref("posts/" + id).remove();
    }
  }
});

listRef.on("child_changed", data => {
  let titleId = data.key;
  let title = data.val().title;
  let content = data.val().content;
  let url = data.val().url;

  let listNode = document.getElementById(titleId);
  listNode.innerHTML = card(titleId, title, content, url);
});

listRef.on("child_removed", data => {
  let listNode = document.getElementById(data.key);
  listNode.parentNode.removeChild(listNode);
});

function card(titleId, title, content, url) {
  return `
  <div class="card">
    <header class="card-header">
      <h1 class="card-header-title" id="data-title">${title}</h1>
      <center><img id="data-url" src="${url}"></center>
    </header>
    <div class="card-content">
      <span id="data-content">${content}</span><span id="data-titleId" hidden>${titleId}</span>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item" href="#preview" id="edit">Edit</a>
      <a class="card-footer-item" style="color:red" id="delete">Delete</a>
    </footer>
  </div>
  <br>
  `;
}
