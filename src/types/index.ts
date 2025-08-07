export type toolNames =
  | 'Tape'
  | 'Laser'
  | 'Rake'
  | 'Rectangle'
  | 'Corner'
  | 'Note'
  | 'RoundUp';

export type Measure = {
  id: string;
  location: any;
  details: any;
  timestamp: number;
};

export type Project = {
  id: number;
  qouteNumber: string;
  name: string;
  address: string;
  techName: string;
  date: string;
  measures?: Measure[]; // 👈 optional so it won’t break existing code
};
