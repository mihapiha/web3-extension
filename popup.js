const btn = document.getElementById("save")
const valInput = document.getElementById("tipValue")

console.log("Init popup")
btn.addEventListener("click", (evt) => {
  console.log("Setting amount " + valInput.value)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {value: valInput.value})
  })
})
