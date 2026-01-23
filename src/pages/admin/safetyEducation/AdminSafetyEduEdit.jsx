import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { safetyEduData } from '@/pages/user/openboards/BoardData'; 
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminSafetyEduEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ★ [추가] 고유 ID 생성 함수 (사용자 페이지 key값 대응)
  const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({ mgmtId: false, title: false, summary: false });

  // 1. 데이터 로드 및 초기화
  useEffect(() => {
    const detailData = safetyEduData.find(item => item.id.toString() === id.toString());
    if (detailData) {
      // ★ 이 부분을 아래 로직으로 교체합니다.
      
      // 기존 데이터에 id가 없는 경우를 대비해 고유 ID를 생성하여 넣어줌 (데이터 정합성 유지)
      const sanitizedSections = (detailData.sections || []).map(sec => ({
        ...sec,
        id: sec.id || generateId('sec'),
        items: (sec.items || []).map(item => ({
          ...item,
          id: item.id || generateId('item')
        }))
      }));

      setFormData({ 
        ...detailData,
        sections: sanitizedSections, // 정제된 섹션 데이터 적용
        links: detailData.links || [],
        orderNo: detailData.orderNo || '1'
      });
      
      setBreadcrumbTitle(`${detailData.title} 수정`);
    } else {
      alert("해당 데이터를 찾을 수 없습니다.");
      navigate('/admin/contents/safetyEduList');
    }
  }, [id, navigate, setBreadcrumbTitle]); // 의존성 배열은 그대로 유지

  useEffect(() => {
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // 2. 핸들러 함수들
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);

    if (name === 'orderNo') {
      // 숫자만 입력 가능하게 하며 최소값 1 보장
      const val = value === '' ? '' : Math.max(1, parseInt(value) || 1).toString();
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  // 섹션 관리
  const addSection = () => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections, 
        { 
          id: generateId('sec'), // ★ 추가: 섹션 고유 ID
          subTitle: '', 
          items: [{ id: generateId('item'), type: 'text', text: '' }] // ★ 추가: 첫 아이템 ID
        }
      ]
    }));
  };

  const removeSection = (sIdx) => {
    setIsDirty(true);
    setFormData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== sIdx) }));
  };

  const updateSectionTitle = (sIdx, value) => {
    setIsDirty(true);
    const newSections = [...formData.sections];
    newSections[sIdx] = { ...newSections[sIdx], subTitle: value };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  // 아이템 관리 (불변성 유지 수정)
  const addItem = (sIdx) => {
    setIsDirty(true);
    const newSections = [...formData.sections];
    newSections[sIdx] = {
      ...newSections[sIdx],
      items: [
        ...newSections[sIdx].items, 
        { id: generateId('item'), type: 'text', text: '' } // ★ 추가: 아이템 고유 ID
      ]
    };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const updateItem = (sIdx, iIdx, field, value) => {
    setIsDirty(true);
    const newSections = [...formData.sections];
    const newItems = [...newSections[sIdx].items];
    newItems[iIdx] = { ...newItems[iIdx], [field]: value };
    newSections[sIdx] = { ...newSections[sIdx], items: newItems };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const removeItem = (sIdx, iIdx) => {
    setIsDirty(true);
    const newSections = [...formData.sections];
    newSections[sIdx] = {
      ...newSections[sIdx],
      items: newSections[sIdx].items.filter((_, i) => i !== iIdx)
    };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  // 3. 저장 및 취소 로직
  const handleSave = () => {
    if (!formData.mgmtId.trim() || !formData.title.trim() || !formData.summary.trim()) {
      setErrors({ 
        mgmtId: !formData.mgmtId.trim(), 
        title: !formData.title.trim(), 
        summary: !formData.summary.trim() 
      });
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    const index = safetyEduData.findIndex(item => item.id.toString() === id.toString());
    if (index !== -1) {
      // 한국 시간 기준 포맷팅
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      safetyEduData[index] = { 
        ...formData, 
        orderNo: formData.orderNo || '1',
        updatedAt: formattedDate 
      };
      
      setIsModalOpen(false);
      setToastMessage("수정사항이 성공적으로 반영되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate(`/admin/contents/safetyEduList`), 1500);
    }
  };

  // 취소 핸들러 (누락되었던 부분 추가)
  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  if (!formData) return null;

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon />
            <span className="font-bold">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mb-10 tracking-tight text-[#111]">시민안전교육 수정</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] border-b-2 border-gray-100 pb-3">교육 정보 수정</h3>
          
          <div className="flex flex-col space-y-12">
            {/* 관리번호 */}
            <div className="flex flex-col">
              <label className="font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID)</label>
              <input name="mgmtId" value={formData.mgmtId} readOnly className="w-full max-w-[500px] bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-gray-400 outline-none cursor-not-allowed" />
              <p className="text-[13px] text-gray-400 mt-2">* 관리번호는 수정할 수 없습니다.</p>
            </div>

            {/* 제목 */}
            <div className="flex flex-col">
              <label className="font-bold text-[16px] mb-3 text-[#111]">시설명 / 교육명 (필수)</label>
              <input name="title" value={formData.title} onChange={handleChange} className={`w-full border rounded-lg px-5 py-4 outline-none ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`} />
            </div>

            {/* 출처 정보 */}
            <div className="p-8 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#2563EB]">출처 기관</label>
                <input name="source" value={formData.source} onChange={handleChange} className="w-full bg-white border border-blue-200 rounded-lg px-5 py-3.5 outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#2563EB]">출처 URL</label>
                <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full bg-white border border-blue-200 rounded-lg px-5 py-3.5 outline-none focus:border-[#2563EB]" />
              </div>
            </div>

            {/* 요약 */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">내용 요약 (필수)</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" className={`w-full border rounded-lg px-5 py-4 outline-none resize-none ${errors.summary ? 'border-red-500' : 'border-gray-300 focus:border-[#2563EB]'}`} />
              </div>
            </div>

            {/* 세부 내용 (Sections) */}
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <label className="font-bold text-[18px] text-[#2563EB]">교육 세부 내용 (Sections)</label>
                <button onClick={addSection} className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                  <Plus size={18} /> 섹션 추가
                </button>
              </div>

              {formData.sections.map((section, sIdx) => (
                <div key={sIdx} className="p-8 border border-gray-200 rounded-xl bg-[#F9FAFB] relative shadow-sm flex flex-col gap-6">
                  <button onClick={() => removeSection(sIdx)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-gray-500 mb-2">섹션 소제목</label>
                    <input 
                      value={section.subTitle} 
                      onChange={(e) => updateSectionTitle(sIdx, e.target.value)} 
                      className="w-full bg-white border border-gray-300 rounded-lg px-5 py-3.5 font-bold text-[#2563EB] outline-none focus:border-[#2563EB]" 
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex flex-col gap-3 bg-white p-5 rounded-lg border border-gray-200 relative group">
                        <select value={item.type} onChange={(e) => updateItem(sIdx, iIdx, 'type', e.target.value)} className="w-fit border border-gray-300 rounded-md px-3 py-2 text-[13px] font-bold bg-gray-50 outline-none">
                          <option value="text">일반 (text)</option>
                          <option value="bold">강조 (bold)</option>
                          <option value="indent">들여쓰기 (indent)</option>
                          <option value="gray">안내문 (gray)</option>
                        </select>
                        <textarea value={item.text} onChange={(e) => updateItem(sIdx, iIdx, 'text', e.target.value)} className="w-full border-b border-gray-100 py-2 outline-none resize-none text-[15px]" rows="1" />
                        <button onClick={() => removeItem(sIdx, iIdx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={() => addItem(sIdx)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold hover:bg-gray-100">+ 항목 추가</button>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 제어 영역 (순서, 노출여부, 일시) */}
            <div className="space-y-10 pt-10 border-t border-gray-100">
              <div className="flex flex-col w-full max-w-[100px]">
                <label className="font-bold text-[16px] mb-3 text-[#111]">순서</label>
                <input 
                  type="number" 
                  name="orderNo" 
                  value={formData.orderNo} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-5 py-4 text-[#2563EB] font-bold text-[18px] outline-none focus:border-[#2563EB]"
                />
                <p className="text-[13px] text-gray-400 mt-2 font-medium">* 낮은 숫자일수록 상단 노출</p>
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">노출 여부</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({...prev, isPublic: !prev.isPublic}));
                      setIsDirty(true);
                    }}
                    className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-[15px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                    {formData.isPublic ? '노출' : '비노출'}
                  </span>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-50 flex flex-col space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                  <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                    <Calendar size={16} /> {formData.createdAt}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-bold text-gray-400">최종 수정 일시</label>
                  <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                    <Calendar size={16} /> {formData.updatedAt || '-'}
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="수정사항을 저장하시겠습니까?" message="수정된 내용은 즉시 도민 안전교육 페이지에 반영됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={() => navigate(-1)} title="수정을 취소하시겠습니까?" message="수정 중인 내용은 저장되지 않습니다." type="delete" />
    </div>
  );
};

export default AdminSafetyEduEdit;