import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { fetchBooks, deleteBook } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';


function AdminBooksPage() {
   const [books, setBooks] = useState<Book[]>([]);
   const [pageSize, setPageSize] = useState<number>(10);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [totalPages, setTotalPages] = useState<number>(0);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [showForm, setShowForm] = useState(false);
   const [editingBook, setEditingBook] = useState<Book | null>(null);

   useEffect(() => {
      const loadBooks = async () => {
         try {
            setLoading(true);
            const data = await fetchBooks(pageNumber, pageSize, [], 'Asc'); 
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumberOfBooks / pageSize));
         } catch (e) {
            setError((e as Error).message);
         } finally {
            setLoading(false);
         }
      };
      loadBooks();
   }, [pageSize, pageNumber]);

   async function handleDelete(bookID: number) {
      const confirmation = window.confirm('Are you sure you want to delete this book?');
      if (!confirmation) return;
      
      try{
         await deleteBook(bookID);
         setBooks(books.filter((p) => p.bookID !== bookID));
      }
      catch (e)
      {
         alert('Failed to delete book. Please try again.');
      }
   }

   if (loading) return <p>Loading Books...</p>;
   if (error) return <p className="text-red-500"> Error: {error}</p>;

   return (
      <>
         <h1>Admin - Books</h1>

         {showForm ? (
            <NewBookForm
               onSuccess={() => {
                  setShowForm(false);
                  fetchBooks(pageNumber, pageSize, [], 'Asc').then((data) => setBooks(data.books));
               }}
               onCancel={() => setShowForm(false)}
            />
         ) : (
            <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
               Add Book
            </button>
         )}

         {editingBook ? (
            <EditBookForm
               book={editingBook}
               onSuccess={() => {
                  setEditingBook(null);
                  fetchBooks(pageNumber, pageSize, [], 'Asc').then((data) => setBooks(data.books));
               }}
               onCancel={() => setEditingBook(null)}
            />
         ) : null}

         <table className="table table-striped table-bordered">
            <thead>
               <tr className="table-dark">
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Classification</th>
                  <th>Category</th>
                  <th>Page Count</th>
                  <th>Price</th>
               </tr>
            </thead>
            <tbody>
               {books.map((b) => (
                  <tr key={b.bookID}>
                     <td>{b.bookID}</td>
                     <td>{b.title}</td>
                     <td>{b.author}</td>
                     <td>{b.publisher}</td>
                     <td>{b.isbn}</td>
                     <td>{b.classification}</td>
                     <td>{b.category}</td>
                     <td>{b.pageCount}</td>
                     <td >{b.price}</td>
                     <td>
                        <button
                           onClick={() => setEditingBook(b)}
                           className="btn btn-primary w-100 mb-2"
                        >
                           Edit
                        </button>
                        <button
                           onClick={() => handleDelete(b.bookID)}
                           className="btn btn-danger w-100"
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageNumber}
            onPageSizeChange={(newSize) => {
               setPageSize(newSize);
               setPageNumber(1);
            }}
         />
      </>
   );
}

export default AdminBooksPage;
