import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

const BookList = ({ author, isPublishTransacted, onBuyBook, contract }) => {
  const [bookList, setBookList] = useState([]);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await readContract({
        contract: contract,
        method: "getAuthorBooks",
      });

      const cleanBookList = await Promise.all(
        books.map(async (book, index) => {
          const title = Buffer.from(book.title.slice(2), "hex").toString();
          const content = Buffer.from(book.content.slice(2), "hex").toString();
          const date = Buffer.from(
            book.published_date.slice(2),
            "hex"
          ).toString();
          const price = book.price;
          const bookId = index + 1;

          const hasPurchased = await readContract({
            contract: contract,
            method: "hasUserPurchasedBook",
            params: [activeAccount?.address, bookId],
          });

          return (
            <li key={bookId} className="book-card">
              <time dateTime={date} className="book-card__time">
                Published on {date}
              </time>
              <h2 className="book-card__title">{title}</h2>
              <div>
                <summary className="book-card__summary">Content</summary>
                <p className="book-card__price">Pricing: {price} ETH</p>
                <p className="book-card__content">{content}</p>
              </div>
              {!author && !hasPurchased && (
                <button
                  className="btn btn__buy"
                  onClick={() => onBuyBook(bookId, price)}
                >
                  Buy book <span className="arrow">&rarr;</span>
                </button>
              )}
              {!author && hasPurchased && (
                <p className="book-card__purchased">You own this book</p>
              )}
            </li>
          );
        })
      );

      setBookList(cleanBookList);
    };

    if (isPublishTransacted || activeAccount) {
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublishTransacted, author, activeAccount, contract]);

  return (
    <div className="books-container">
      <h1 className="books__title">Author's Published Titles</h1>
      <ul className="books">{bookList}</ul>
    </div>
  );
};

export default BookList;
