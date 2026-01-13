import React from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ 
  animationData, 
  width = 200, 
  height = 200, 
  loop = true, 
  autoplay = true,
  className = ""
}) => {
  // Default animation data (you can replace this with actual Lottie JSON)
  const defaultAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Celebration",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Star",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { 
            a: 1, 
            k: [
              { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
              { t: 60, s: [360] }
            ]
          },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { 
            a: 1,
            k: [
              { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0, 0, 100] },
              { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30, s: [120, 120, 100] },
              { t: 60, s: [0, 0, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ks: {
                  a: 0,
                  k: {
                    i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                    o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                    v: [[0, -20], [6, -6], [20, -6], [10, 6], [16, 20], [0, 12], [-16, 20], [-10, 6], [-20, -6], [-6, -6]],
                    c: true
                  }
                }
              },
              {
                ty: "fl",
                c: { a: 0, k: [1, 0.8, 0, 1] },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: 60,
        st: 0
      }
    ]
  };

  return (
    <div className={`inline-block ${className}`} style={{ width, height }}>
      <Lottie
        animationData={animationData || defaultAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;