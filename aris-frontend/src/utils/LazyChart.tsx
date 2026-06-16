import { type ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface LazyChartProps {
  children: ReactNode;
}

export default function LazyChart({
  children,
}: LazyChartProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  return (
    <div ref={ref}>
      {inView ? (
        children
      ) : (
        <div className="h-70 rounded-sm animate-pulse bg-slate-200" />
      )}
    </div>
  );
}