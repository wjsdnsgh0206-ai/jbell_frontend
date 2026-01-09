const MapControlBtn = () => {
    return (
        /* hidden: 모바일에서는 숨김 | sm:flex: 태블릿/PC 이상 사이즈에서만 노출 */
        <div className="hidden sm:flex absolute bottom-5 right-5 flex-col gap-1.5 z-10">
            <button className="w-10 h-10 bg-white border border-graygray-10 rounded-xl shadow-lg flex items-center justify-center text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-95">
                +
            </button>
            <button className="w-10 h-10 bg-white border border-graygray-10 rounded-xl shadow-lg flex items-center justify-center text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-95">
                -
            </button>
        </div>
    )
}

export default MapControlBtn;