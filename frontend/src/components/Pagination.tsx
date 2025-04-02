interface PaginationProps {
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (newSize: number) => void;
}

export default function Pagination({
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onPageSizeChange,
}: PaginationProps) {
   return (
      <>
         <div className="text-center mt-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
               Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
               <button
               key={index + 1}
               onClick={() => onPageChange(index + 1)}
               className={currentPage === index + 1 ? 'active' : ''}
               disabled={currentPage === index + 1}
               >
               {index + 1}
               </button>
            ))}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
               Next
            </button>
            <br />
            <br />
            <label>Results Per Page:</label>
            <select
               value={pageSize}
               onChange={(e) => {
               onPageSizeChange(Number(e.target.value));
               onPageChange(1); // Reset to first page on page size change
               }}
            >
               <option value="5">5</option>
               <option value="10">10</option>
               <option value="20">20</option>
            </select>
         </div>
      </>
   )
}