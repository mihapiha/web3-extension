var kohlCoinAddress = "No address!"
var addressDefaultChecked = true
var tipAmount = 1337

function resizeInput() {
  this.style.width = this.value.length + 3 + "ch"
}

function addTipButtons(rootEl) {
  const subjects = rootEl.getElementsByClassName("tipping")
  for(let s of subjects) {
    const span = document.createElement('span')
    span.className = "kohltip"
    const tipIn = document.createElement('input')
    tipIn.setAttribute("type", "number")
    tipIn.setAttribute("value", tipAmount)
    tipIn.className = "kohltip"
    resizeInput.call(tipIn)
    tipIn.addEventListener('input', resizeInput)
    const btn = document.createElement('div')
	btn.innerText = "Tip"
    btn.className = "btn-kohltip"
    const img = document.createElement('img')
    img.src = chrome.extension.getURL("icon/kohl-k2-32.png");
    img.className = "kohltip img-kohl-clickable"
    const spanTxt = document.createElement('span')
    spanTxt.innerText = s.getAttribute("address")
    spanTxt.className = "wallet"
    spanTxt.style.display = "none"
    
    span.appendChild(btn)
    span.appendChild(tipIn)
    span.appendChild(img)
    span.appendChild(spanTxt)
    
	btn.addEventListener('click', (evt) => {
      evt.preventDefault()
      console.log("Sending event")
      window.postMessage({type: "KOHL_TIP", address: s.getAttribute("address"), amount: tipIn.value})
    })

    img.addEventListener('click', (evt) => {
      evt.preventDefault()
      if(spanTxt.style.display == "none") {
        spanTxt.style.display = "inline"
      } else {
        spanTxt.style.display = "none"
      }
    })
      
	s.replaceWith(span)  
  }
}

function addAddressCheckbox(buttonId, fieldId) {
  const postBtn = document.getElementById(buttonId)
  if(postBtn === null) {
    console.log("No post button")
    return
  }
  const postBtnParent = postBtn.parentElement

  const span = document.createElement('span')
  span.className = "kohltip kohltip-address"
  const img = document.createElement('img')
  img.src = chrome.extension.getURL("icon/kohl-k2-32.png");
  img.className = "kohltip kohltip-address"
  const insertAddrChk = document.createElement('input')
  insertAddrChk.setAttribute("type", "checkbox")
  insertAddrChk.checked = addressDefaultChecked
  insertAddrChk.className = "kohltip-address"
  const spanTxt = document.createElement('span')
  spanTxt.innerText = "address"

  span.appendChild(img)
  span.appendChild(spanTxt)
  span.appendChild(insertAddrChk)
  
  const subject = document.getElementById(fieldId)
  postBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    if(insertAddrChk.checked) {
      subject.value = kohlCoinAddress
    }
  })

  postBtnParent.appendChild(span)
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


function queryTipAmount() {
  chrome.runtime.sendMessage({type: "KOHL_TIP_QUERY"}, (response) => {
    tipAmount = response.value
    for(const input of document.querySelectorAll("input.kohltip")) {
      input.value = tipAmount
    }
  })
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
    console.log("Settomg amount " + request.value)
    tipAmount = request.value
    for(const input of document.querySelectorAll("input.kohltip")) {
      input.value = tipAmount
    }
  }
)

addTipButtons(document)
addAddressCheckbox("formButton", "fieldSubject")
addAddressCheckbox("qrbutton", "qrsubject")
setObserver()
queryTipAmount()

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

injectScript( chrome.extension.getURL('libs/bn/lib/bn.js'), 'body');
injectScript( chrome.extension.getURL('libs/web3js/dist/web3.min.js'), 'body');
injectScript( chrome.extension.getURL('src/page_scripts/contract_abi.js'), 'body');
injectScript( chrome.extension.getURL('src/page_scripts/tipping_logic.js'), 'body');


