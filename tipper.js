function tipKohl(address) {
  if(document.ethereum === undefined) {
    alert("No wallet detected")
    return
  }

  console.log("Tipping " +  address)
}

function addTipButtons() {
  const subjects = document.getElementsByClassName("labelSubject")
  for(i=0; i<subjects.length; i++) {
    console.log("Replacing " + i)
    const s = subjects[i];
    const addr = s.innerText 
    if(addr.startsWith("0x")) {
      const btn = document.createElement('button')
	  btn.innerText = "Tip"
	  btn.addEventListener('click', () => {tipKohl(addr)})
	  s.replaceWith(btn)
    }
  }
}

window.onload = (evt) => {
  setTimeout(() => {
    console.log("Transforming")
    addTipButtons()
    const posts = document.getElementsByClassName("divPosts")[0]
    const observer = new MutationObserver((mutationList, observer) => {
      console.log("mutation")
      addTipButtons()
    })
    observer.observe(posts, {childList: true, attributes: false})
  }, 2000)
}

