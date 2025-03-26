using AmazonBooksM11.Data;
using Microsoft.AspNetCore.Mvc;

namespace AmazonBooksM11.Controllers;

[ApiController]
[Route("[controller]/[action]")]

public class BookstoreController : ControllerBase
{
    private BookstoreContext _bookstoreContext;
    
    public BookstoreController(BookstoreContext _temp) => _bookstoreContext = _temp;

    [HttpGet(Name = "GetBooks")]
    public IActionResult GetBooks(int page = 1, int pageSize = 5, string orderBy = "Asc", [FromQuery] List<string>? genres = null)
    {
        IQueryable<Book> query = _bookstoreContext.Books.AsQueryable();

        if (genres != null && genres.Any())
        {
            query = query.Where(b => genres.Contains(b.Category));
        }
        
        // Order the query based on if they sent in ascending or descending
        query = orderBy.Equals("Desc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

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
    
}