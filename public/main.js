const appElement = document.getElementById("app")
const socket = io("https://mighty-spire-83413.herokuapp.com");

appElement.insertAdjacentHTML("afterbegin", `
<input type="text" id="message" />
<button onclick="sendMessage()">Enviar</button>
`)

function sendMessage() {
    const message = document.getElementById("message").value

    socket.emit("message", message)

    document.getElementById("message").value = ""
}

socket.on("received", message => {
    console.log("RECEIVED => ", message)

    appElement.insertAdjacentHTML('beforeend', `<p>${message}</p>`);
})