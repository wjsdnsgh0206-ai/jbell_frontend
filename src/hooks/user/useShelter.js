// 대피소 탭 클릭시 대피소 정보 표시 hook
// hooks/user/useShelter.js
import { useState, useCallback } from "react";
import { facilityApi } from "@/services/api";

const useShelter = () => {
  const [shelterMarkers, setShelterMarkers] = useState([]);

  const fetchShelters = useCallback(async (type) => {
    // // console.log("1. fetchShelters 함수 시작, type:", type); // 로그 추가
    try {
      const response = await facilityApi.getShelters(type);
      // // console.log("2. API 전체 응답:", response); // 응답 전체 구조 확인

      // 백엔드 응답 규격(ApiResponse)에 따라 데이터 추출 경로 수정
      const list = response?.items || [];
      // // console.log("3. 추출된 리스트:", list);

      const markers = list.map((s) => ({
        id: s.fcltId || s.fclt_id,
        title: s.fcltNm || s.fclt_nm,
        lat: parseFloat(s.lat),
        lng: parseFloat(s.lot), // DB 컬럼명이 lot인 것 확인
        address: s.roadNmAddr,
        content: `
          <div style="margin-top: 4px;">
            <p><strong>주소:</strong> ${s.roadNmAddr || "정보 없음"}</p>
            <p><strong>수용 가능 인원:</strong> ${s.fcltCapacity ? s.fcltCapacity + "명" : "확인 중"}</p>
            <p><strong>시설 면적:</strong> ${s.fcltArea ? s.fcltArea + "㎡" : "-"}</p>
          </div>
        `,
        type: "shelter",
      }));

      // // console.log("4. 가공된 마커:", markers);
      setShelterMarkers(markers);
    } catch (error) {
      console.error("대피소 로딩 중 진짜 에러 발생:", error);
    }
  }, []);

  return { shelterMarkers, fetchShelters, setShelterMarkers };
};

export default useShelter;
