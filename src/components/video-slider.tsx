"use client"; 

import { Asset,  VideoShort } from "@/generated/prisma";

interface VideoSliderProps {
  videos: (VideoShort & {
    asset: Asset | null;
  })[];
}
export function VideoSlider({ videos }: VideoSliderProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {videos.map((short) => (
        <div key={short.id} className="overflow-hidden rounded shadow">
          <video
            src={short.asset?.url}
            controls
            className="h-auto w-full object-cover"
          />
        
        </div>
      ))}
    </div>
  );
}


