import { renderAllPosts } from "./render.js";
import { getAllPosts, getCurrentUserInfo, sendPost } from "./requests.js";

function showUserMenu() {
  const userAction = document.querySelector(".user__image");
  const menu = document.querySelector(".user__logout");

  userAction.addEventListener("click", (e) => {
    menu.classList.toggle("hidden");
  });
}

const showUser = async () => {
  const img = document.querySelector(".user__image");
  const h2 = document.querySelector("#username");

  const user = await getCurrentUserInfo();

  img.src = user.avatar
  h2.innerText = user.username
}

const logout = () => {
  const button = document.querySelector(".text4 ");

  button.addEventListener("click", (event) => {
    localStorage.clear();
    setTimeout(() => {
      location.replace("../../index.html");
    }, 2000);
  })
}

const newPost = () => {
  const openModal = document.querySelector("#user__newpost");
  const modal = document.querySelector("#new__post");
  const postButton = document.querySelector("#publish__newPost");
  const btn = document.querySelector("#close__newPost");
  const cancel = document.querySelector("#cancel__newPost");
  const title = document.querySelector("#new__post__title");
  const content = document.querySelector("#new__post__content");
  openModal.addEventListener("click", () => {
    modal.showModal()
  })
  btn.addEventListener("click", () => {
    modal.close()
  })
  cancel.addEventListener("click", () => {
    title.value = "";
    content.value = "";
    modal.close()
  })

  postButton.addEventListener("click", async (event) => {
    let postBody = {
      title: title.value,
      content: content.value
    }
    const newPost = await sendPost(postBody);
    console.log(newPost);
    modal.close();
  })
}

function main() {
  // Adiciona os eventos de click ao menu flutuante de logout
  showUserMenu();
  logout();
  // Renderiza todos os posts no feed (render.js)
  renderAllPosts();
  showUser();
  newPost();
}

main();




