function addTipButtons(rootEl) {
  const subjects = rootEl.getElementsByClassName("tipping")
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
var addressDefaultChecked = true
function addAddressButton() {
  const postBtn = document.getElementById("formButton")
  if(postBtn === null) {
    console.log("No post button")
    return
  }
  const postBtnParent = postBtn.parentElement
  const insertAddrChk = document.createElement('input')
  insertAddrChk.setAttribute("type", "checkbox")
  insertAddrChk.checked = addressDefaultChecked
  const subject = document.getElementById("fieldSubject")
  
  postBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    if(insertAddrChk.checked) {
      subject.value = kohlCoinAddress
    }
  })

  postBtnParent.appendChild(insertAddrChk)
}

function setObserver() {
  const posts = document.getElementsByClassName("divPosts")[0]
  if(posts === null || posts === undefined) {
    console.log("No posts to observe")
    return
  }
  
  const observer = new MutationObserver((mutationList, observer) => {
    console.log("mutation")
    for(const mutation of mutationList) {
      for(const postCell of mutation.addedNodes) {
        addTipButtons(postCell)
      }
    }
  })
  
  observer.observe(posts, {childList: true, attributes: false})
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


addTipButtons(document)
addAddressButton()
setObserver()


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


