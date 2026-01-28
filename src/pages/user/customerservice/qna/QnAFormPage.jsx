// src/pages/user/customerservice/qna/QnAFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Unlock} from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button';
import { qnaService } from '@/services/api';

const QnAFormPage = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
    { label: "1:1문의하기", path: "/qna/form", hasIcon: false },
  ];

  // 로그인된 유저 ID를 담을 상태
  const [loginUserId, setLoginUserId] = useState('');

  const [formData, setFormData] = useState({
    isPublic: true,
    category: '',
    title: '',
    content: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // 페이지 로드 시 로그인 정보 가져오기
  useEffect(() => {
    // 💡 중요: 로그인 페이지에서 저장했던 "키 이름"을 확인해야 합니다.
    // 보통 'user', 'userInfo', 'loginUser' 등으로 저장합니다.
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // 저장된 객체에서 ID를 꺼냅니다. (user_id 또는 userId 등 저장된 필드명 확인 필요)
        const userId = parsedUser.userId || parsedUser.user_id || parsedUser.id;
        
        if (userId) {
          setLoginUserId(userId);
        } else {
          console.error("로그인 정보에 ID가 없습니다.");
        }
      } catch (e) {
        console.error("로그인 정보 파싱 실패", e);
      }
    } else {
      // 로그인이 안 되어 있다면 로그인 페이지로 튕겨내기
      alert("로그인이 필요한 서비스입니다.");
      navigate('/LoginMain'); 
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePublic = (val) => {
    setFormData(prev => ({ ...prev, isPublic: val }));
  };

  const handleSubmit = async () => {
    const { title, content, category, isPublic } = formData;
    
    if (!title || !content || !category) {
      alert("모든 필수 항목(*)을 입력해주세요.");
      return;
    }

    if (!loginUserId) {
        alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
        return;
    }

    // 전송용 데이터 객체 생성
    const payload = {
      qnaCategoryId: category,
      title: title,
      content: content,
      isVisible: isPublic ? "Y" : "N",
      userId: loginUserId
    };

    try {
      await qnaService.createQna(payload);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/qna');
      }, 1000);
    } catch (error) {
      console.error("문의 등록 실패:", error);
      alert("문의 등록 중 오류가 발생했습니다.\n(관리자에게 문의해주세요)");
    }
  };

  return (
    <div className="w-full bg-white text-graygray-90">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl pb-10 text-graygray-90">1:1문의 작성</h1>

        <div className="border-t border-graygray-90 pt-10">
          <div className="space-y-8">
            
            {/* 1. 옵션 행 */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* 문의 유형 */}
              <div className="flex-1">
                <label className="block text-title-m font-bold text-graygray-90 mb-3">
                  문의 유형 <span className="text-secondary-50">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-14 px-4 border border-graygray-30 rounded-lg focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 bg-white cursor-pointer appearance-none transition-colors"
                >
                  <option value="" disabled>유형을 선택해주세요</option>
                  <option value="ACC_MGMT">계정 및 회원정보</option>
                  <option value="SYS_ERR">시스템 및 장애</option>
                  <option value="PAY_SERV">결제 및 서비스 이용</option>
                  <option value="SUGG_IMP">기능 제안 및 개선</option>
                  <option value="ETC_INQ">기타</option>
                </select>
              </div>

              {/* 공개 설정 */}
              <div className="flex-1">
                <label className="block text-title-m font-bold text-graygray-90 mb-3">
                  공개 설정
                </label>
                <div className="flex gap-2 h-14">
                  <button
                    type="button"
                    onClick={() => togglePublic(true)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all text-body-m ${
                      formData.isPublic
                        ? 'bg-secondary-50 border-secondary-50 text-white font-bold'
                        : 'bg-white border-graygray-30 text-graygray-50 hover:bg-graygray-5'
                    }`}
                  >
                    <Unlock size={18} />
                    공개
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublic(false)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all text-body-m ${
                      !formData.isPublic
                        ? 'bg-secondary-50 border-secondary-50 text-white font-bold'
                        : 'bg-white border-graygray-30 text-graygray-50 hover:bg-graygray-5'
                    }`}
                  >
                    <Lock size={18} />
                    비공개
                  </button>
                </div>
              </div>
              
            </div>

            {/* 2. 제목 입력 */}
            <div>
              <label className="block text-title-m font-bold text-graygray-90 mb-3">
                제목 <span className="text-secondary-50">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="제목을 입력해주세요."
                value={formData.title}
                onChange={handleInputChange}
                className="w-full h-14 px-4 border border-graygray-30 rounded-lg placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 transition-colors"
              />
            </div>

            {/* 3. 내용 입력 */}
            <div className="relative">
              <label className="block text-title-m font-bold text-graygray-90 mb-3">
                내용 <span className="text-secondary-50">*</span>
              </label>
              <textarea
                name="content"
                placeholder="문의하실 내용을 자세히 기재해주시면 더욱 빠르고 정확한 답변이 가능합니다."
                value={formData.content}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) handleInputChange(e);
                }}
                className="w-full p-5 min-h-[320px] border border-graygray-30 rounded-lg resize-none placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 leading-relaxed transition-colors"
              />
              <div className="absolute bottom-5 right-5 text-detail-m text-graygray-40">
                <span className="text-secondary-50 font-bold">{formData.content.length}</span> / 1000자
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 - 양옆 정렬 */}
        <div className="flex justify-between items-center pt-10 mt-5 border-t border-graygray-10 pb-20">
            <Button 
              variant="tertiary"
              onClick={() => navigate('/qna')}
              className="px-8" 
            >
              취소하기
            </Button>
            <Button 
              variant="primary"
              size="default"
              onClick={handleSubmit}
              className="px-8" 
            >
              문의하기
            </Button>
        </div>

        {/* 성공 토스트 */}
        {showSuccess && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-graygray-90 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
             <div className="bg-secondary-50 rounded-full p-1">
              <Check size={16} strokeWidth={3} className="text-white" />
            </div>
            <p className="font-bold text-body-m">문의가 성공적으로 등록되었습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QnAFormPage;