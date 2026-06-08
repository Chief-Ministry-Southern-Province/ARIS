export interface LostItem {
  description: string;
  quantity: string;
  unit: string;
  value: string;
}

export interface Officer {
  name: string;
  designation: string;
}

export interface FR104_3Data {
  department: string;
  date: string;
  place: string;
  loss: string;

  natureOfLoss: string;
  causeOfLoss: string;

  policeStation: string;
  policeReportDate: string;

  investigation: string;
  securityArrangements: string;
  preventionArrangements: string;

  headOfDepartment: string;
  approvalDate: string;

  items: LostItem[];
  officers: Officer[];
}