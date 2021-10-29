function addTipButtons() {
  const subjects = document.getElementsByClassName("tipping")
  for(let s of subjects) {
    const btn = document.createElement('button')
	btn.innerText = "Tip₭"
    
	btn.addEventListener('click', (evt) => {
      evt.preventDefault()
      console.log("Sending event")
      window.postMessage({type: "KOHL_TIP", address: s.getAttribute("address")})
    })
      
	s.replaceWith(btn)  
  }
}

var kohlCoinAddress
function addAddressButton() {
  const postBtnParent = document.getElementById("formButton").parentElement
  const insertAddrBtn = document.createElement('button')
  const subject = document.getElementById("fieldSubject")
  
  insertAddrBtn.innerText = "Add Address"
  insertAddrBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    subject.value = kohlCoinAddress
  })

  postBtnParent.appendChild(insertAddrBtn)
}


console.log("Transforming")

window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type == "KOHL_ADDR")) {
    kohlCoinAddress = event.data.address
  }
}, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Relaying amount " + request.value)
    window.postMessage({type: "KOHL_AMOUNT", amount: request.value}) 
  }
)

addTipButtons()
addAddressButton()
const posts = document.getElementsByClassName("divPosts")[0]
const observer = new MutationObserver((mutationList, observer) => {
  console.log("mutation")
  addTipButtons()
})
observer.observe(posts, {childList: true, attributes: false})


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

injectScript( chrome.extension.getURL('bn/lib/bn.js'), 'body');
injectScript( chrome.extension.getURL('web3js/dist/web3.min.js'), 'body');
injectScript( chrome.extension.getURL('contract_abi.js'), 'body');
injectScript( chrome.extension.getURL('tipping_logic.js'), 'body');


