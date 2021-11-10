const btn = document.getElementById("save")
const valInput = document.getElementById("tipValue")
const imgURL = chrome.extension.getURL("icon/kohl-k2-32.png");
document.getElementById("cabbage-icon").src = imgURL;


chrome.runtime.sendMessage({type: "KOHL_TIP_QUERY"}, (resp) => {
  valInput.value = resp.value
})

console.log("Init popup")

btn.addEventListener("click", (evt) => {
  console.log("Setting amount " + valInput.value)
  chrome.runtime.sendMessage({type: "KOHL_TIP_AMOUNT", value: valInput.value})
})
