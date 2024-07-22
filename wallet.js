// Import the required libraries
const { AptosAccount } = require('aptos');
const fs = require('fs');

// Function to create a random Aptos wallet
function createRandomWallet() {
  // Generate a random Aptos account
  const account = new AptosAccount();

  // Extract the private key, address
  const privateKey = account.toPrivateKeyObject().privateKeyHex;
  const address = account.address().hex();

  // Print the wallet details
  console.log('Wallet Details:');
  console.log('Address:', address);
  console.log('Private Key:', privateKey);
  return { address, privateKey };
}

module.exports = createRandomWallet;