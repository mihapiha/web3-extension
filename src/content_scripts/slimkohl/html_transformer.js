const commonLogic = new CommonLogic()

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

commonLogic.setup((tipAmount) => {
  console.log("tip " + tipAmount)
})
