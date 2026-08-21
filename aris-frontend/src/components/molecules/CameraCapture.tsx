import { Camera, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";

type CameraCaptureProps = {
  onCapture: (file: File) => void;
  onClose: () => void;
};

/** Captures a photo locally; no image is uploaded until the report is saved. */
export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setError("");

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError(t("report.camera.cameraAccessError"));
    }
  };

  useEffect(() => {
    void startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `accident-photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    void startCamera();
  };

  const confirm = async () => {
    if (!previewUrl) return;
    const blob = await fetch(previewUrl).then((response) => response.blob());
    onCapture(new File([blob], `accident-photo-${Date.now()}.jpg`, { type: "image/jpeg" }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label={t("report.camera.cameraTitle")}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{t("report.camera.cameraTitle")}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={t("report.camera.closeCamera")}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>
        ) : previewUrl ? (
          <img src={previewUrl} alt="Captured accident evidence" className="max-h-[60vh] w-full rounded-xl object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="max-h-[60vh] w-full rounded-xl bg-slate-900 object-contain" />
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {previewUrl ? (
            <>
              <Button type="button" variant="secondary" onClick={retake}><RefreshCw className="mr-2 h-4 w-4" />{t("report.camera.retake")}</Button>
              <Button type="button" onClick={() => void confirm()}>{t("report.camera.usePhoto")}</Button>
            </>
          ) : (
            <Button type="button" onClick={capture} disabled={Boolean(error)}><Camera className="mr-2 h-4 w-4" />{t("report.camera.capturePhoto")}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
