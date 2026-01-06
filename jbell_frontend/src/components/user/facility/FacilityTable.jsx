// src/components/shared/FacilityTable.jsx
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // react-icons 활용

const FacilityTable = ({ data, onDetail }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-graygray-10 shadow-sm overflow-hidden">
      {/* 모바일 가로 스크롤 대응 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-secondary-5 border-b border-secondary-30 text-detail-s font-bold text-graygray-90">
              <th className="w-[15%] px-6 py-4 whitespace-nowrap">유형</th>
              <th className="w-[25%] px-6 py-4 cursor-pointer hover:bg-secondary-10 transition-colors group">
                <div className="flex items-center gap-1">
                  시설명
                  <span className="text-graygray-40 group-hover:text-secondary-50">
                    <FaSort /> 
                    {/* 정렬 상태에 따라 FaSortUp/Down 아이콘 변경 로직 추가 가능 */}
                  </span>
                </div>
              </th>
              <th className="w-[45%] px-6 py-4">주소</th>
              <th className="w-[15%] px-6 py-4 text-center">상세</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-graygray-10 hover:bg-graygray-0 transition-colors last:border-0"
                >
                  <td className="px-6 py-4 text-body-s text-graygray-70">{item.type}</td>
                  <td className="px-6 py-4 text-body-s-bold text-graygray-90">{item.name}</td>
                  <td className="px-6 py-4 text-body-s text-graygray-70">{item.address}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDetail(item.id)}
                      className="px-3 py-1.5 text-detail-s font-medium text-graygray-70 border border-graygray-30 rounded hover:bg-white hover:text-secondary-50 hover:border-secondary-50 transition-all"
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-body-m text-graygray-50">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityTable;