export const queryKeys = {
  accidents: {
    all: ["accidents"] as const,
    list: (page: number, search = "", status = "", severity = "") => ["accidents", "list", { page, search, status, severity }] as const,
    detail: (id: number) => ["accidents", "detail", id] as const,
  },
  cases: {
    all: ["cases"] as const,
    list: (page: number, search = "") => ["cases", "list", { page, search }] as const,
    detail: (id: number) => ["cases", "detail", id] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    list: (page: number, search = "") => ["vehicles", "list", { page, search }] as const,
    detail: (id: number) => ["vehicles", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (page: number, search = "") => ["users", "list", { page, search }] as const,
    detail: (id: number) => ["users", "detail", id] as const,
    drivers: ["users", "available-drivers"] as const,
  },
  institutions: {
    all: ["institutions"] as const,
    list: (page: number, search = "") => ["institutions", "list", { page, search }] as const,
    detail: (id: number) => ["institutions", "detail", id] as const,
    types: ["institutions", "types"] as const,
    parents: ["institutions", "parents"] as const,
    visible: ["institutions", "visible"] as const,
  },

  evidence: (accidentId: number) => ["evidence", accidentId] as const,

  timeline: (caseId: number) => ["timeline", caseId] as const,

  fr1043: (caseId: number) => ["fr1043", caseId] as const,
  fr1044: (caseId: number) => ["fr1044", caseId] as const,

  approvals: {
    all: ["approvals"] as const,
    pending: (page: number, search: string) => ["approvals", "pending", page, search] as const,
    decided: (page: number, search: string, documentType: string, status: string) => ["approvals", "decided", page, search, documentType, status] as const,
    stats: ["approvals", "stats"] as const,
    history: (caseId: number, documentType?: string, revision?: number) => ["approvals", "history", caseId, documentType, revision] as const,
    document: (id: number) => ["approvals", "document", id] as const,
  },
  auth: { profile: ["auth", "profile"] as const },
  
} as const;
