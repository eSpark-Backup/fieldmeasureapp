import { toolNames } from '../types';

export const DROPDOWNS = [
  {
    data: [
      'Clear',
      'Low Iron',
      'Starphire',
      'Optiwhite',
      'Grey Tinted',
      'Bronze Tinted',
      'Acid Etched',
      'TBD',
    ],
    placeholder: 'Select Glass Clarity',
    title: 'Glass Clarity',
    id: 'glassClarity',
    selected: '',
  },
  {
    data: ['10mm', '12mm', 'TBD'],
    placeholder: 'Select Glass Thickness',
    title: 'Glass Thickness',
    id: 'glassThickness',
    selected: '',
  },
  {
    data: [
      'Chrome',
      'Matte Black',
      'Brushed Nickel',
      'Brushed Gold',
      'Polished Nickel',
      'TBD',
    ],
    placeholder: 'Select Hardware Finish',
    title: 'Hardware Finish',
    id: 'hardwareFinish',
    selected: '',
  },
  {
    data: [
      '6x6',
      '8x8',
      '6x18',
      '8x18',
      '6x24',
      '8x24',
      '18',
      '24',
      '18x18',
      '24x24',
      'TBD',
    ],
    placeholder: 'Select Handle Size',
    title: 'Handle Size',
    id: 'handleSize',
    selected: '',
  },
  {
    data: [
      'Round',
      'Square',
      'Mitered',
      'Ladder',
      'Traditional Knob',
      'Cylinder Knob',
      'Square Knob',
      'Paddle',
      'Other',
      'TBD',
    ],
    placeholder: 'Select Handle Type',
    title: 'Handle Type',
    id: 'handleType',
    selected: '',
  },
  {
    data: ['Yes', 'No'],
    placeholder: 'Select DFI Option',
    title: 'DFI',
    id: 'dfi',
    selected: '',
  },
  {
    data: ['Yes', 'No'],
    placeholder: 'Select Backslope',
    title: 'Backslope',
    id: 'backslope',
    selected: '',
  },
  {
    data: ['Yes', 'No'],
    placeholder: 'Select Existing Damage',
    title: 'Existing Damage',
    id: 'existingDamage',
    selected: '',
  },

  {
    data: ['Center', 'Offset In', 'Offset Out', 'TBD'],
    placeholder: 'Select Curb Offset',
    title: 'Curb Offset',
    id: 'curbOffset',
    selected: '',
  },
];

export const TECHS = {
  data: [
    'James Carter',
    'Liam Bennett',
    'Ayaan Malik',
    'Noah Thompson',
    'Omar Rahman',
  ],
  placeholder: 'Select Technician',
  title: 'Technicians',
  id: 'technicians',
  selected: '',
};

export const INPUT_FIELDS = [
  {
    label: 'Curb/Tub Height',
    field: 'curbHeight',
    placeholder: 'Enter Height in inches',
  },
  {
    label: 'Door Width',
    field: 'doorWidth',
    placeholder: 'Enter Width in inches',
  },
  {
    label: 'Door Height',
    field: 'doorHeight',
    placeholder: 'Enter Height in inches',
  },
];

export const TOOLS: toolNames[] = [
  'Tape',
  'Laser',
  'Rake',
  'Rectangle',
  'Corner',
  'Note',
  'RoundUp',
];
export const cornerLabels = [
  'Top L A',
  'Top R A',
  'Top R B',
  'Top L B',
  'Left A',
  'Left B',
  'Center A',
  'Center B',
  'Right A',
  'Right B',
  'Bot L A',
  'Bot L B',
  'Bot R A',
  'Bot R B',
];

export const rectangleLabels = [
  'Top A',
  'Top B',
  'Right A',
  'Right B',
  'Bot A',
  'Bot B',
  'Left A',
  'Left B',
];

export const fractionalInches = [
  '0',
  '1/16',
  '1/8',
  '3/16',
  '1/4',
  '5/16',
  '3/8',
  '7/16',
  '1/2',
  '9/16',
  '5/8',
  '11/16',
  '3/4',
  '13/16',
  '7/8',
  '15/16',
];

const Project = {
  qouteNumber: 'HJJHB123',
  name: 'HJJHB123',
  address: 'HJJHB123',
  techName: 'HJJHB123',
  date: 'HJJHB123',
};
