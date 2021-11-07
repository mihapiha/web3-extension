const btn = document.getElementById("save")
const valInput = document.getElementById("tipValue")

const tipAmount = localStorage.getItem("tipAmount")
if(tipAmount !== null) {
  valInput.value = tipAmount
} else {
  localStorage.setItem("tipAmount", valInput.value)
}

console.log("Init popup")
btn.addEventListener("click", (evt) => {
  localStorage.setItem("tipAmount", valInput.value)

  console.log("Setting amount " + valInput.value)
  const msg = {value: valInput.value}
  chrome.tabs.query({}, (tabs) => tabs.forEach( tab => chrome.tabs.sendMessage(tab.id, msg) ) );
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.type)
    //only used for tip amount querying
    if(request.type == "KOHL_TIP_QUERY") {
      sendResponse({value: localStorage.getItem("tipAmount")})
    }
  }
)

