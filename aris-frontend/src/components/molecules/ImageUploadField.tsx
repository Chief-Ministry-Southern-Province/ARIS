import { useState } from "react";
import { Camera, Upload, X, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CameraCapture } from "@/components/molecules/CameraCapture";

interface ImageUploadFieldProps {
  multiple?: boolean;
  accept?: string;
  enableCamera?: boolean;
  onChange?: (files: File[]) => void;
}

export const ImageUploadField = ({
  multiple = true,
  accept = "image/*",
  enableCamera = false,
  onChange,
}: ImageUploadFieldProps) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const addFiles = (files: File[]) => {
    const updatedImages = [...images, ...files];
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    addFiles(files);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter(
      (_, i) => i !== index
    );

    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  return (
    <div className="space-y-4">
      {showCamera && (
        <CameraCapture
          onCapture={(file) => addFiles([file])}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Upload Area */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="group relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 transition-transform group-hover:scale-105">
              <Upload className="h-7 w-7 text-blue-600" />
            </div>

            <h3 className="font-medium text-gray-800">{t("report.UploadEvidenceImages")}</h3>

            <p className="mt-1 text-sm text-gray-500">{t("report.camera.browsePhotos")}</p>

            <p className="mt-2 text-xs text-gray-400">{t("report.camera.supportedImages")}</p>
          </div>
        </label>

        {enableCamera && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="group flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 transition-all hover:border-blue-500 hover:bg-blue-100 dark:border-blue-700/80 dark:bg-blue-950/70 dark:hover:border-blue-500 dark:hover:bg-blue-900/65 lg:hidden"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 transition-transform group-hover:scale-105 dark:bg-blue-900">
              <Camera className="h-7 w-7 text-white dark:text-blue-100" />
            </div>
            <h3 className="font-medium text-slate-800 dark:text-slate-100">{t("report.camera.takePhoto")}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{t("report.camera.useDeviceCamera")}</p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-400">{t("report.camera.permissionRequired")}</p>
          </button>
        )}
      </div>

      {/* Count */}
      {images.length > 0 && (
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-600" />

          <span className="text-sm font-medium text-gray-700">
            {images.length} image
            {images.length > 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((file, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 sm:h-40 object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 transition"
              >
                <X size={14} />
              </button>

              {/* Filename */}
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">
                  {file.name}
                </p>

                <p className="text-[11px] text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
