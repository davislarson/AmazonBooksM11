using Microsoft.EntityFrameworkCore;

namespace AmazonBooksM11.Data;

public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
        
    }
    
    public DbSet<Book> Books { get; set; }
}