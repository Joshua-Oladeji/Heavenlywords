import BN from 'bn.js';
import { getCost, getOwner } from './view-fn.js';
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require('../contract-abi.json');
const contractAddress = "0xB3E1018e8f15b5c75e46Eb70432ad7C5Ba70a5D1";




export const mint = async (imageDesc) => {
  const heavenlywords = new web3.eth.Contract(contractABI, contractAddress);

  // -> contract info
  const owner = (await getOwner()).result;
  const cost = (await getCost()).result;
  const weiValue = await new BN(cost, 10).toString('hex');

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': heavenlywords.methods.mint(window.ethereum.selectedAddress, imageDesc).encodeABI(),
    value: ((window.ethereum.selectedAddress).toLowerCase() === owner) ? 0 : weiValue
  };

  // -> sign the transaction via Metamask
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash,
      hash: txHash
    };
  }
  catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    };
  }
};