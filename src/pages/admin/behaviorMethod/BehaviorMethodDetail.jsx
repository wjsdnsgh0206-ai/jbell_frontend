// src/pages/admin/behaviorMethod/BehaviorMethodDetail.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ChevronDown } from 'lucide-react';

// API
import { behaviorMethodService, fileService, codeService } from '@/services/api';
import JsonBodyRenderer from '@/components/user/behaviorMethod/JsonBodyRenderer';

const BehaviorMethodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const quillRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isJsonBody, setIsJsonBody] = useState(false);

  // 1차 분류 상수 (DB의 code_group_id와 일치시킴)
  const DISASTER_CATEGORIES = useMemo(() => [
    { id: 'BEHAVIOR_METHOD_NATURAL', name: '자연재난국민행동요령' },
    { id: 'BEHAVIOR_METHOD_SOCIAL', name: '사회재난국민행동요령' },
    { id: 'BEHAVIOR_METHOD_LIFE', name: '생활안전국민행동요령' }
  ], []);

  // 1. 상태 관리
  const [formData, setFormData] = useState({
    contentId: '',
    contentType: '',      // 실제 저장되는 코드 (desc 필드: 예 '01001')
    contentTypeName: '',  // 화면용 이름 (subName 필드: 예 '태풍')
    groupName: '',        // 1차 분류 명 (예: '자연재난국민행동요령')
    title: '',
    body: '',
    visibleYn: 'Y',
    fileIds: []
  });

  const [originData, setOriginData] = useState(null);

  // 드롭다운용 상태
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [typeList, setTypeList] = useState([]); // 2차 분류(subCode, subName, desc 리스트)

  // =========================================================
  // 1. 상세 데이터 조회 및 초기화
  // =========================================================
  useEffect(() => {
    const getDetailData = async () => {
      setLoading(true);
      try {
        const response = await behaviorMethodService.getBehaviorMethodDetail(id);
        if (response && response.status === 'SUCCESS' && response.data) {
          const realData = response.data;
          setFormData({ ...realData, fileIds: [] });
          setOriginData(realData);
          setBreadcrumbTitle(realData.title);

          // 1. 기존 groupName을 기반으로 Group ID(BEHAVIOR_METHOD_...) 찾기
          const matchedCategory = DISASTER_CATEGORIES.find(c => c.name === realData.groupName);
          
          if (matchedCategory) {
            setSelectedGroupId(matchedCategory.id);
            // 2. 해당 그룹의 하위 아이템(SubCode 리스트) 로드
            const codeRes = await codeService.getCodeItems(matchedCategory.id);
            const items = Array.isArray(codeRes) ? codeRes : (codeRes.data || []);
            setTypeList(items);
          }

          try {
             const parsed = JSON.parse(realData.body);
             if (parsed && typeof parsed === 'object') setIsJsonBody(true);
          } catch (e) { setIsJsonBody(false); }
        }
      } catch (error) {
        console.error("로딩 에러", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getDetailData();
  }, [id, setBreadcrumbTitle, DISASTER_CATEGORIES]);

  // =========================================================
  // 2. 핸들러
  // =========================================================
  
  // 재난 구분 변경 (1차 분류)
  const handleCategoryChange = async (e) => {
    const groupId = e.target.value;
    const selectedCategory = DISASTER_CATEGORIES.find(c => c.id === groupId);

    setSelectedGroupId(groupId);
    
    // 구분 변경 시 하위 유형 및 코드 초기화
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

    try {
      const response = await codeService.getCodeItems(groupId);
      const items = Array.isArray(response) ? response : (response.data || []);
      setTypeList(items);
    } catch (error) {
      console.error("유형 로드 실패", error);
      setTypeList([]);
    }
  };

  // 재난 유형 변경 (2차 분류)
  const handleTypeChange = (e) => {
    const selectedDesc = e.target.value; // desc (숫자코드)
    const selectedItem = typeList.find(item => item.desc === selectedDesc);
    
    setFormData(prev => ({
      ...prev,
      contentType: selectedDesc,           // desc 저장
      contentTypeName: selectedItem ? selectedItem.subName : '' // subName 저장
    }));
  };

  // ... (기존 imageHandler, modules, handleSave 등 동일)
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
            setFormData(prev => ({ ...prev, fileIds: [...(prev.fileIds || []), fileIdx] }));
          }
        } catch (error) { console.error(error); alert("오류 발생"); }
      }
    };
  }, []);

  const modules = useMemo(() => {
    if (!isEdit) return { toolbar: false };
    return {
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
    };
  }, [isEdit, imageHandler]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    if (!isEdit) return; 
    setFormData(prev => ({ ...prev, visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' }));
  };

  const handleCancel = () => {
    if (window.confirm("취소하시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    if (!window.confirm("저장하시겠습니까?")) return;
    try {
      await behaviorMethodService.updateBehaviorMethod(id, formData);
      setOriginData(formData);
      setIsEdit(false);
      alert("저장되었습니다.");
      setFormData(prev => ({ ...prev, fileIds: [] })); 
    } catch (error) { alert("저장 실패"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
        await behaviorMethodService.deleteBehaviorMethods([id]);
        alert("삭제되었습니다.");
        navigate("/admin/contents/behaviorMethodList");
    } catch (error) { console.error(error); alert("삭제 실패"); }
  };

  const toggleRawEdit = () => {
    if(window.confirm("일반 에디터로 전환하시겠습니까?")) setIsJsonBody(false);
  };

  if (loading) return <div className="p-10 text-center">로딩중...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">
              행동요령 {isEdit ? '수정' : '상세 정보'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate("/admin/contents/behaviorMethodList")} className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all">목록으로</button>
                <button onClick={handleDelete} className="px-6 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">삭제</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">저장하기</button>
              </div>
            )}
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               {/* 1. 재난 구분 (Group Name) */}
               <div className="flex flex-col gap-3 relative">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 구분</label>
                <div className="relative">
                    <select 
                      value={selectedGroupId}
                      onChange={handleCategoryChange}
                      disabled={!isEdit}
                      className={`w-full h-14 pl-5 pr-10 rounded-lg border border-admin-border outline-none text-body-m appearance-none
                         ${!isEdit ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white focus:border-admin-primary cursor-pointer'}`}
                    >
                      <option value="">선택하세요</option>
                      {DISASTER_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option> 
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${!isEdit && 'hidden'}`} size={20} />
                </div>
              </div>

              {/* 2. 재난 유형 (Sub Name / Desc) */}
              <div className="flex flex-col gap-3 relative">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형</label>
                <div className="relative">
                  <select 
                    name="contentType"
                    value={formData.contentType || ''}
                    onChange={handleTypeChange}
                    disabled={!isEdit || !selectedGroupId}
                    className={`w-full h-14 pl-5 pr-10 rounded-lg border border-admin-border outline-none text-body-m appearance-none
                      ${(!isEdit || !selectedGroupId) ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white focus:border-admin-primary cursor-pointer'}`}
                  >
                    <option value="">선택하세요</option>
                    {typeList.map((item) => (
                      <option key={item.subCode} value={item.desc}>
                        {item.subName}
                      </option>
                    ))}
                  </select>
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${(!isEdit || !selectedGroupId) && 'hidden'}`} size={20} />
                </div>
              </div>

              {/* 3. 유형 코드 (Read Only) */}
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">유형 코드 (desc)</label>
                <input 
                  value={formData.contentType || ''}
                  disabled
                  className="h-14 px-5 rounded-lg border border-admin-border bg-gray-100 text-gray-500 cursor-not-allowed outline-none text-body-m"
                />
              </div>
            </div>

            {/* 나머지 필드들은 기존과 동일 */}
            <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">제목</label>
                <input 
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">본문 내용</label>
                  {isEdit && isJsonBody && (
                      <button onClick={toggleRawEdit} className="text-xs text-red-500 underline">JSON 직접 수정하기</button>
                  )}
              </div>
              <div className={`rounded-lg transition-all ${isEdit ? 'bg-white' : 'view-mode-container shadow-inner'}`}>
                {isJsonBody && !isEdit ? (
                    <JsonBodyRenderer jsonString={formData.body} />
                ) : (
                    <ReactQuill 
                        ref={quillRef}
                        theme={isEdit ? "snow" : null} 
                        value={formData.body || ''} 
                        onChange={handleEditorChange}
                        modules={modules} 
                        readOnly={!isEdit}
                    />
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">현재 노출 상태</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={!isEdit}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
                  } ${isEdit ? 'cursor-pointer hover:shadow-inner' : 'cursor-not-allowed opacity-60'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
                <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
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

export default BehaviorMethodDetail;