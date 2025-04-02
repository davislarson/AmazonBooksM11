import { Book } from '../types/Book';

interface FetchBooksResponse {
   books: Book[];
   totalNumberOfBooks: number;
}

const API_URL = 'https://localhost:5000';

export const fetchBooks = async (
   page: number,
   pageSize: number,
   selectedGenres: string[],
   orderBy: string
): Promise<FetchBooksResponse> => {
   try {
      const genreParams = selectedGenres.map((g) => `genres=${encodeURIComponent(g)}`).join('&');
      const response = await fetch(
        `${API_URL}/Bookstore/GetBooks?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}${genreParams.length ? `&${genreParams}` : ''}`,
        {
         credentials: 'include', // Include cookies for authentication if needed
        }
      );
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return data
      
   } catch (e) {
      console.error('Error fetching books: ', e);
      throw e;
   }
}

export const addBook = async (book: Book): Promise<Book> => {
   try {
      const response = await fetch(`${API_URL}/Bookstore/AddBook`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(book),
         credentials: 'include', // Include cookies for authentication if needed
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
   } catch (e) {
      console.error('Error adding book: ', e);
      throw e;
   }
}

export const deleteBook = async (bookId: number): Promise<void> => {
   try {
      const response = await fetch(`${API_URL}/delete/${bookId}`, {
         method: 'DELETE',
         credentials: 'include', // Include cookies for authentication if needed
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      return;
   } catch (e) {
      console.error('Error deleting book: ', e);
      throw e;
   }
}

export const updateBook = async (bookID: number, updatedBook: Book): Promise<Book> => {
   try {
      const response = await fetch(`${API_URL}/Bookstore/UpdateBook/update/${bookID}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(updatedBook),
         credentials: 'include', // Include cookies for authentication if needed
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
   } catch (e) {
      console.error('Error updating book: ', e);
      throw e;
   }
}