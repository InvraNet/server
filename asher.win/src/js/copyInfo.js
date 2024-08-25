const copiedMessage = "Copied!"
const copyIcon = "&#x1F4CB;"
var ipAddress = document.getElementById('deviceModalIP');


document.getElementById('ipAddrCopy').addEventListener('click', () => {
    navigator.clipboard
        .writeText(ipAddress.innerText)
        .then(() => alert("Copied to clipboard"))
        .catch((e) => alert(e.message));
});