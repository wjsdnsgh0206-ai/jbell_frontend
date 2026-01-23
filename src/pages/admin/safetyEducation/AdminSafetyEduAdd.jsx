import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { safetyEduData } from '@/pages/user/openboards/BoardData'; 
import { Plus, Trash2, Phone, Link as LinkIcon, AlertCircle } from 'lucide-react';

const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminSafetyEduAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ★ [추가] 고유 ID 생성 함수
  const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // ★ [수정] 초기 상태에 ID 부여
  const [formData, setFormData] = useState({
    mgmtId: '', 
    regType: '직접등록',
    orderNo: '1',
    title: '',
    source: '',
    sourceUrl: '',
    summary: '',
    footerNotice: '',
    contact: '',
    isPublic: true,
    sections: [
      { 
        id: generateId('sec'), 
        subTitle: '', 
        items: [{ id: generateId('item'), type: 'text', text: '' }] 
      }
    ],
    // 초기 상태 수정
    links: [{ id: generateId('link'), label: '', url: '' }]
  });

  const [errors, setErrors] = useState({ mgmtId: false, title: false, summary: false });

  useEffect(() => {
    setBreadcrumbTitle("시민안전교육 등록");
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // --- handleChange 함수 보완 ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'orderNo') {
      // 빈 값일 때는 일단 허용 (지울 수 있어야 하니까요)
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
      
      const val = parseInt(value);
      // 숫자가 1보다 작으면 1로 고정
      if (val < 1) {
        setFormData(prev => ({ ...prev, [name]: '1' }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  // --- 섹션 및 아이템 관리 핸들러 ---
   // ★ [수정] 섹션 추가 시 고유 ID 생성
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections, 
        { 
          id: generateId('sec'), 
          subTitle: '', 
          items: [{ id: generateId('item'), type: 'text', text: '' }] 
        }
      ]
    }));
  };

  const removeSection = (sIdx) => {
    setFormData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== sIdx) }));
  };

  // ★ [수정] 아이템 추가 시 고유 ID 생성
  const addItem = (sIdx) => {
    const newSections = [...formData.sections];
    newSections[sIdx] = {
      ...newSections[sIdx],
      items: [
        ...newSections[sIdx].items,
        { id: generateId('item'), type: 'text', text: '' }
      ]
    };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const updateItem = (sIdx, iIdx, field, value) => {
    const newSections = [...formData.sections];
    const newItems = [...newSections[sIdx].items];
    newItems[iIdx] = { ...newItems[iIdx], [field]: value };
    newSections[sIdx] = { ...newSections[sIdx], items: newItems };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const removeItem = (sIdx, iIdx) => {
    const newSections = [...formData.sections];
    newSections[sIdx] = {
      ...newSections[sIdx],
      items: newSections[sIdx].items.filter((_, i) => i !== iIdx)
    };
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  // --- 링크 관리 핸들러 ---
  // 링크 추가 함수 수정
const addLink = () => {
  setFormData(prev => ({ 
    ...prev, 
    links: [...prev.links, { id: generateId('link'), label: '', url: '' }] 
  }));
};

  const updateLink = (lIdx, field, value) => {
    const newLinks = [...formData.links];
    newLinks[lIdx][field] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const removeLink = (lIdx) => {
    setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== lIdx) }));
  };

  const handleSave = () => {
    if (!formData.mgmtId.trim() || !formData.title.trim() || !formData.summary.trim()) {
      setErrors({ mgmtId: !formData.mgmtId.trim(), title: !formData.title.trim(), summary: !formData.summary.trim() });
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    // 저장 전 순서가 비어있다면 '1'로 채워주기
    if (!formData.orderNo) {
        setFormData(prev => ({ ...prev, orderNo: '1' }));
    }
    setIsModalOpen(true);
  };

 const handleConfirmSave = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const newEntry = { 
    ...formData, 
    // orderNo가 비어있으면 문자열 '1' 부여 (데이터 파일 형식 유지)
    orderNo: formData.orderNo || '1',
    id: Date.now(), // 또는 String(Date.now())
    author: '관리자', 
    createdAt: formattedDate, 
    updatedAt: formattedDate 
  };
    
  safetyEduData.unshift(newEntry);
  setShowToast(true);
  
  // 이동 전 토스트 메시지를 보여주기 위해 약간의 지연 후 이동
  setTimeout(() => navigate('/admin/contents/safetyEduList'), 1500);
};;

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon />
            <span className="font-bold">시민안전교육이 성공적으로 등록되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mb-10 tracking-tight text-[#111]">시민안전교육 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] border-b-2 border-gray-100 pb-3">교육 정보 입력</h3>
          
          <div className="flex flex-col space-y-12">
            {/* 1. 관리 정보 (상하 배열) */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID) (필수)</label>
                <input name="mgmtId" value={formData.mgmtId} onChange={handleChange} placeholder="예: E-2026-03" className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none ${errors.mgmtId ? 'border-red-500' : 'border-gray-300 focus:border-[#2563EB]'}`} />
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">시설명 / 교육명 (필수)</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="시설명을 입력하세요" className={`w-full border rounded-lg px-5 py-4 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300 focus:border-[#2563EB]'}`} />
              </div>
            </div>

            {/* 2. 출처 정보 (상하 배열) */}
            <div className="p-8 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#2563EB]">출처 기관</label>
                <input name="source" value={formData.source} onChange={handleChange} placeholder="기관명 (예: 전북특별자치도119안전체험관)" className="w-full bg-white border border-blue-200 rounded-lg px-5 py-3.5 outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#2563EB]">출처 URL (Source URL)</label>
                <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-white border border-blue-200 rounded-lg px-5 py-3.5 outline-none focus:border-[#2563EB]" />
              </div>
            </div>

            {/* 3. 요약 및 하단 공지 */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">내용 요약 (필수)</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" placeholder="사용자 페이지 목록 및 상단에 노출되는 요약 문구입니다." className={`w-full border rounded-lg px-5 py-4 outline-none resize-none ${errors.summary ? 'border-red-500' : 'border-gray-300 focus:border-[#2563EB]'}`} />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">하단 공지사항 (Footer Notice)</label>
                <textarea name="footerNotice" value={formData.footerNotice} onChange={handleChange} rows="2" placeholder="기타 자세한 사항은..." className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none resize-none focus:border-[#2563EB]" />
              </div>
            </div>

            {/* 4. 세부 내용 (Sections) - 상하 배열 */}
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <label className="font-bold text-[18px] text-[#2563EB]">교육 세부 내용 (Sections)</label>
                <button onClick={addSection} className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                  <Plus size={18} /> 섹션 추가
                </button>
              </div>

              {formData.sections.map((section, sIdx) => (
                <div key={section.id} className="p-8 border border-gray-200 rounded-xl bg-[#F9FAFB] relative shadow-sm flex flex-col gap-6">
                  <button onClick={() => removeSection(sIdx)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                  
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-gray-500 mb-2 uppercase tracking-wider">섹션 소제목 (subTitle)</label>
                    <input 
                      value={section.subTitle} 
                      onChange={(e) => {
                        const newSec = [...formData.sections];
                        newSec[sIdx].subTitle = e.target.value;
                        setFormData({...formData, sections: newSec});
                      }} 
                      placeholder="예: 이용안내, 이용방법 등" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-5 py-3.5 font-bold text-[#0066cc] outline-none focus:border-[#0066cc]" 
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-[14px] font-bold text-gray-500 uppercase tracking-wider">상세 항목 (Items)</label>
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex flex-col gap-3 bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative group">
                        <div className="flex items-center gap-4">
                          <select 
                            value={item.type} 
                            onChange={(e) => updateItem(sIdx, iIdx, 'type', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-[13px] font-bold bg-gray-50 outline-none focus:border-[#2563EB]"
                          >
                            <option value="text">일반 (text)</option>
                            <option value="bold">강조 (bold)</option>
                            <option value="indent">들여쓰기 (indent)</option>
                            <option value="gray">안내문 (gray)</option>
                          </select>
                          <span className="text-[12px] text-gray-400 font-medium italic">Type: {item.type}</span>
                        </div>
                        <textarea 
                          value={item.text} 
                          onChange={(e) => updateItem(sIdx, iIdx, 'text', e.target.value)} 
                          placeholder="내용을 입력하세요" 
                          className="w-full border-b border-gray-100 py-2 outline-none resize-none text-[15px]"
                          rows="1"
                        />
                        <button onClick={() => removeItem(sIdx, iIdx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={() => addItem(sIdx)} className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold hover:bg-gray-100 hover:border-gray-300 flex justify-center items-center gap-2 transition-all">
                      <Plus size={18} /> 항목 추가
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. 관련 사이트 및 문의처 (상하 배열) */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[16px] text-[#111]">관련 사이트 링크 (Links)</label>
                  <button onClick={addLink} className="text-[14px] font-bold text-[#2563EB] hover:underline">+ 링크 추가</button>
                </div>
                {formData.links.map((link, lIdx) => (
                  <div key={link.id} className="flex flex-col gap-3 p-5 bg-gray-50 border border-gray-200 rounded-xl relative">
                    <button onClick={() => removeLink(lIdx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                    <input value={link.label} onChange={(e) => updateLink(lIdx, 'label', e.target.value)} placeholder="링크 라벨 (예: 체험예약 ↗)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px]" />
                    <input value={link.url} onChange={(e) => updateLink(lIdx, 'url', e.target.value)} placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px]" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-[16px] mb-3 text-[#111]">문의처 정보 (Contact)</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="contact" value={formData.contact} onChange={handleChange} placeholder="예: 단체예약 등 문의사항 ☎ 063-xxx-xxxx" className="w-full border border-gray-300 rounded-lg pl-14 pr-5 py-4 outline-none focus:border-[#2563EB]" />
                </div>
              </div>
            </div>

            {/* --- 순서 설정 input 영역 --- */}
  <div className="flex flex-col pt-8 border-t border-gray-100">
    <label className="font-bold text-[16px] text-[#111] mb-3">순서</label>
    <div className="flex flex-col gap-2">
      <input 
        type="number"
        name="orderNo" 
        min="1" // ★ 브라우저 수준에서 최소값 제한
        value={formData.orderNo} 
        onChange={handleChange} 
        onKeyDown={(e) => {
          // 마이너스(-) 기호 입력 방지
          if (e.key === '-') e.preventDefault();
        }}
        className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-[#2563EB] font-bold text-[18px] outline-none focus:border-[#2563EB] shadow-sm" 
      />
      <p className="text-[13px] text-gray-400">
        * 1 이상의 숫자만 입력 가능하며, 낮을수록 상단에 노출됩니다.
      </p>
    </div>
  </div>

            {/* 6. 노출 여부 */}
            <div className="flex items-center gap-5 pt-8 border-t border-gray-100">
              <label className="font-bold text-[16px] text-[#111]">노출 여부</label>
              <button type="button" onClick={() => setFormData(prev => ({...prev, isPublic: !prev.isPublic}))} className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[14px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>{formData.isPublic ? '노출' : '비노출'}</span>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button onClick={() => setIsCancelModalOpen(true)} className="px-10 py-4 border border-gray-300 rounded-lg font-bold text-[16px] text-gray-500 bg-white hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleSave} className="px-10 py-4 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="교육 정보를 저장하시겠습니까?" message="입력하신 정보가 시민안전교육 데이터에 반영됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={() => navigate(-1)} title="등록을 취소하시겠습니까?" message="작성 중인 내용은 저장되지 않습니다." type="delete" />
    </div>
  );
};

export default AdminSafetyEduAdd;