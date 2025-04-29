import React from "react";
import img_1 from "../assets/img_1.jpeg";

import img_6 from "../assets/img_6.jpeg";
import img_7 from "../assets/img_7.jpeg";

function Component({ image, text }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-black/20  rounded-lg shadow-lg">
      <img src={image} alt="Animated Icon" className="w-16 h-16 mb-2" />
      <p className="text-white text-center">{text}</p>
    </div>
  );
}

function AnimatedIcons() {
  const icons = [
    { image: img_6, text: "PCA Regulated" }, 
    { image: img_7, text: "#7 On Recovered" },
    { image: img_1, text: "4,000+ Customers" },
    
   
  ];

  return (
    <div className="flex  justify-center items-center gap-4 p-4">
      {icons.map((icon, index) => (
        <Component key={index} {...icon} />
      ))}
    </div>
  );
}

export default AnimatedIcons;
