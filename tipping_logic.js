function tipKohl(address) {
  if(typeof window.ethereum === 'undefined') {
    console.log("No wallet!")
    return
  }

  console.log("Tipping " +  address)
  ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts) => {
      const account = accounts[0]
      const web3 = new Web3(window.ethereum)
      const contract = new web3.eth.Contract(KOHL_CONTRACT_ABI)
      
      const data = contract.methods.transferFrom(ethereum.selectedAddress, address, 1945).encodeABI()

      return ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          nonce: '0x00', // ignored by MetaMask
          to: KOHL_CONTRACT,
          from: ethereum.selectedAddress, // must match user's active address.
          value: '0x00', // Only required to send ether to the recipient from the initiating external account.
          data: data
        }],
      })
    })
    .then((txHash) => {
      console.log("Success: " + txHash)
    })
    .catch((err) => {
      console.log(err)
    })
}



function tipKohlTest(address) {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(KOHL_CONTRACT_ABI)
  const data = contract.methods.transferFrom(address, address, 1945).encodeABI()
  console.log(address)
}

console.log("Loaded page script")
window.addEventListener("message", (event) => {
  if (event.data.type && (event.data.type == "KOHL_TIP")) {
    console.log("Page received: " + event.data.address);
    tipKohlTest(event.data.address)
  }
}, false);
