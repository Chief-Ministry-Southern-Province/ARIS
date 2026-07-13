import api from "./api";

import type { TimelineResponse, TimelineEntry } from "@/types/timeline.type";

const timelineService = {

  getCaseTimeline: async (caseId: number | string): Promise<TimelineEntry[]> => {
    const response = await api.get<TimelineResponse>(
      `/cases/${caseId}/history`
    );
    return response.data.data;
  },
};

export default timelineService;