const MapControlBtn = () => {
    return (
        <>
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-1.5 z-10">
                <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                    +
                </button>
                <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                    -
                </button>
            </div>
        </>
    )
}

export default MapControlBtn;