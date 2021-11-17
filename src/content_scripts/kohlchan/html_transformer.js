const commonLogic = new CommonLogic()

function addTipButtons(rootEl) {
  const subjects = rootEl.getElementsByClassName("labelSubject")
  for(let s of subjects) {
    let addr = ""
    if(addressRgx.test(s.innerText)) {
      addr = s.innerText
    } else if(s.firstElementChild !== null && s.firstElementChild.hasAttribute("address")) {
      addr = s.firstElementChild.getAttribute("address")
    } else {
      continue
    }
    
    const span = commonLogic.getTipButton(addr)
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

  const [span, insertAddrChk] = commonLogic.getAddressCheckbox()
  
  const subject = document.getElementById(fieldId)
  postBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    if(insertAddrChk.checked) {
      subject.value = commonLogic.kohlCoinAddress
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


function foreverTransform() {
  setTimeout(() => {
    addTipButtons(document)
    foreverTransform()
  }, 5000)
}

console.log("Transforming")


addTipButtons(document)
foreverTransform() //ugly solution but it works
addAddressCheckbox("formButton", "fieldSubject")
addAddressCheckbox("qrbutton", "qrsubject")
setObserver()

commonLogic.setup((tipAmount) => {
  for(const input of document.querySelectorAll("input.kohltip")) {
    input.value = tipAmount
  }
})

