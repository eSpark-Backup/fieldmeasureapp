export type toolNames =
  | 'Tape'
  | 'Laser'
  | 'Rake'
  | 'Rectangle'
  | 'Corner'
  | 'Note'
  | 'RoundUp';

export type Coords = {
  x: number[]; // You can replace `any` with a more specific type if you know it
  y: number[]; // You can replace `any` with a more specific type if you know it
};

export type ToolData = {
  coords: Coords; // You can replace `any` with a more specific type if you know it
  status: boolean;
};

export type Measure = {
  id: string;
  location: any;
  details: any;
  timestamp: number;
  toolsData: Record<string, ToolData>;
  photo: string;
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
