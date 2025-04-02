using AmazonBooksM11.Data;
using Microsoft.AspNetCore.Mvc;

namespace AmazonBooksM11.Controllers;

[ApiController]
[Route("[controller]/[action]")]

public class BookstoreController : ControllerBase
{
    private BookstoreContext _bookstoreContext;
    
    public BookstoreController(BookstoreContext _temp) => _bookstoreContext = _temp;

    [HttpGet(Name="GetBooks")]
    public IActionResult GetBooks(int page = 1, int pageSize = 5, string orderBy = "Asc", [FromQuery] List<string>? genres = null)
    {
        IQueryable<Book> query = _bookstoreContext.Books.AsQueryable();

        if (genres != null && genres.Any())
        {
            query = query.Where(b => genres.Contains(b.Category));
        }
        
        // Order the query based on if they sent in ascending or descending
        query = orderBy.Equals("Desc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(b => b.Title.ToUpper())
            : query.OrderBy(b => b.Title.ToUpper());

        var books = query
            .Skip(pageSize * (page - 1))
            .Take(pageSize)
            .ToList();
        
        var totalNumberOfBooks = query.Count();

        var returnObj = new
        {
            books,
            totalNumberOfBooks
        };
        return Ok(returnObj);
    }

    [HttpGet(Name = "GetGenres")]
    public IActionResult GetGenres()
    {
        var genres = _bookstoreContext.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();

        return Ok(genres);
    }

    [HttpPost(Name = "AddBook")]
    public IActionResult AddBook([FromBody]Book newBook)
    {
        _bookstoreContext.Books.Add(newBook);
        _bookstoreContext.SaveChanges();
        return Ok(newBook);
    }

    [HttpPut("update/{bookId}", Name = "UpdateBook")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _bookstoreContext.Books.Find(bookId);

        if (existingBook == null)
        {
            return NotFound(new { message = "Book not found." });
        }
        
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;
        
        _bookstoreContext.Books.Update(existingBook);
        _bookstoreContext.SaveChanges();
        
        return Ok(existingBook);
    }

    [HttpDelete("/delete/{bookId}", Name = "DeleteBook")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _bookstoreContext.Books.Find(bookId);

        if (book == null)
        {
            return NotFound(new { message = "Book not found." });
        }
        
        _bookstoreContext.Books.Remove(book);
        _bookstoreContext.SaveChanges();
        
        return NoContent();
    }
    
}