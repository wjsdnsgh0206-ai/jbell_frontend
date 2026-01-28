import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, AlertCircle, MapPin } from 'lucide-react';
import { facilityService } from '@/services/api';

import DetailPageTemplate from '@/components/user/facility/DetailPageTemplate';
import InfoList from '@/components/user/facility/InfoList';
import { Button } from '@/components/shared/Button';

const UserFacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null); // 지도를 담을 DOM 레퍼런스

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);

  const SHELTER_TYPE_MAP = {
    'CIVIL_DEFENSE_DISASTER': '민방위대피소(재난)',
    'CIVIL_DEFENSE_COMMITTE': '민방위대피소(원자력)',
    'COLD_SHELTER': '한파쉼터',
    'HEAT_SHELTER': '무더위쉼터',
    'EARTHQUAKE_SHELTER': '지진옥외대피장소',
    'TEMPORARY_HOUSING': '이재민임시주거시설'
  };

  // 1. 데이터 호출 (백엔드 연동)
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await facilityService.getFacilityDetail(id);
        const apiData = response.data;

        if (apiData) {
          const formattedData = {
            ...apiData, // 원본 데이터 유지 (lat, lot 사용을 위함)
            name: apiData.fcltNm,
            lastUpdated: apiData.regDt ? new Date(apiData.regDt).toLocaleDateString() : "-",
            description: `${apiData.fcltNm}은(는) 전북 ${apiData.sggNm}에 위치한 안전 시설물입니다.`,
            details: [
              { label: "시설 유형", value: SHELTER_TYPE_MAP[apiData.fcltSeCd] || "일반 시설" },
              { label: "도로명 주소", value: apiData.roadNmAddr || "정보 없음" },
              { label: "관리 구역", value: `${apiData.ctpvNm} ${apiData.sggNm}` },
              { label: "수용 인원", value: apiData.fcltCapacity ? `${apiData.fcltCapacity.toLocaleString()} 명` : "정보 없음" },
              { label: "시설 면적", value: apiData.fcltArea ? `${apiData.fcltArea.toLocaleString()} ㎡` : "정보 없음" },
              { label: "사용 여부", value: apiData.useYn === 'Y' ? "사용 가능" : "사용 중단" },
            ]
          };
          setData(formattedData);
        }
      } catch (error) {
        console.error("시설 상세 정보 로드 실패:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. 지도 초기화 및 마커 표시 (데이터 로딩 완료 후 실행)
  useEffect(() => {
    if (!loading && data && mapRef.current && window.kakao) {
      const container = mapRef.current;
      const position = new window.kakao.maps.LatLng(data.lat, data.lot);
      
      const options = {
        center: position,
        level: 3 // 상세 페이지이므로 조금 더 확대해서 표시
      };

      const map = new window.kakao.maps.Map(container, options);
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: map
      });

      // 지도 컨트롤 추가 (줌 컨트롤)
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      setMapInstance(map);
    }
  }, [loading, data]);

  // 로딩 및 에러 UI 생략 (기존 디자인 유지)
  if (loading) return (
    <div className="flex h-[60vh] justify-center items-center flex-col gap-4">
      <div className="w-10 h-10 border-4 border-graygray-20 border-t-secondary-50 rounded-full animate-spin"></div>
      <p className="text-body-m text-graygray-50">시설 정보를 불러오는 중입니다...</p>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col h-[60vh] justify-center items-center gap-6">
      <AlertCircle className="w-16 h-16 text-graygray-30" />
      <div className="text-center">
        <p className="text-title-m font-bold text-graygray-90">시설 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/facilityList')} className="mt-4 px-6 py-3 bg-secondary-50 text-white rounded-lg">목록으로 돌아가기</button>
      </div>
    </div>
  );

  return (
    <DetailPageTemplate
      title={data.name}
      lastUpdated={data.lastUpdated}
      breadcrumbItems={[
        { label: "홈", path: "/", hasIcon: true },
        { label: "대피소 소개", path: "/facilityList", hasIcon: false },
        { label: data.name, hasIcon: false },
      ]}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-heading-m text-graygray-90">시설 위치 및 정보</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 w-full mb-10">
        <div className="flex flex-col gap-6 flex-1">
          {/* 변경된 지도 영역: 정적 이미지 대신 실제 Kakao Map 컨테이너 사용 */}
          <div className="w-full h-[350px] bg-graygray-5 rounded-xl overflow-hidden border border-graygray-20 relative">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* 길찾기 바로가기 버튼 (디자인 포인트) */}
            <button 
              onClick={() => {
                const url = `https://map.kakao.com/link/to/${data.name},${data.lat},${data.lot}`;
                window.open(url, '_blank');
              }}
              className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-graygray-20 text-body-s font-bold text-slate-700 flex items-center gap-2 hover:bg-white transition-colors"
            >
              <MapPin size={16} className="text-secondary-50" />
              카카오맵으로 길찾기
            </button>
          </div>

          <aside className="p-6 bg-secondary-5 rounded-xl border border-secondary-50/20">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-secondary-50" />
              <h3 className="text-title-s font-bold text-graygray-90">안내사항</h3>
            </div>
            <p className="text-body-m text-graygray-70 leading-relaxed pl-1">
              {data.description}
            </p>
          </aside>
        </div>

        <div className="flex-1">
           <InfoList items={data.details} />
        </div>
      </div>
      
      <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
        <Button variant="tertiary" onClick={() => navigate('/facilityList')} className="px-8">
          목록으로
        </Button>
      </div>
    </DetailPageTemplate>
  );
};

export default UserFacilityDetail;