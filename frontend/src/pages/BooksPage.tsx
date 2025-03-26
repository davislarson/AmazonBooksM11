import { useState } from 'react';
import GenreFilter from '../components/GenreFilter';
import BookList from '../components/BookList';
import Header from '../components/Header';
import OrderByTitle from '../components/OrderByTitle';
import CartSummary from '../components/CartSummary';

export default function BooksPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>('Ascending');

  return (
    <>
      <Header />
      <div className="container mt-5 mb-5">        
        <div className="row">

          <div className="col-md-3">
            <OrderByTitle orderBy={orderBy} setOrderBy={setOrderBy} />
            <br />
            <br />
            <GenreFilter selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
          </div>
          <div className="col-md-8">
            <BookList selectedGenres={selectedGenres} orderBy={orderBy}/>
          </div>
          <div className='col-md-1'>
            <CartSummary />
          </div>
        </div>
      </div>
    </>
  );
}
