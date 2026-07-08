import { useRef, useState } from "react";

export const useSignatureCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const lastPosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const getPosition = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);

    lastPosition.current = getPosition(e);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (
      !canvasRef.current ||
      !isDrawing ||
      !lastPosition.current
    ) {
      return;
    }

    const ctx =
      canvasRef.current.getContext("2d");

    if (!ctx) return;

    const currentPosition =
      getPosition(e);

    ctx.beginPath();

    ctx.moveTo(
      lastPosition.current.x,
      lastPosition.current.y
    );

    ctx.lineTo(
      currentPosition.x,
      currentPosition.y
    );

    ctx.strokeStyle = "#1E40AF";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();

    lastPosition.current =
      currentPosition;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "#f8fafc";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.strokeStyle = "#e2e8f0";

    ctx.strokeRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const clearCanvas = () => {
    initializeCanvas();
  };

  const saveCanvas = () => {
    return canvasRef.current?.toDataURL(
      "image/png"
    );
  };

  return {
    canvasRef,
    initializeCanvas,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    saveCanvas,
  };
};