import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

export default function BookList(props: { selectedGenres: string[]; orderBy: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      const genreParams = props.selectedGenres.map((g) => `genres=${encodeURIComponent(g)}`).join('&');
      const response = await fetch(
        `https://localhost:5000/Bookstore/GetBooks?page=${page}&pageSize=${pageSize}&orderBy=${props.orderBy}${genreParams.length ? `&${genreParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalNumberOfBooks / pageSize));
    };
    fetchBooks();
  }, [page, pageSize, props.orderBy, props.selectedGenres]);

  const handleAddToCart = async (book: Book) => {
    const cartItem: CartItem = {
      bookID: book.bookID,
      title: book.title,
      author: book.author,
      quantity: 1,
      cost: book.price,
    };
    addToCart(cartItem);
    navigate('/cart');
  };

  return (
    <>
      <div>
        {/* All of the books will be mapped over here */}
        {books.map((book) => (
          <div className="card" key={book.bookID} style={{ backgroundColor: '#f8f9fa' }}>
            <h3 className="card-title text-center mt-3">{book.title}</h3>
            <div className="card-body text-center">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Author</th>
                    <td>{book.author}</td>
                  </tr>
                  <tr>
                    <th scope="row">Publisher</th>
                    <td>{book.publisher}</td>
                  </tr>
                  <tr>
                    <th scope="row">ISBN</th>
                    <td>{book.isbn}</td>
                  </tr>
                  <tr>
                    <th scope="row">Classification</th>
                    <td>{book.classification}</td>
                  </tr>
                  <tr>
                    <th scope="row">Category</th>
                    <td>{book.category}</td>
                  </tr>
                  <tr>
                    <th scope="row">Page Count</th>
                    <td>{book.pageCount}</td>
                  </tr>
                  <tr>
                    <th scope="row">Price</th>
                    <td>${book.price}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={() => handleAddToCart(book)}>Add to Cart</button>
            </div>
          </div>
        ))}
        {/* This is the pagination section */}
        <div className="text-center mt-4">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={page === index + 1 ? 'active' : ''}
              disabled={page === index + 1}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
            Next
          </button>
          <br />
          <br />
          <label>Results Per Page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // Reset to first page on page size change
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </>
  );
}
