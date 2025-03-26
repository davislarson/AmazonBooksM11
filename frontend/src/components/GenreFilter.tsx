import { useState, useEffect } from 'react';
import '../css/CategoryFilter.css';

export default function GenreFilter(props: {
  selectedGenres: string[];
  setSelectedGenres: (selectedGenres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://localhost:5000/Bookstore/GetGenres');
        const data = await response.json();
        setGenres(data);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchGenres();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedGenres = props.selectedGenres.includes(target.value)
      ? props.selectedGenres.filter((genre) => genre !== target.value)
      : [...props.selectedGenres, target.value];
    props.setSelectedGenres(updatedGenres);
  }

  return (
    <div className="category-filter">
      <h5>Book Genres</h5>
      {/* // NOTE: THIS IS ONE OF THE NEW BOOTSTRAP ITEMS I USED; IT IS A WAY TO FORMAT A FORM AND STYLES */}
      <div className='form-control border-2 border-grey'>
        {genres.map((genre) => (
          <div key={genre} className="category-item">
            <input type="checkbox" id={genre} name={genre} value={genre} onChange={handleCheckboxChange} />
            <label htmlFor={genre}>{genre}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
