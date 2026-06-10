import { X, Image, Shield } from "lucide-react";

interface Props {
  evidence: any;
  onClose: () => void;
}

export default function EvidencePreviewModal({
  evidence,
  onClose,
}: Props) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">
              {evidence.name}
            </h2>
            <p className="text-sm text-gray-500">
              {evidence.caseId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="h-72 bg-gray-50 flex items-center justify-center border-b">
          {evidence.type === "photo" ? (
            <div className="flex flex-col items-center">
              <Image className="w-24 h-24 text-blue-300" />
              <p className="text-gray-400 mt-3">
                Image Preview
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Shield className="w-24 h-24 text-red-300" />
              <p className="text-gray-400 mt-3">
                Police Report Preview
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-gray-500">
                Description
              </label>

              <p className="mt-1 text-sm text-gray-800">
                {evidence.description}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Uploaded By
              </label>

              <p className="mt-1 text-sm text-gray-800">
                {evidence.uploadedBy}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Date
              </label>

              <p className="mt-1 text-sm text-gray-800">
                {evidence.date}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                File Size
              </label>

              <p className="mt-1 text-sm text-gray-800">
                {evidence.size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}