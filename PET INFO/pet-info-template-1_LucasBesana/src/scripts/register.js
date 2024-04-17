// Desenvolva as funcionalidades de cadastro aqui

import { newAccountRequest } from "./requests.js";
import { toast } from "./toast.js";

const green = "#087d5a"

const handleNewAccount = (requestBody) => {
    const newUser = document.querySelectorAll(".text3");
    const registerButton = document.querySelector("#register__submit");
    const redirectbutton = document.querySelector("#redirect__button");

    redirectbutton.addEventListener("click", (event) => {
        window.location.replace("/")
    })

    registerButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const requestBody = {};

        newUser.forEach((input) => {
            requestBody[input.name] = input.value;
        })

        const accountCreated = await newAccountRequest(requestBody);
        console.log(accountCreated);
    })
}

handleNewAccount();

