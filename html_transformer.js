function addTipButtons() {
  const subjects = document.getElementsByClassName("labelSubject")
  for(i=0; i<subjects.length; i++) {
    console.log("Replacing " + i)
    const s = subjects[i];
    const addr = s.innerText 
    if(addr.startsWith("0x")) {
      
      const btn = document.createElement('button')
	  btn.innerText = "Tip"
	  btn.addEventListener('click', (evt) => {
        evt.preventDefault()
        console.log("Sending event")
        window.postMessage({type: "KOHL_TIP", address: addr})
      })
	  s.replaceWith(btn)
      
    }
  }
}

var kohlCoinAddress
function addAddressButton() {
  const postBtnParent = document.getElementById("formButton").parentElement
  const insertAddrBtn = document.createElement('button')
  const msg = document.getElementById("fieldMessage")
  insertAddrBtn.innerText = "Add Address"
  insertAddrBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    msg.value = kohlCoinAddress + "\n" + msg.value
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

injectScript( chrome.extension.getURL('web3js/dist/web3.min.js'), 'body');
injectScript( chrome.extension.getURL('contract_abi.js'), 'body');
injectScript( chrome.extension.getURL('tipping_logic.js'), 'body');


