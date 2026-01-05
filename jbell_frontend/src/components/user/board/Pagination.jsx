import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Pagenation = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const paginationNumbers = [1,2,3,4,5,6,7,8,9];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        className="text-gray-400 text-[14px] px-2"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"} 이전
      </button>

      {paginationNumbers.map((num) => (
        <button
          key={num}
          className={`w-8 h-8 flex items-center justify-center rounded
            ${currentPage === num ? "bg-[#003366] text-white" : "text-gray-600"}`}
          onClick={() => handlePageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="text-gray-600 text-[14px] px-2"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        다음 {">"}
      </button>
    </div>
  );
};

export default Pagenation;
