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
      
      const data = contract.methods.transfer(address, 1945).encodeABI()

      console.log("Tipping from: " + ethereum.selectedAddress)
      return ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          nonce: '0x00', // ignored by MetaMask
          to: KOHL_CONTRACT,
          from: ethereum.selectedAddress, // must match user's active address.
          value: '0x00',
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

console.log("KOHL: loaded page script")
window.addEventListener("message", (event) => {
  if (event.data.type && (event.data.type == "KOHL_TIP")) {
    tipKohl(event.data.address)
  }
}, false);
