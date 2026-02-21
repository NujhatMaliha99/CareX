import React, { useEffect, useState } from "react";
import "./SplashScreen.css";

const SplashScreen = (props) => {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const popTimer = setTimeout(() => setPop(true), 200);

    const timer = setTimeout(() => {
      if (props.onFinish) props.onFinish(); 
    }, 3000);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="splash-container">
      <div className={`content ${pop ? "show" : ""}`}>
        <svg className="logo" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 30 C115 10,145 15,130 50 C120 70,100 60,100 60"
            stroke="white"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M100 150 
               L50 100 
               C20 70,50 30,85 60
               C100 35,150 40,150 85
               C150 110,120 130,100 150Z"
            stroke="white"
            strokeWidth="6"
            fill="none"
          />
          <polyline
            points="45,95 75,95 90,75 105,120 120,85 140,95 155,95"
            stroke="white"
            strokeWidth="6"
            fill="none"
          />
        </svg>
        <h1 className="title">CareX</h1>
        <p className="subtitle">Your Health, Your Journey</p>
      </div>
    </div>
  );
};

export default SplashScreen;