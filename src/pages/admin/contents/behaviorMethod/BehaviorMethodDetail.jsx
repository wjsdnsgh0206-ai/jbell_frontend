import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { BehaviorMethodData } from "@/pages/admin/contents/behaviorMethod/BehaviorMethodData";

const BehaviorMethodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 1. 상태 관리: DB 컬럼명(CamelCase)으로 리팩토링
  const [formData, setFormData] = useState({
    contentId: '',
    contentType: '',
    title: '',
    body: '',
    visibleYn: 'Y',
    contentLink: '',
    createdAt: ''
  });

  // 원본 데이터 저장용 (수정 취소 시 복구용)
  const [originData, setOriginData] = useState(null);

  // 에디터 설정 (수정 모드일 때만 툴바가 보이도록 처리하기 위해 modules 분리)
  const modules = useMemo(() => ({
    toolbar: isEdit ? [ // ★ isEdit 상태에 따라 툴바 구성 제어
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ] : false, // 수정 모드가 아니면 툴바를 비움
  }), [isEdit]);

  // 3. 데이터 로드 및 브레드크럼 설정
  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        // contentId 기준으로 데이터 찾기 (parseInt 주의)
        const found = BehaviorMethodData.find(item => item.contentId === parseInt(id));

        if (found) {
          setFormData(found);
          setOriginData(found);
          setBreadcrumbTitle(found.title);
        } else {
          alert("해당 데이터를 찾을 수 없습니다.");
          navigate("/admin/contents/behaviorMethodList");
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetailData();
    return () => setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle, navigate]);

  // 4. 이벤트 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    if (!isEdit) return; // 수정 모드일 때만 동작
    setFormData(prev => ({
      ...prev,
      visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y'
    }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    try {
      // Spring Boot 연동 시: await axios.put(`/api/admin/behaviorMethod-guide/${id}`, formData);
      console.log("저장될 수정 데이터:", formData);
      setOriginData(formData); // 원본 데이터 갱신
      alert("성공적으로 저장되었습니다.");
      setIsEdit(false);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-10 text-center text-admin-text-secondary">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">
              행동요령 {isEdit ? '수정' : '상세 정보'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">목록으로</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">저장하기</button>
              </div>
            )}
          </div>
        </div>

        {/* 메인 폼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1열: 유형 & 제목 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-3 md:col-span-1">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형 코드</label>
                <input 
                  name="contentType"
                  value={formData.contentType || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">행동요령 제목</label>
                <input 
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                />
              </div>
            </div>

            {/* 2. 본문 내용 (Quill 에디터) */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">본문 내용</label>
              <div className={`rounded-lg transition-all ${
                isEdit ? 'bg-white' : 'view-mode-container shadow-inner'
              }`}> 
                <ReactQuill 
                  theme={isEdit ? "snow" : null} 
                  value={formData.body || ''} 
                  onChange={handleEditorChange} 
                  modules={modules} 
                  readOnly={!isEdit}
                />
              </div>
            </div>

            {/* 3열: 링크 입력 (필요시 추가)
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">출처 링크 (URL)</label>
              <input 
                name="contentLink"
                value={formData.contentLink || ''}
                onChange={handleChange}
                disabled={!isEdit}
                placeholder="https://..."
                className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                  ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
              />
            </div>
            */}

            {/* 4열: 노출 여부 토글 */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">현재 노출 상태</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
                  } ${isEdit ? 'cursor-pointer hover:shadow-inner' : 'cursor-not-allowed opacity-60'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
                <div className="flex flex-col">
                  <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
                    {formData.visibleYn === 'Y' ? "활성화 (Y)" : "비활성화 (N)"}
                  </span>
                  <p className="text-[12px] text-gray-400">
                    {formData.visibleYn === 'Y' ? '* 현재 사용자 화면에 노출 중입니다.' : '* 현재 사용자 화면에서 숨김 처리되었습니다.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BehaviorMethodDetail;