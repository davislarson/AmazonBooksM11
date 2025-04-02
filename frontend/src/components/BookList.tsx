import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

export default function BookList(props: { selectedGenres: string[]; orderBy: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(page, pageSize, props.selectedGenres, props.orderBy);
        setBooks(data.books); // Assuming the API returns an array of books
        setTotalPages(Math.ceil(data.totalNumberOfBooks / pageSize)); // Calculate total pages based on the total number of books
      } catch (e) {
        setError((e as Error).message); // Handle the error
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    }
    loadBooks();
  }, [page, pageSize, props.orderBy, props.selectedGenres]);


  if (loading) {
    return <p>Loading books...</p>;
  }
  if (error) {
    // Display error message if there was an error fetching the books
    return <p className="text-red-500">Error: {error}</p>;
  }

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
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1); // Reset to first page on page size change
          }}
          />
      </div>
    </>
  );
}
