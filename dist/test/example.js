console.log("Hello world!")
const button = document.createElement("button")
button.innerText = "Click!"
button.onclick = () => System.import("@other/app")
document.getElementsByTagName("body")[0].appendChild(button)