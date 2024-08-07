import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction, useActiveAccount } from "thirdweb/react";

import BookList from "./BookList";
import Status from "../components/Status";
import Submit from "../components/Submit";

const PublishBook = ({ author, contract }) => {
  const { mutate: sendAndConfirmTx, data: transactReceipt } =
    useSendAndConfirmTransaction();
  const [formData, setFormData] = useState({
    title_: "",
    content_: "",
    authorname_: "",
    date_: "",
    purchase_counter_: 10,
    price_: 0,
    bookstatus_: 0,
  });

  const activeAccount = useActiveAccount();
  const isAuthor = activeAccount?.address === author;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let status = formData.bookstatus_ !== "NotAvailable" ? 1 : 0;
    const transaction = prepareContractCall({
      contract: contract,
      method: "publishBook",
      params: [
        formData.title_,
        formData.content_,
        formData.authorname_,
        formData.date_.toString(),
        Number.parseInt(formData.purchase_counter_),
        Number.parseInt(formData.price_),
        status,
      ],
    });
    sendAndConfirmTx(transaction);
    setFormData({
      title_: "",
      content_: "",
      authorname_: "",
      date_: "",
      purchase_counter_: 10,
      price_: 0,
      bookstatus_: 0,
    });
  };

  const handleBuyBook = async (bookId, price) => {
    const transaction = prepareContractCall({
      contract: contract,
      method: "buyBook",
      params: [bookId],
      value: price,
    });
    sendAndConfirmTx(transaction);
  };

  if (!isAuthor) {
    return (
      <>
        <h1>Welcome to my humble abode!</h1>
        <BookList
          author={isAuthor}
          contract={contract}
          isPublishTransacted={true}
          onBuyBook={handleBuyBook}
        />
      </>
    );
  }

  return (
    <div className="App">
      <BookList
        author={isAuthor}
        contract={contract}
        isPublishTransacted={transactReceipt?.status === "success"}
        onBuyBook={handleBuyBook}
      />
      <h1>Publishing a new book? Go here!</h1>
      <h2>🥴 Requires author-ization. No pun intended 🤣</h2>
      <h2>
        Last Transaction Status: <Status status={transactReceipt} />
      </h2>
      {transactReceipt ? <h3>From: {transactReceipt.from}</h3> : ""}
      {transactReceipt ? <h3>To: {transactReceipt.to}</h3> : ""}
      {transactReceipt ? (
        <h3>Transaction Hash: {transactReceipt.transactionHash}</h3>
      ) : (
        ""
      )}
      {transactReceipt ? <h3>Block Hash: {transactReceipt.blockHash}</h3> : ""}
      <form
        className="form-container"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label className="form-group">
          Title:
          <input
            type="text"
            value={formData.title_}
            onChange={(e) =>
              setFormData({ ...formData, title_: e.target.value })
            }
            required
          />
        </label>
        <label className="form-group">
          Author name:
          <input
            type="text"
            value={formData.authorname_}
            onChange={(e) =>
              setFormData({ ...formData, authorname_: e.target.value })
            }
            required
          />
        </label>
        <label className="form-group">
          Date published:
          <input
            type="date"
            value={formData.date_}
            onChange={(e) =>
              setFormData({ ...formData, date_: e.target.value })
            }
            required
          />
        </label>
        <label className="form-group">
          Price in USD:
          <input
            type="number"
            value={formData.price_}
            onChange={(e) =>
              setFormData({ ...formData, price_: e.target.value })
            }
            required
          />
        </label>
        <label className="form-group">
          Number of copies:
          <input
            type="number"
            value={formData.purchase_counter_}
            onChange={(e) =>
              setFormData({ ...formData, purchase_counter_: e.target.value })
            }
            required
          />
        </label>
        {/* biome-ignore lint/nursery/noLabelWithoutControl: <explanation> */}
        <div className="form-group">
          <label>Set Availability</label>
          <select
            value={formData.bookstatus_}
            onChange={(e) =>
              setFormData({ ...formData, bookstatus_: e.target.value })
            }
            required
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
        {/* biome-ignore lint/nursery/noLabelWithoutControl: <explanation> */}

        <label className="form-group">
          Content
          <textarea
            value={formData.content_}
            onChange={(e) =>
              setFormData({ ...formData, content_: e.target.value })
            }
            rows={10}
            required
          />
        </label>

        <Submit isPending={transactReceipt} />
      </form>
    </div>
  );
};

export default PublishBook;
