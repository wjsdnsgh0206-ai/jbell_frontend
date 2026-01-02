
const ActionTipBox = () => {
  return (
    <>
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center lg:text-left">
        지진 발생시 행동요령
      </h3>
      {/* 모바일 2열, 테블릿 이상 4열 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-square lg:aspect-[4/3] bg-gray-50 rounded-xl border p-3 lg:p-4 flex flex-col justify-between">
            <span className="text-xl lg:text-2xl font-black text-gray-200">
              0{n}
            </span>
            <p className="text-[12px] lg:text-sm font-semibold text-gray-600 leading-tight">
              집안에 넘어지기 쉬운 물건을 두지 마세요.
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
export default ActionTipBox;