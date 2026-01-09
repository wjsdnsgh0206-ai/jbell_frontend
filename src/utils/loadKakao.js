let kakaoPromise = null;

export const loadKakao = () => {
  if (kakaoPromise) return kakaoPromise;

  kakaoPromise = new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    window.kakao.maps.load(() => {
      resolve(window.kakao);
    });
  });

  return kakaoPromise;
};
