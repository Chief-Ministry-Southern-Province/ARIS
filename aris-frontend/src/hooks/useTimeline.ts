import timelineService from "@/services/timeline.service";

import { useState, useEffect } from "react";
import type { TimelineEntry } from "@/types/timeline.type";

export const useTimeline = (caseId: number | string) => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await timelineService.getCaseTimeline(caseId);
        setTimeline(data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch timeline";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [caseId]);

  return { timeline, loading, error };
};