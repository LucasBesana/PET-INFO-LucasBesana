// Desenvolva as funcionalidades de login aqui

import { loginRequest } from "./requests.js";

const handleLogin = () => {
    const inputs = document.querySelectorAll(".text3");
    const button = document.querySelector("#login__submit");

    button.addEventListener("click",  async (event) => {
        event.preventDefault();

        const requestBody = {}

        inputs.forEach((input) => {
            requestBody[input.name] = input.value;
        });

        const ensureLogin =  await loginRequest(requestBody);
        console.log(ensureLogin);
    });
}

const registerAccount = () => {
    const button = document.querySelector("#register__button");

    button.addEventListener("click", () => {
        setTimeout(() => {
            location.replace("./src/pages/register.html");
        }, 2000);
    })
}

handleLogin();
registerAccount();
