const btn = document.getElementById("save")
const valInput = document.getElementById("tipValue")
const imgURL = chrome.extension.getURL("icon/kohl-k2-32.png");
document.getElementById("cabbage-icon").src = imgURL;

const btnDev = document.getElementById("donate-dev")
const btnKC = document.getElementById("donate-kc")

function donate(addr) {
  const msg = {type: "KOHL_DONATE", address: addr}
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg)
  })
}


chrome.runtime.sendMessage({type: "KOHL_TIP_QUERY"}, (resp) => {
  valInput.value = resp.value
})

console.log("Init popup")

btn.addEventListener("click", (evt) => {
  console.log("Setting amount " + valInput.value)
  chrome.runtime.sendMessage({type: "KOHL_TIP_AMOUNT", value: valInput.value})
})

btnDev.addEventListener("click", () => donate("0x11A14df500f7ad493156Ee85EFF8e5902807fcF0"))
btnKC.addEventListener("click", () => donate("0x2e33eC557119387b93d0d7bE6856551f20eCCb85"))
