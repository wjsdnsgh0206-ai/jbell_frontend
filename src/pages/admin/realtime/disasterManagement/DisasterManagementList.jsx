'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Activity, RefreshCw, Link as LinkIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const DisasterManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // 1. 상태 관리 (지진 API 추가)
  const [disasters, setDisasters] = useState([
    {
      id: "WTH_COLD_001",
      apiName: "기상청 한파 영향예보 조회 서비스",
      category: "한파",
      requestUrl: "/api/disaster/fetch/weather-list?type=3",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_FIRE_001",
      apiName: "산불 위험 예보 정보 서비스",
      category: "산불",
      requestUrl: "/api/disaster/fetch/forest-fire-list",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_EQK_001", // ✅ 지진 API 추가
      apiName: "기상청 국내 지진 통보 서비스",
      category: "지진",
      requestUrl: "/api/disaster/fetch/earthquake-list",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  // 2. 실시간 GET 요청 상태 체크 (200 OK 확인)
  const checkApiStatus = useCallback(async () => {
    // 현재 체크 중임을 표시하기 위해 상태 살짝 변경 (UX)
    setDisasters(prev => prev.map(item => ({ ...item, apiStatus: '체크중' })));

    const updatedData = await Promise.all(disasters.map(async (item) => {
      try {
        // 백엔드 API 호출 (절대 경로 보장)
        const baseUrl = "http://localhost:8080";
        const res = await axios.get(`${baseUrl}${item.requestUrl}`, { timeout: 5000 });
        
        if (res.status === 200) {
          return { 
            ...item, 
            apiStatus: '정상', 
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
          };
        }
        return { ...item, apiStatus: '비정상', updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      } catch (error) {
        return { 
          ...item, 
          apiStatus: '비정상', 
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
      }
    }));
    
    setDisasters(updatedData);
  }, [disasters.length]); // disasters 객체 전체를 넣으면 무한루프 위험이 있어 길이로 체크

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 API 관리");
    checkApiStatus();
  }, []);

  const handleToggleVisible = useCallback((id, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const target = disasters.find(d => d.id === id);

    setModalConfig({
      title: '노출 상태 변경',
      message: <p>{target?.category} 정보를 지도에서 <b>{nextStatus === 'Y' ? '노출' : '비노출'}</b>하시겠습니까?</p>,
      type: 'confirm',
      onConfirm: () => {
        setDisasters(prev => prev.map(item => item.id === id ? { ...item, visibleYn: nextStatus } : item));
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  }, [disasters]);

  // 3. 테이블 컬럼 정의
  const columns = useMemo(() => [
    { key: 'id', header: 'ID', width: '140px', className: 'text-center font-mono text-[11px]' },
    { 
      key: 'apiName', 
      header: 'API 명칭', 
      width: '240px', 
      className: 'font-left',
      render: (val) => <span className="font-semibold">{val}</span>
    },
    { 
      key: 'category', 
      header: '유형', 
      width: '100px', 
      className: 'text-center',
      render: (val) => {
        const colors = {
          '한파': 'bg-blue-50 text-blue-600',
          '산불': 'bg-orange-50 text-orange-600',
          '지진': 'bg-red-50 text-red-600'
        };
        return <span className={`px-2 py-1 rounded text-[12px] font-bold ${colors[val] || 'bg-slate-50'}`}>{val}</span>
      }
    },
    { 
      key: 'requestUrl', 
      header: '백엔드 요청 URL', 
      className: 'text-left',
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-400">
          <LinkIcon size={14} className="flex-shrink-0" />
          <span className="truncate max-w-[300px] text-[12px] font-mono bg-slate-50 px-2 py-1 rounded" title={val}>{val}</span>
        </div>
      )
    },
    { 
      key: 'apiStatus', 
      header: '상태', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <span className={`px-3 py-1 rounded text-[12px] font-bold border transition-colors ${
          val === '정상' ? 'bg-green-100 text-green-700 border-green-200' : 
          val === '체크중' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {val === '체크중' ? '연결확인' : val}
        </span>
      )
    },
    { 
      key: 'visibleYn', 
      header: '지도노출', 
      width: '100px',
      render: (val, row) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id, val); }}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${val === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${val === 'Y' ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      )
    },
    { key: 'updatedAt', header: '최근 점검', width: '110px', className: 'text-center text-slate-500 text-[12px]' },
    {
        key: 'actions',
        header: '관리',
        width: '80px',
        className: 'text-center',
        render: (_, row) => (
          <button onClick={() => navigate(`/admin/realtime/disasterManagementDetail/${row.id}`)} className="text-admin-primary hover:underline text-sm font-medium">
            수정
          </button>
        )
    }
  ], [handleToggleVisible, navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-slate-900">
      <main className="p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">재난 API 관리</h2>
            <p className="text-slate-500 mt-1 text-sm">기상청 및 산림청 외부 API 데이터의 백엔드 연동 상태를 실시간 점검합니다.</p>
          </div>
          <button 
            onClick={checkApiStatus} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-medium"
          >
            <RefreshCw size={14} className={disasters.some(d => d.apiStatus === '체크중') ? 'animate-spin' : ''} /> 상태 즉시 체크
          </button>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <AdminDataTable columns={columns} data={disasters} rowKey="id" />
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default DisasterManagementList;