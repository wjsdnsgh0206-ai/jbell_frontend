import React, { useEffect, useState, useMemo } from "react";
import { Map, Polygon } from "react-kakao-maps-sdk";
import proj4 from "proj4";
import wktParser from "terraformer-wkt-parser";
import { disasterModalService } from "@/services/api";

// 좌표계 설정
const fromProjection = "EPSG:3857";
const toProjection = "EPSG:4326";

const FloodGeometryMap = () => {
  const [geoData, setGeoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 전주시청 중심 좌표
  const JEONJU_CITY_HALL = { lat: 35.8242, lng: 127.1480 };

  useEffect(() => {
    const fetchJeonbukFloodData = async () => {
      setIsLoading(true);
      try {
        // 전북 데이터를 충분히 가져오기 위해 2000개 요청 (데이터 양에 따라 조절)
        const res = await disasterModalService.getFloodTrace({
          numOfRows: 2000, 
        });

        if (res && res.body) {
          // 전북(45) 데이터만 필터링
          const filtered = res.body.filter(
            (item) => String(item.STDG_CTPV_CD) === "45" && item.GEOM
          );
          setGeoData(filtered);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJeonbukFloodData();
  }, []);

  const polygons = useMemo(() => {
    return geoData.map((item) => {
      try {
        const geojson = wktParser.parse(item.GEOM);
        const path = geojson.coordinates[0].map((coord) => {
          const [lng, lat] = proj4(fromProjection, toProjection, [coord[0], coord[1]]);
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });

        return {
          id: item.SN,
          path: path,
          title: item.FLDN_DST_NM,
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  }, [geoData]);

  return (
    <div className="relative w-full h-full">
      <Map
        center={JEONJU_CITY_HALL} // 전주시청 기준으로 설정
        style={{ width: "100%", height: "100%" }}
        level={5} // 시가지가 상세히 보이도록 확대 (숫자가 작을수록 확대됨)
      >
        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            path={poly.path}
            strokeWeight={3}
            strokeColor={"#2563eb"}
            strokeOpacity={0.8}
            fillColor={"#3b82f6"}
            fillOpacity={0.4}
          />
        ))}
      </Map>

      {/* 로딩 표시 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-50">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-blue-700 text-sm font-bold">전북 침수 흔적 분석 중...</span>
        </div>
      )}

      {/* 데이터 없음 안내 */}
      {!isLoading && polygons.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white/90 p-4 rounded-xl border border-gray-200 shadow-md">
            <p className="text-gray-500 text-xs">현재 위치 주변에 침수 흔적 데이터가 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodGeometryMap;