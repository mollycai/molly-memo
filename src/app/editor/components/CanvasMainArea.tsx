"use client";

import { RefObject } from "react";

interface CanvasMainAreaProps {
  containerRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export function CanvasMainArea({ containerRef, canvasRef }: CanvasMainAreaProps) {
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
      }}
      className="flex-1 flex items-center justify-center relative"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
