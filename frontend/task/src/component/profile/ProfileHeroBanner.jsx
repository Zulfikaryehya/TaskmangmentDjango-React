import React from "react";

export default function ProfileHeroBanner({ userGradient }) {
  return (
    <div
      className={`h-72 bg-gradient-to-r ${userGradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 translate-x-1/3 translate-y-1/3"></div>
    </div>
  );
}
