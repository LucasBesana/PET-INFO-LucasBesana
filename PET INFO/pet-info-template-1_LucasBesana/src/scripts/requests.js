import { renderAllPosts } from "./render.js";
import { toast } from "./toast.js";

const baseUrl = "http://localhost:3333";
const token = localStorage.getItem("@petinfo:token");
const green = "#087d5a"
const red = "#c83751"
const red1 = "#db3d5a"

const requestHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Informações de usuário logado
export async function getCurrentUserInfo() {
  const request = await fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: requestHeaders,
  });
  const user = await request.json();

  return user;
}

// Listagem de posts
export async function getAllPosts() {
  const request = await fetch(`${baseUrl}/posts`, {
    method: "GET",
    headers: requestHeaders,
  });
  const posts = await request.json();
  return posts;
}

// Desenvolva as funcionalidades de requisições aqui


export const loginRequest = async (requestBody) => {
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
  try {
    const result = await response.json()
    console.log(result);
    if (response.ok) {
      toast("Login realizado com sucesso", green);
      localStorage.setItem("@petinfo:token", result.token);
      setTimeout(() => {
        location.replace("./src/pages/feed.html");
      }, 2000);
      return result
    } else {
      toast("Email ou senha errado", red);
    }
  } catch (error) {
  }
}

export const newAccountRequest = async (requestBody) => {
  const response = await fetch(`${baseUrl}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
  try {
    const result = await response.json()
    if (response.ok) {
      toast("Sua conta foi criado com sucesso!", green);
      setTimeout(() => {
        location.replace("/");
      }, 2000);
    } else {
      toast("Aconteceu algo inesperado, revise suas informações", red);
      console.log(result)
    }
  } catch (error) {
  }
}

export async function getPost(id) {
  const request = await fetch(`${baseUrl}/posts/${id}`, {
    method: "GET",
    headers: requestHeaders,
  });
  const posts = await request.json();
  return posts;
}


export const sendPost = async (requestBody) => {
  const response = await fetch(`${baseUrl}/posts/create`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody)
  }).then(async response => {
    const result = await response.json()
    if (response.ok) {
      renderAllPosts();
      return result
    }

  })
  return response
}

export const deleteRequest = async (id) => {
  const request = await fetch(`${baseUrl}/posts/${id}`, {
    method: "DELETE",
    headers: requestHeaders,
  })
    .then(async (res) => {
      const result = await res.json()
      if (res.ok) {
        toast(result.message, red)
        renderAllPosts();
      }
    })
}

export const editRequest = async (id, editBody) => {
  const token = localStorage.getItem('@petInfo:token')
  const editPost = await fetch(`http://localhost:3333/posts/${id}`, {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(editBody)
  })
    .then(async res => {
      const resJson = await res.json()
      if (res.ok) {
        toast("Post alterado com sucesso!", green)
        renderAllPosts();
        return resJson
      } else {
        throw new Error(
          resJson.message
        );
      }
    })
    .catch((err) => toast(err, red))
  return editPost
}


