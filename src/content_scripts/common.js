const addressRgx = /^0x[0-9a-fA-F]{40}/

function resizeInput() {
  this.style.width = this.value.length + 3 + "ch"
}


function CommonLogic() {
  this.addressDefaultChecked = true
  this.tipAmount = 1337
  this.kohlCoinAddress = "No address!"

  this.getAddressCheckbox = function(text=true) {
    const span = document.createElement('span')
    span.className = "kohltip kohltip-address"
    
    const img = document.createElement('img')
    img.src = chrome.extension.getURL("icon/kohl-k2-32.png");
    img.className = "kohltip kohltip-address"
    span.appendChild(img)

    if(text) {
      const spanTxt = document.createElement('span')
      spanTxt.innerText = "address"
      span.appendChild(spanTxt)
    }
   
    const insertAddrChk = document.createElement('input')
    insertAddrChk.setAttribute("type", "checkbox")
    insertAddrChk.checked = this.addressDefaultChecked
    insertAddrChk.className = "kohltip-address"
    span.appendChild(insertAddrChk)

    return [span, insertAddrChk]
  }
  
  this.getTipButton = function(address) {
    const span = document.createElement('span')
    span.className = "kohltip"
    const tipIn = document.createElement('input')
    tipIn.setAttribute("type", "number")
    tipIn.setAttribute("value", this.tipAmount)
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
    spanTxt.innerText = address
    spanTxt.className = "wallet"
    spanTxt.style.display = "none"
    
    span.appendChild(btn)
    span.appendChild(tipIn)
    span.appendChild(img)
    span.appendChild(spanTxt)
    
	btn.addEventListener('click', (evt) => {
      evt.preventDefault()
      console.log("Sending event")
      window.postMessage({type: "KOHL_TIP", address: address, amount: tipIn.value})
    })

    img.addEventListener('click', (evt) => {
      evt.preventDefault()
      if(spanTxt.style.display == "none") {
        spanTxt.style.display = "inline"
      } else {
        spanTxt.style.display = "none"
      }
    })

    return span

  }

  this.setup = function(tipAmountCallback) {
    //get tip amount
    chrome.runtime.sendMessage({type: "KOHL_TIP_QUERY"}, (response) => {
      this.tipAmount = response.value
      tipAmountCallback(this.tipAmount)
    })

    window.addEventListener("message", (event) => {
      // We only accept messages from ourselves
      if (event.source != window) {
        return;
      }

      if (event.data.type && (event.data.type == "KOHL_ADDR")) {
        this.kohlCoinAddress = event.data.address
      }
    }, false)


    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {

        if(request.type === "KOHL_TIP_AMOUNT") {

          console.log("Settomg amount " + request.value)
          this.tipAmount = request.value
          tipAmountCallback(this.tipAmount)
        } else if (request.type === "KOHL_DONATE") {
          if(window.top == window.self) //because scripts are also in iframes
            window.postMessage({type: "KOHL_TIP", address: request.address, amount: this.tipAmount})
        }
    
      })
  }
}

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

