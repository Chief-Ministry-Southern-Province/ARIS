import { useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  multiple?: boolean;
  accept?: string;
  onChange?: (files: File[]) => void;
}

export const ImageUploadField = ({
  multiple = true,
  accept = "image/*",
  onChange,
}: ImageUploadFieldProps) => {
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    const updatedImages = [...images, ...files];

    setImages(updatedImages);
    onChange?.(updatedImages);
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
      {/* Upload Area */}
      <label className="group relative flex flex-col items-center justify-center w-full min-h-[180px] p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 text-blue-600" />
          </div>

          <h3 className="font-medium text-gray-800">
            Upload Evidence Images
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Click to browse or drag & drop photos
          </p>

          <p className="text-xs text-gray-400 mt-2">
            JPG, PNG, WEBP
          </p>
        </div>
      </label>

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