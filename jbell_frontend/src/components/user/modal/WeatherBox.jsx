const WeatherBox = () => {
  return (
    <>
      <div className="flex justify-between items-end mb-4">
        <span className="text-sm font-bold text-gray-800">📍 덕진동</span>
        <span className="text-3xl font-black text-gray-800">-2°</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {["미세먼지 보통", "초미세먼지 보통", "강수 0mm", "확률 10%"].map(
          (v) => (
            <div
              key={v}
              className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100/50"
            >
              <p className="text-[10px] text-gray-400 font-bold mb-0.5">
                {v.split(" ")[0]}
              </p>
              <p className="text-[13px] font-bold text-gray-700">
                {v.split(" ")[1]}
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default WeatherBox;
