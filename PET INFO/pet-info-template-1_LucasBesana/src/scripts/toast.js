export const toast = (message, color) => {
    Toastify({
    text: message,
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: color,
    },
  }).showToast();
}