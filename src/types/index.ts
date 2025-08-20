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

export type MeasurementPair = { value: string; fraction: string };

export type BaseItem = {
  id: string;
  locked: boolean;
  hidden: boolean;
};

export type TapeItem = BaseItem & {
  type: 'Tape';
  data: { value: string; fraction: string };
};

export type LaserItem = BaseItem & {
  type: 'Laser';
  data: {
    SlideA: MeasurementPair;
    SlideB: MeasurementPair;
  };
};

export type RakeItem = BaseItem & {
  type: 'Rake';
  data: {
    value: string;
    fraction: string;
    distance: MeasurementPair;
  };
  showDist: boolean;
};

export type RectangleItem = BaseItem & {
  type: 'Rectangle';
  data: Record<
    'TopA' | 'TopB' | 'RightA' | 'RightB' | 'BotA' | 'BotB' | 'LeftA' | 'LeftB',
    MeasurementPair
  >;
};

export type CornerItem = BaseItem & {
  type: 'Corner';
  data: Record<
    | 'TopLA'
    | 'TopLB'
    | 'TopRA'
    | 'TopRB'
    | 'RightA'
    | 'RightB'
    | 'CenterA'
    | 'CenterB'
    | 'LeftA'
    | 'LeftB'
    | 'BotLA'
    | 'BotLB'
    | 'BotRA'
    | 'BotRB',
    MeasurementPair
  >;
};

export type NoteItem = BaseItem & { type: 'Note'; data: { value: string } };

export type Tool =
  | TapeItem
  | LaserItem
  | RakeItem
  | RectangleItem
  | CornerItem
  | NoteItem;

export type ToolsList = Tool[];

export type OnChange = (items: Tool[]) => void;
