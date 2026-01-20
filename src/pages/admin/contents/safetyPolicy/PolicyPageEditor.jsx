// src/pages/admin/contents/safetyPolicy/PolicyPageEditor.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// [예시] 탭 데이터 (실제로는 props로 받거나 DB에서 조회)
// 도시안전기본계획의 경우: ['개요', '안전관리기구', '재난안전대책본부']
const DEFAULT_TABS = [
  { id: 0, label: '개요' },
  { id: 1, label: '상세내용' },
  { id: 2, label: '관련자료' },
];

/**
 * [공통] 단일 페이지 정책 관리 에디터
 * @param {string} pageTitle - 페이지 제목 (예: "도시안전기본계획 관리")
 * @param {string} policyType - 정책 구분 코드 (API 연동용, 예: "MASTER_PLAN", "EARTHQUAKE")
 * @param {Array} tabs - 탭 목록 (없으면 기본값 사용)
 */
const PolicyPageEditor = ({ pageTitle, policyType, tabs = DEFAULT_TABS }) => {
  
  // 1. 상태 관리
  const [activeTab, setActiveTab] = useState(0); // 현재 선택된 탭 ID
  const [loading, setLoading] = useState(false);
  
  // 폼 데이터 (탭별로 내용을 저장하거나, 현재 탭 내용만 관리)
  const [formData, setFormData] = useState({
    title: '',      // 탭별 소제목 (선택사항)
    body: '',       // 본문 (Quill 내용)
    lastUpdated: '' // 최종 수정일
  });

  // 2. 에디터 설정
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  // 3. 데이터 로드 (탭이 바뀌거나 정책 타입이 바뀔 때 실행)
  useEffect(() => {
    const loadTabContent = async () => {
      setLoading(true);
      try {
        // TODO: API 호출 예시
        // const res = await axios.get(`/api/policy/${policyType}?tab=${activeTab}`);
        // setFormData(res.data);
        
        console.log(`[API Load] ${pageTitle} - Tab ${activeTab} 데이터 로드`);
        
        // [더미 데이터 시뮬레이션]
        setFormData({
          title: tabs[activeTab].label,
          body: `<p>${tabs[activeTab].label}에 대한 내용을 입력하세요.</p>`,
          lastUpdated: '2026-01-16'
        });

      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };

    loadTabContent();
  }, [activeTab, policyType, pageTitle, tabs]);

  // 4. 저장 핸들러
  const handleSave = async () => {
    if (!window.confirm(`[${tabs[activeTab].label}] 탭의 내용을 저장하시겠습니까?`)) return;

    try {
      // TODO: API 저장 호출
      // await axios.post(`/api/policy/${policyType}`, { tab: activeTab, ...formData });
      console.log("저장 데이터:", { policyType, tab: activeTab, ...formData });
      alert("저장되었습니다.");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">{pageTitle}</h2>
            <p className="text-body-m text-graygray-50 mt-2">
              각 탭을 선택하여 내용을 수정할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button 
              onClick={handleSave} 
              className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md"
            >
              저장하기
            </button>
            <span className="text-xs text-gray-400">최종 수정: {formData.lastUpdated}</span>
          </div>
        </div>

        {/* 탭 네비게이션 (사용자 페이지 스타일 유지) */}
        <div className="flex border-b border-admin-border mb-8 bg-white px-4 rounded-t-xl">
          {tabs.map((tab, index) => (
            <button
              key={tab.id || index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-4 text-body-m-bold transition-all relative ${
                activeTab === index
                  ? 'text-admin-primary'
                  : 'text-graygray-50 hover:text-graygray-70'
              }`}
            >
              {tab.label}
              {/* 활성화 탭 하단 바 */}
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-admin-primary" />
              )}
            </button>
          ))}
        </div>

        {/* 에디터 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-b-xl rounded-tr-xl shadow-adminCard p-10">
          {loading ? (
            <div className="py-20 text-center text-gray-500">데이터를 불러오는 중...</div>
          ) : (
            <div className="space-y-6">
              
              {/* 탭별 소제목 (필요시 사용, 아니면 제거 가능) */}
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">탭 소제목</label>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  className="h-14 px-5 rounded-lg border border-admin-border bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
                />
              </div>

              {/* Quill 에디터 영역 */}
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">상세 내용</label>
                {/* pb-20 (Padding-Bottom)을 주어 하단 잘림을 방지하고 여유 공간 확보 */}
                <div className="bg-white rounded-lg pb-10"> 
                  <ReactQuill 
                    theme="snow" 
                    value={formData.body} 
                    onChange={(val) => setFormData(prev => ({...prev, body: val}))} 
                    modules={modules} 
                    // className="h-[500px]" 지우고 CSS로 제어하는 것을 추천합니다.
                    placeholder="내용을 입력해주세요."
                  />
                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default PolicyPageEditor;