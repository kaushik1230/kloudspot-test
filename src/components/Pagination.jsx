import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 5; 

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
   
    <div className="flex w-full sm:w-auto justify-between sm:justify-center items-center sm:space-x-4 mt-8 px-4 sm:px-0 select-none">
      
     
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 hover:text-teal-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous Page"
      >
        <FiChevronLeft size={20} />
      </button>

      
      <span className="text-sm font-medium text-gray-600 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      
      <div className="hidden sm:flex items-center space-x-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-2 py-0.5 text-gray-400 text-xs"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`
                text-sm font-medium px-3 py-1 rounded-md transition-all
                ${currentPage === page 
                  ? 'text-teal-700 bg-teal-50 border border-teal-200 font-bold' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 hover:text-teal-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Next Page"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;