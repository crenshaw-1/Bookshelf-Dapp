import "./App.css";
import { useEffect, useState } from "react";
import { createThirdwebClient, getContract, readContract } from "thirdweb";
// We need this for our RPC. We have to tell our ThirdWeb SDK
// that our smart contracts are deployed to Hardhat testnet for our transactions
import { sepolia } from "thirdweb/chains";
// This is needed, the ConnectEmbed has an embeeded Wallet Modal
import { ConnectEmbed, ThirdwebProvider } from "thirdweb/react";
// Used to define our wallets. Feel free to experiment after
// this
import { createWallet } from "thirdweb/wallets";
// We need this for our ABI so that it can be used
// for our getContract function to export our smart contracts
// to our JS code
import contractData from "./contracts/BookShelf.json";

import PublishBook from "./ui/PublishBook";
import AdditionalInfo from "./ui/AdditionalInfo";

// This is needed to use ThirdWeb SDK
const client = createThirdwebClient({
  // We will use the value from our `.env.local`
  clientId: process.env.REACT_APP_CLIENT_ID,
});

console.log("Client", client);

// Install this wallets later for experimental purposes
// We will be using Metamask for the most part
const wallets = [
  createWallet("io.metamask"),
  createWallet("app.phantom"),
  createWallet("me.rainbow"),
];

// Our first smart contract on the network
const contract1 = getContract({
  client,
  chain: sepolia,
  address: "0x4d63C389DA7595326CF0fA4260D8AA9E33115311",
  abi: contractData.abi,
});

// Our second smart contract on the network
const contract2 = getContract({
  client,
  chain: sepolia,
  address: "0xfa15822adB3a204734B22862aEf42ba8359228Ea",
  abi: contractData.abi,
});

console.log(contract1.abi);

const AppBase = ({ author, contract }) => {
  return (
    <>
      <h1>BookShelf</h1>
      <AdditionalInfo contract={contract} author={author} />
    </>
  );
};

const App = () => {
  // We also want to know who the author
  // of the contracts are
  const [author, setAuthor] = useState(undefined);

  useEffect(() => {
    const handleAuthor = async () => {
      const author = await readContract({
        contract: contract1,
        method: "author",
      });
      setAuthor(author);
    };
    handleAuthor();
  }, []);

  // We need to pass the variables here for ConnectEmbed, otherwise, this will error.
  return (
    <div className="container">
      <ThirdwebProvider>
        <AppBase author={author} contract={contract1} />
        <ConnectEmbed
          client={client}
          chain={sepolia}
          wallets={wallets}
          modalSize={"wide"}
        />
        <PublishBook author={author} contract={contract1} />
      </ThirdwebProvider>
    </div>
  );
};

export default App;
