import React from 'react';
import { ShieldCheck, Database, Layout, Server, Quote } from 'lucide-react';

const JbellProjectSummary = () => {
  return (
    <section className="max-w-4xl w-full mx-auto my-16 p-8 bg-white border border-graygray-20 rounded-2xl shadow-sm font-sans text-left">
      
      {/* 1. 프로젝트 타이틀 및 슬로건 */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-graygray-90 mb-3 flex justify-center items-center gap-2">
          팀프로젝트 개요
        </h2>
        <p className="text-lg text-graygray-70 font-medium">
          "흩어진 공공 데이터를 넘어, 실무적 실시간성으로 도민의 안전을 설계하다"
        </p>
      </div>

      {/* 2. 프로젝트 개요 (기본 정보) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-10 bg-graygray-5 p-6 rounded-xl border border-graygray-20 text-center">
        <div>
          <span className="font-bold text-graygray-90 w-20">주제:</span>
          <span className="text-graygray-70"> Spring Boot & MyBatis 기반 실시간 재난 안전 플랫폼</span>
        </div>
        <div>
          <span className="font-bold text-graygray-90 w-20">팀명:</span>
          <span className="text-graygray-70"> turtleNeck (6인 팀 프로젝트)</span>
        </div>
      </div>

      {/* 3. 3대 핵심 기술 역량 */}
      <div className="space-y-8 mb-10">
        <h3 className="text-xl font-bold text-graygray-90 border-b border-graygray-20 pb-2 flex items-center gap-2">
          핵심 기술 역량
        </h3>

        {/* 역량 1 */}
        <div>
          <h4 className="flex items-center gap-2 font-bold text-graygray-90 mb-2">
            <Database className="w-5 h-5 text-admin-primary" /> 1. 데이터 통합 및 정합성 확보 (Backend)
          </h4>
          <ul className="list-disc ml-6 space-y-1 text-[15px] text-graygray-70">
            <li><strong>이기종 API 통합:</strong> 5개 기관의 상이한 데이터를 DTO 레이어로 표준화하여 정합성 100% 달성</li>
            <li><strong>실무적 실시간성:</strong> Spring Scheduler 배치 연동 및 Upsert 로직으로 서버 자원 효율화 및 최신성 유지</li>
          </ul>
        </div>

        {/* 역량 2 */}
        <div>
          <h4 className="flex items-center gap-2 font-bold text-graygray-90 mb-2">
            <Layout className="w-5 h-5 text-admin-primary" /> 2. 액션 중심의 시각화 서비스 (Frontend)
          </h4>
          <ul className="list-disc ml-6 space-y-1 text-[15px] text-graygray-70">
            <li><strong>지도 기반 직관성:</strong> Kakao Map API 클러스터링을 적용하여 위험 지역 밀집도 시각화</li>
            <li><strong>맞춤형 가이드:</strong> 위치 기반 재난 코드 매칭을 통해 행동 요령 및 최단 거리 대피소 즉각 제공</li>
          </ul>
        </div>

        {/* 역량 3 */}
        <div>
          <h4 className="flex items-center gap-2 font-bold text-graygray-90 mb-2">
            <Server className="w-5 h-5 text-admin-primary" /> 3. 안정적인 운영 환경 구축 (DevOps)
          </h4>
          <ul className="list-disc ml-6 space-y-1 text-[15px] text-graygray-70">
            <li><strong>CI/CD 자동화:</strong> OCI 환경에서 GitHub Actions를 이용한 무중단 배포 파이프라인 구축</li>
            <li><strong>보안 및 관리:</strong> JWT 기반 인증 체계 및 데이터 관리를 위한 CMS(관리 시스템) 설계·구현</li>
          </ul>
        </div>
      </div>

    </section>
  );
};

export default JbellProjectSummary;