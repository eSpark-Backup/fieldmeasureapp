export type toolNames =
  | 'Tape'
  | 'Laser'
  | 'Rake'
  | 'Rectangle'
  | 'Corner'
  | 'Note'
  | 'RoundUp';

export type Project = {
  id: number;
  qouteNumber: string;
  name: string;
  address: string;
  techName: string;
  date: string;
};
