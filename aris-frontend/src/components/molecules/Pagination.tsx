import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  loading?: boolean;
  itemName?: string;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  loading = false,
  itemName = "items",
  onPageChange,
}) => {
  if (lastPage <= 1) return null;

  const pages = Array.from(
    {
      length: Math.min(3, lastPage),
    },
    (_, i) => Math.max(1, currentPage - 1) + i
  ).filter((page) => page <= lastPage);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-gray-500">
        Showing page{" "}
        <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{lastPage}</span>
        <span className="ml-2">
          ({total} {itemName})
        </span>
      </p>

      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {/* First Page */}
        {currentPage > 2 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              1
            </button>

            {currentPage > 3 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Current Pages */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`h-10 w-10 rounded-lg transition ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page */}
        {currentPage < lastPage - 1 && (
          <>
            {currentPage < lastPage - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            <button
              onClick={() => onPageChange(lastPage)}
              className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              {lastPage}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage || loading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;