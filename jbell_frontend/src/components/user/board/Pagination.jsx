
import { useState } from "react";

const Pagenation = () => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <>
            <button className="text-gray-400 text-[14px] px-2">{"<"} 이전</button>
            {paginationNumbers.map((num) => (
                <button
                    key={num}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === num ? "bg-[#003366] text-white" : "text-gray-600"}`}
                    onClick={() => setCurrentPage(num)}
                >
                    {num}
                </button>
            ))}
            <button className="text-gray-600 text-[14px] px-2">다음 {">"}</button>
        </>
    )
}

export default Pagenation;