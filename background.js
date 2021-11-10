console.log("Starting background")

if(localStorage.getItem("tipAmount") === null) {
  localStorage.setItem("tipAmount", 1337)
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.type)
    //only used for tip amount querying

    if(request.type == "KOHL_TIP_QUERY") {
      sendResponse({value: localStorage.getItem("tipAmount")})

      //sent only on start so we can show popup here
      chrome.pageAction.show(sender.tab.id)
      
    } else if(request.type == "KOHL_TIP_AMOUNT") {
      localStorage.setItem("tipAmount", request.value)

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach( (tab) => {
          chrome.tabs.sendMessage(tab.id, {type: "KOHL_TIP_AMOUNT", value: request.value})
        })  
      })
      
    }
  }
)
