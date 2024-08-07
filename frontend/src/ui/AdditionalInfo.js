// This is to make sure you see which wallet

import { useActiveAccount } from "thirdweb/react";

// is currently active
const AdditionalInfo = ({ author, contract }) => {
  const activeAccount = useActiveAccount();

  return (
    <div className="additional-info">
      {activeAccount === undefined ? (
        <div className="additional-info__alert">
          Your wallet is not connected. Please connect.
        </div>
      ) : (
        <div className="additional-info__item">
          <h2 className="additional-info__title">Connected Wallet</h2>
          <p className="additional-info__value">{activeAccount.address}</p>
        </div>
      )}

      {author && (
        <div className="additional-info__item">
          <h2 className="additional-info__title">Author's Address</h2>
          <p className="additional-info__value">{author}</p>
        </div>
      )}

      <div className="additional-info__item">
        <h2 className="additional-info__title">Smart Contract Address</h2>
        <p className="additional-info__value">{contract.address}</p>
      </div>
    </div>
  );
};

export default AdditionalInfo;
