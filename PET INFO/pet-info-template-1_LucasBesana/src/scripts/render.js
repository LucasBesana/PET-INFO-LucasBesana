import { getCurrentUserInfo, getAllPosts, getPost, deleteRequest, editRequest } from "./requests.js";

// Renderiza todos os posts
export async function renderAllPosts() {
  const postSection = document.querySelector(".posts");
  postSection.innerHTML = "";
  const posts = await getAllPosts();

  posts.forEach(async (post) => {
    const postArticle = await renderPost(post, true);
    postSection.appendChild(postArticle);
  });
}

// Renderiza um post
async function renderPost(post) {
  const postContainer = document.createElement("article");
  postContainer.classList.add("post");

  const postTitle = document.createElement("h2");
  postTitle.classList.add("post__title", "text1", "bolder");
  postTitle.innerText = post.title;

  const postContent = document.createElement("p");
  postContent.classList.add("post__content", "text3");

  const postHeader = await renderPostHeader(post);

  postContent.classList.add("post__content--feed", "text3");
  postContent.innerText = post.content;

  const openButton = document.createElement("a");
  openButton.classList.add("post__open", "text3", "bold");
  openButton.innerText = "Acessar publicação";
  openButton.id = post.id;
  openButton.addEventListener("click", async (event) => {
    const findPost = await getPost(openButton.id);
    showContent(findPost);
  })

  postContainer.append(postHeader, postTitle, postContent, openButton);

  return postContainer;
}

const showContent = (post) => {
  const dialog = document.querySelector(".modal__controller");
  const modalContainer = document.querySelector(".modal__content");
  dialog.showModal();
  const date = handleDate(post.created_at);

  modalContainer.innerHTML = "";

  modalContainer.insertAdjacentHTML("afterbegin",
    `
  <div class="modal__post__header">
      <div>
          <img src=${post.user.avatar} alt="" class="post__user__icon">
          <p class="post__username">${post.user.username}</p>
          <p class="post__date">${date}</p>
      </div>
          <button id ="closeModalContent">X</button>
  </div>
  <div class="modal__post__content">
      <h2>${post.title}</h2>
      <p>${post.content}</p>
  </div>
  `)
  const btn = document.querySelector("#closeModalContent");
  btn.addEventListener("click", () => {
    dialog.close();
  })
}

// Verifica a permissao do usuário para editar/deletar um post
async function checkEditPermission(authorID) {
  const { id } = await getCurrentUserInfo();

  if (Object.values({ id }, [0]).toString() == authorID) {
    return true;
  } else {
    return false;
  }
}

// Renderiza o cabeçalho de um post no feed
async function renderPostHeader(post) {
  const userInfo = post.user;

  const postDateInfo = handleDate(post.createdAt);

  const postHeader = document.createElement("header");
  postHeader.classList.add("post__header");

  const postInfo = document.createElement("div");
  postInfo.classList.add("post__info");

  const authorImage = document.createElement("img");
  authorImage.classList.add("post__author-image");
  authorImage.src = userInfo.avatar;

  const authorName = document.createElement("h2");
  authorName.classList.add("post__author-name", "text4", "bolder");
  authorName.innerText = userInfo.username;

  const divisor = document.createElement("small");
  divisor.innerText = "|";
  divisor.classList.add("post__date", "text4");

  const postDate = document.createElement("small");
  postDate.classList.add("post__date", "text4");
  postDate.innerText = postDateInfo;

  postInfo.append(authorImage, authorName, divisor, postDate);

  postHeader.appendChild(postInfo);

  const editable = await checkEditPermission(userInfo.id);

  if (editable) {
    const postActions = renderPostActions(post.id);
    postHeader.appendChild(postActions);
  }

  return postHeader;
}

// Renderiza as opções de "Editar" e "Deletar" caso o usuário seja dono do post
function renderPostActions(postID) {
  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("post__actions");

  const editButton = document.createElement("button");
  editButton.classList.add(
    "post__button--edit",
    "btn",
    "btn--gray",
    "btn--small",
    "text4"
  );
  editButton.dataset.id = postID;
  editButton.innerText = "Editar";
  editButton.addEventListener("click", async () => {
    const post = await getPost(editButton.dataset.id);
    setTimeout(() => {
      showEditModal(post, editButton.dataset.id);
      }, 200);
  })

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "post__button--delete",
    "btn",
    "btn--gray",
    "btn--small",
    "text4"
  );
  deleteButton.dataset.id = postID;
  deleteButton.innerText = "Excluir";
  deleteButton.addEventListener("click", () => {
    const modal = document.querySelector(".modal__delete");
    modal.showModal();
    const confirmDelete = document.querySelector("#confirm__delete__button");
    const closeModal = document.querySelector("#close__delete__modal")
    const cancelModal = document.querySelector("#cancel__delete__modal")
    confirmDelete.addEventListener("click", () => {
      modal.close()
      deleteRequest(deleteButton.dataset.id)
    })
    closeModal.addEventListener("click", () => {
      modal.close()
    })
    cancelModal.addEventListener("click", () => {
      modal.close()
    })
  })
  actionsContainer.append(editButton, deleteButton);

  return actionsContainer;
}

// Lida com a data atual
function handleDate(timeStamp) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const date = new Date(timeStamp);
  const month = months.at(date.getMonth());
  const year = date.getFullYear();

  return `${month} de ${year}`;
}

const showEditModal = (post, id) => {
  const cancel = document.querySelector(".modal__edition__footer > .close-cancel__button");
  const savePostBtn = document.querySelector(".modal__edition__footer > .confirm__button");
  const contentInput = document.querySelector("#edit__content");
  const titleInput = document.querySelector("#edit__title");
  const modal = document.querySelector(".modal__edition");

  contentInput.value = post.content;
  titleInput.value = post.title;
  modal.showModal()
  cancel.addEventListener("click", () => {
    modal.close()
  })

  const closeBtn = document.querySelector(".modal__edition__content > header > button")
  closeBtn.addEventListener("click", () => {
    modal.close()
  })
  const btn = document.querySelector(".modal__edition__footer > .confirm__button")
  let editBody = {};
  btn.addEventListener("click", function editClick(){
    editBody.title = titleInput.value;
    editBody.content = contentInput.value;
    editRequest(id, editBody)
    modal.close()
    btn.removeEventListener("click", editClick);
  })
}
