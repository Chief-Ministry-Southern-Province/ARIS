import type { SignatureCaption, Signatory } from "@/types/signature.type";

interface SignatureCaptionPreviewProps {
  user: Signatory;
  caption?: SignatureCaption;
}

export default function SignatureCaptionPreview({
  user,
  caption,
}: SignatureCaptionPreviewProps) {
  const lines = [
    caption?.display_name || user.name,
    caption?.designation || user.role,
    caption?.institution_name,
    ...(caption?.institution_lines ?? []),
  ].filter(Boolean);

  return (
    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-slate-300">
      {lines.map((line, index) => (
        <p key={index} className="truncate">{line}</p>
      ))}
    </div>
  );
}
