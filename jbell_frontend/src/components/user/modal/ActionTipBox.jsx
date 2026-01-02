
const ActionTipBox = () => {
    return (
        <>
        {/* 행동요령 */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-sm border"> */}
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            지진 발생시 행동요령
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/3] bg-gray-50 rounded-xl border p-4">
                <span className="text-2xl font-black text-gray-200">
                  0{n}
                </span>
                <p className="mt-2 text-sm font-semibold text-gray-600">
                  집안에 넘어지기 쉬운 물건을 두지 마세요.
                </p>
              </div>
            ))}
          </div>
        {/* </div> */}
        </>
    )
}

export default ActionTipBox;