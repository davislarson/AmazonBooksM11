import { useEffect, useState } from 'react';
import { Book } from './types/Book';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>('Ascending');

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(`https://localhost:5000/Bookstore?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalNumberOfBooks / pageSize));
    };
    fetchBooks();
  }, [page, pageSize, orderBy]);

  return (
    <>
      <div className="container mt-5 mb-5 text-center w-50">
        <h1>Book List</h1>

        {/* This sets up the ability to order ascending or descending */}
        <label>Order by title:</label>
        <select
          value={orderBy}
          onChange={(e) => {
            setOrderBy(e.target.value);
          }}
        >
          <option value="Asc">Ascending</option>
          <option value="Desc">Descending</option>
        </select>
        <br />
        <br />
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
            </div>
          </div>
        ))}
      </div>
      {/* This is the pagination section */}
      <div>
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
      </div>
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
    </>
  );
}
