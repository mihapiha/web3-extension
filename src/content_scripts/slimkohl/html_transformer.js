const commonLogic = new CommonLogic()  

function addTipButtons(rootEl) {
  const subjects = rootEl.getElementsByClassName("subject")
  for(let s of subjects) {
    let addr = ""
    if(addressRgx.test(s.innerText)) {
      addr = s.innerText
    } else {
      continue
    }
    
    const span = commonLogic.getTipButton(addr)
	s.replaceWith(span)  
  }
}



window.addEventListener('APP-LOADED', () => {
  const newPost = document.getElementById("new-post-btn")
  const [span, insertAddrChk] = commonLogic.getAddressCheckbox(false)
  newPost.parentElement.insertBefore(span, newPost)

  window.addEventListener('mousedown', (e) => {
    const t = e.target
    const nb = t.closest('.nav-btn')
    
    if((nb !== null && nb.title.toLowerCase() === "post") ||
       t.matches('.thread-id') ||
       t.matches('.post-id') ||
       t.matches('.index-reply')) {

      if(insertAddrChk.checked)
        document.getElementById("post-form-subject").value = commonLogic.kohlCoinAddress

    }
  }, {capture:true})

})


const observer = new MutationObserver((mutationList, observer) => {
    console.log("mutation")
    for(const mutation of mutationList) {
      for(const postCell of mutation.addedNodes) {
        addTipButtons(postCell)
      }
    }
  })


commonLogic.setup((tipAmount) => {
  for(const input of document.querySelectorAll("input.kohltip")) {
    input.value = tipAmount
  }
})


window.addEventListener('THREAD-DONE', () => {
  addTipButtons(document)
  observer.observe(document.getElementsByClassName("THREAD-PAGE")[0],
                   {childList: true, attributes: false})
})
