import React from "react";
import UserReelsCard from "./UserReelsCard";

const reelsData = [
  {
    id: 1,
    views: 7460,
    title: "逆天邪神：叶家少主又给拍了CG建模大片",
    isPinned: true,
  },
  {
    id: 2,
    views: 4235,
    title: "逆天邪神：叶家少主又给拍了CG建模大片",
    isPinned: false,
  },
  {
    id: 3,
    views: 7559,
    title: "逆天邪神：叶家少主又给拍了CG建模大片",
    isPinned: false,
  },
  {
    id: 4,
    views: 1045,
    title: "逆天邪神：叶家少主又给拍了CG建模大片",
    isPinned: false,
  },
  // Add more reels as needed
];

const Reels = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reelsData.map((reel) => (
          <UserReelsCard
            key={reel.id}
            views={reel.views}
            title={reel.title}
            isPinned={reel.isPinned}
          />
        ))}
      </div>
    </div>
  );
};

export default Reels;
