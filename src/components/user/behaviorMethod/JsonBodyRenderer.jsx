// src/pages/admin/behaviorMethod/components/JsonBodyRenderer.jsx
import React, { useMemo } from 'react';

/**
 * JSON 형태의 body 데이터를 파싱하여 표/리스트로 렌더링
 */
const JsonBodyRenderer = ({ jsonString }) => {
  const data = useMemo(() => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  }, [jsonString]);

  if (!data) return <div className="text-gray-500">JSON 파싱 오류 또는 데이터 없음</div>;

  return (
    <div className="space-y-6 text-sm text-gray-800 border rounded-lg p-6 bg-gray-50">
      {/* 1. 요약 정보 */}
      {data.summary && (
        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <h4 className="font-bold text-lg mb-2 text-admin-primary">📢 요약</h4>
          <p>{data.summary}</p>
        </div>
      )}

      {/* 2. 섹션별 정보 (표 형태) */}
      {data.sections && data.sections.map((section) => (
        <div key={section.id} className="border border-gray-300 rounded overflow-hidden">
          {section.subTitle && (
            <div className="bg-gray-100 px-4 py-2 font-bold border-b border-gray-300">
              {section.subTitle}
            </div>
          )}
          <table className="w-full bg-white">
            <tbody>
              {section.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 border-gray-100">
                  <td className={`px-4 py-3 ${item.type === 'bold' ? 'font-bold bg-blue-50' : ''}`}>
                    {item.type === 'indent' && <span className="ml-4 text-gray-400">↳ </span>}
                    {item.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* 3. 연락처 및 링크 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.contact && (
            <div className="p-3 bg-white border rounded">
                <span className="font-bold block text-gray-500 text-xs mb-1">문의처</span>
                {data.contact}
            </div>
        )}
        {data.links && data.links.length > 0 && (
            <div className="p-3 bg-white border rounded">
                <span className="font-bold block text-gray-500 text-xs mb-1">관련 링크</span>
                <ul className="list-disc list-inside text-blue-600">
                    {data.links.map(link => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default JsonBodyRenderer;