import { Download } from "lucide-react";
import Modal from "@/components/molecules/Modal";

interface PdfPreviewModalProps {
  filename: string;
  pdfUrl: string;
  onClose: () => void;
}

const PdfPreviewModal = ({
  filename,
  pdfUrl,
  onClose,
}: PdfPreviewModalProps) => (
  <Modal onClose={onClose}>
    <div className="flex items-center justify-between gap-4 pb-4">
      <h2 className="text-lg font-semibold text-slate-900">PDF Preview</h2>
      <a
        href={pdfUrl}
        download={filename}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Download size={16} />
        Download
      </a>
    </div>

    <iframe
      title={`${filename} preview`}
      src={pdfUrl}
      className="h-[75vh] w-full rounded-lg border border-slate-200"
    />
  </Modal>
);

export default PdfPreviewModal;
