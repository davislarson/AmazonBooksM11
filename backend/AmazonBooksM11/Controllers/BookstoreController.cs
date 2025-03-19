using AmazonBooksM11.Data;
using Microsoft.AspNetCore.Mvc;

namespace AmazonBooksM11.Controllers;

[ApiController]
[Route("[controller]")]

public class BookstoreController : ControllerBase
{
    private BookstoreContext _bookstoreContext;
    
    public BookstoreController(BookstoreContext _temp) => _bookstoreContext = _temp;

    [HttpGet(Name = "GetBooks")]
    public IActionResult GetBooks(int page = 1, int pageSize = 5, string orderBy = "Asc")
    {
        IQueryable<Book> query = _bookstoreContext.Books;
        
        query = orderBy.Equals("Desc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var books = query
            .Skip(pageSize * (page - 1))
            .Take(pageSize)
            .ToList();
        
        var totalNumberOfBooks = _bookstoreContext.Books.Count();

        var returnObj = new
        {
            books,
            totalNumberOfBooks
        };
        return Ok(returnObj);
    }
    
}