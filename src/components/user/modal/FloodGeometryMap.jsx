import React, { useEffect, useState, useMemo } from "react";
import { Map, Polygon } from "react-kakao-maps-sdk";
import proj4 from "proj4";
import wktParser from "terraformer-wkt-parser";
import { disasterModalService } from "@/services/api";

// 1. 좌표계 설정 (EPSG:3857 -> 위경도 변환 공식)
const fromProjection = "EPSG:3857";
const toProjection = "EPSG:4326";

const FloodGeometryMap = () => {
  const [geoData, setGeoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 기본 위치는 전주시청이지만, 데이터 로드 시 실제 데이터 위치로 업데이트함
  const [mapCenter, setMapCenter] = useState({ lat: 35.8242, lng: 127.148 });

  useEffect(() => {
    const fetchJeonbukFloodData = async () => {
      setIsLoading(true);
      try {
        // 전북 데이터를 찾기 위해 넉넉하게 2000개 요청
        const res = await disasterModalService.getFloodTrace({
          numOfRows: 2000,
        });

        if (res && res.body) {
          // 전북(45) 데이터만 필터링 + 지오메트리 값이 있는 것만
          const filtered = res.body.filter(
            (item) => String(item.STDG_CTPV_CD) === "45" && item.GEOM
          );

          setGeoData(filtered);

          // [기능] 데이터가 있다면, 첫 번째 데이터의 좌표로 지도 중심 이동
          if (filtered.length > 0) {
            try {
              const firstGeom = wktParser.parse(filtered[0].GEOM);
              // POLYGON의 첫 번째 좌표 추출 [lng, lat]
              const firstCoord = firstGeom.coordinates[0][0];
              const [lng, lat] = proj4(fromProjection, toProjection, [
                firstCoord[0],
                firstCoord[1],
              ]);

              setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
            } catch (err) {
              console.error("중심점 좌표 추출 실패:", err);
            }
          }
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJeonbukFloodData();
  }, []);

  // 2. WKT를 위경도 배열로 변환 (useMemo로 연산 최적화)
  const polygons = useMemo(() => {
    return geoData
      .map((item) => {
        try {
          const geojson = wktParser.parse(item.GEOM);
          const path = geojson.coordinates[0].map((coord) => {
            const [lng, lat] = proj4(fromProjection, toProjection, [
              coord[0],
              coord[1],
            ]);
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
          });

          return {
            id: item.SN,
            path: path,
            title: item.FLDN_DST_NM,
            year: item.FLDN_YR,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  }, [geoData]);

  return (
    <div className="relative w-full h-full">
      <Map
        center={mapCenter} // 데이터가 로드되면 해당 위치로 자동 이동함
        style={{ width: "100%", height: "100%" }}
        level={6} // 데이터가 더 잘 보이게 적당히 확대
      >
        {/* react-kakao-maps-sdk 라이브러리에서 제공되는 polygons 도구를 활용하여 지도에 침수흔적도 좌표를 받아 그림을 그림 */}
        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            path={poly.path} // [좌표 데이터] 변환된 위도/경도 배열을 따라 지도 위에 면적을 그림
            strokeWeight={2} // [테두리] 침수 구역 외곽선의 두께
            strokeColor={"#2563eb"} // [선 색상] 외곽선의 색상 (파란색)
            strokeOpacity={0.8} // [선 투명도] 0(투명) ~ 1(불투명) 사이의 값
            fillColor={"#3b82f6"} // [채우기 색상] 침수 구역 내부를 채우는 색상
            fillOpacity={0.4} // [채우기 투명도] 지도가 비쳐 보이도록 0.4 설정
            onClick={() => alert(`${poly.year}년 침수흔적: ${poly.title}`)} // [상호작용] 클릭 시 상세 정보 팝업
          />
        ))}
      </Map>

      {/* 로딩 표시 - 사용자에게 작업 중임을 알림 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-blue-700 font-bold">
            전북 침수 데이터 분석 중...
          </span>
        </div>
      )}

      {/* 데이터가 없을 때 안내 문구 */}
      {!isLoading && polygons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 p-5 rounded-2xl border border-gray-100 shadow-xl">
            <p className="text-gray-500 font-semibold">
              조회된 전북 지역 침수 흔적이 없습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodGeometryMap;
