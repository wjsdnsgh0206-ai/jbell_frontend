// src/pages/admin/behaviorMethod/BehaviorMethodAdd.jsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ChevronDown } from 'lucide-react';

// API
import { behaviorMethodService, fileService, codeService } from '@/services/api';

const BehaviorMethodAdd = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null);

  // =========================================================
  // 1. 상수 데이터 (DB code_group 기반)
  // =========================================================
  const DISASTER_CATEGORIES = [
    { id: 'BEHAVIOR_METHOD_NATURAL', name: '자연재난국민행동요령' },
    { id: 'BEHAVIOR_METHOD_SOCIAL', name: '사회재난국민행동요령' },
    { id: 'BEHAVIOR_METHOD_LIFE', name: '생활안전국민행동요령' }
  ];

  // =========================================================
  // 2. 상태 관리
  // =========================================================
  const [formData, setFormData] = useState({
    contentType: '',      // 재난 유형 코드 (예: 01001 - description 값)
    contentTypeName: '',  // 재난 유형 명 (예: 태풍)
    groupName: '',        // 재난 구분 명 (예: 자연재난국민행동요령)
    title: '',
    body: '',
    visibleYn: 'Y',
    fileIds: []
  });

  const [selectedGroupId, setSelectedGroupId] = useState(''); // 선택된 그룹 ID (API 호출용)
  const [typeList, setTypeList] = useState([]); // API로 불러온 재난 유형 목록

  // =========================================================
  // 3. 드롭다운 핸들러
  // =========================================================

  // 1차 분류(재난 구분) 변경
  const handleCategoryChange = async (e) => {
    const groupId = e.target.value; // 예: BEHAVIOR_METHOD_NATURAL
    const selectedCategory = DISASTER_CATEGORIES.find(c => c.id === groupId);

    setSelectedGroupId(groupId);
    
    // 폼 데이터 초기화 (구분 변경 시 하위 유형 초기화)
    setFormData(prev => ({
      ...prev,
      groupName: selectedCategory ? selectedCategory.name : '',
      contentType: '',
      contentTypeName: ''
    }));

    if (!groupId) {
      setTypeList([]);
      return;
    }

    // API 호출: 선택된 그룹의 아이템 목록 조회
    try {
      const response = await codeService.getCodeItems(groupId);
      const items = response.data?.data || response.data || response || [];
      setTypeList(items);;
    } catch (error) {
      console.error("재난 유형 로드 실패:", error);
      setTypeList([]);
    }
  };

  // 2차 분류(재난 유형) 변경
  const handleTypeChange = (e) => {
    const selectedDesc = e.target.value; // desc 값 (01006)
    
    // 백엔드 필드명인 subName과 desc를 사용하도록 변경
    const selectedItem = typeList.find(item => item.desc === selectedDesc);

    setFormData(prev => ({
      ...prev,
      contentType: selectedDesc, // 01006
      contentTypeName: selectedItem ? selectedItem.subName : '' // 한파
    }));
  };

  // =========================================================
  // 4. 에디터 및 기타 핸들러
  // =========================================================
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const res = await fileService.uploadEditorImage(file);
          if (res.status === 'SUCCESS') {
            const { filePath, fileIdx } = res.data;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', filePath); 
            quill.setSelection(range.index + 1);
            setFormData(prev => ({
                ...prev,
                fileIds: [...(prev.fileIds || []), fileIdx]
            }));
          }
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드 중 오류가 발생했습니다.");
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y'
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.contentType || !formData.body) {
      alert("제목, 재난유형, 본문은 필수입니다.");
      return;
    }
    if (!window.confirm("등록하시겠습니까?")) return;

    try {
      await behaviorMethodService.createBehaviorMethod(formData);
      alert("등록되었습니다.");
      navigate("/admin/contents/behaviorMethodList");
    } catch (error) {
      console.error(error);
      alert("등록 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-heading-l text-admin-text-primary tracking-tight">행동요령 등록</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate("/admin/contents/behaviorMethodList")} 
              className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button 
              onClick={handleSave} 
              className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md"
            >
              등록하기
            </button>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1열: 재난 정보 선택 (드롭다운) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               {/* 1. 재난 구분 선택 */}
               <div className="flex flex-col gap-3 relative">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 구분</label>
                <div className="relative">
                    <select 
                      value={selectedGroupId}
                      onChange={handleCategoryChange}
                      className="w-full h-14 pl-5 pr-10 rounded-lg border border-admin-border bg-white focus:border-admin-primary outline-none text-body-m appearance-none cursor-pointer"
                    >
                      <option value="">선택하세요</option>
                      {DISASTER_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option> 
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* 2. 재난 유형 선택 */}
              <div className="flex flex-col gap-3 relative">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형</label>
                <div className="relative">
                    <select 
                      name="contentType"
                      value={formData.contentType}
                      onChange={handleTypeChange}
                      disabled={!selectedGroupId}
                      className={`w-full h-14 pl-5 pr-10 rounded-lg border border-admin-border outline-none text-body-m appearance-none
                        ${!selectedGroupId ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white focus:border-admin-primary cursor-pointer'}`}
                    >
                      <option value="">
                        {!selectedGroupId ? '재난 구분을 먼저 선택하세요' : '유형을 선택하세요'}
                      </option>
                      {typeList.map((item) => (
                        // key는 subCode, value는 desc, 이름은 subName 사용
                        <option key={item.subCode} value={item.desc}>
                          {item.subName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* 3. 선택된 코드 확인용 (읽기 전용) */}
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">유형 코드 (자동입력)</label>
                <input 
                  value={formData.contentType}
                  disabled
                  placeholder="유형 선택 시 자동 입력"
                  className="h-14 px-5 rounded-lg border border-admin-border bg-gray-100 text-gray-500 cursor-not-allowed outline-none text-body-m"
                />
              </div>
            </div>

            {/* 2열: 제목 */}
            <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">제목</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary outline-none text-body-m"
                />
            </div>

            {/* 3열: 본문 */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">본문 내용</label>
              <div className="bg-white rounded-lg">
                <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    value={formData.body} 
                    onChange={handleEditorChange}
                    modules={modules} 
                />
              </div>
            </div>

            {/* 4열: 노출 여부 */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">노출 상태 설정</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
                  } cursor-pointer hover:shadow-inner`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
                <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-gray-400'}`}>
                    {formData.visibleYn === 'Y' ? "활성화 (Y)" : "비활성화 (N)"}
                </span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default BehaviorMethodAdd;