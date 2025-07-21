import { toolNames } from '../types';

export const DROPDOWNS = [
  {
    data: ['Clear', 'Frosted', 'Tinted', 'Clear', 'Frosted', 'Tinted'],
    placeholder: 'Select Glass Clarity',
    title: 'Glass Clarity',
    id: 'glassClarity',
    selected: '',
  },
  {
    data: ['1/4"', '3/8"', '1/2"'],
    placeholder: 'Select Glass Thickness',
    title: 'Glass Thickness',
    id: 'glassThickness',
    selected: '',
  },
  {
    data: ['Chrome', 'Brushed Nickel', 'Matte Black'],
    placeholder: 'Select Hardware Finish',
    title: 'Hardware Finish',
    id: 'hardwareFinish',
    selected: '',
  },
  {
    data: ['Small', 'Medium', 'Large'],
    placeholder: 'Select Handle Size',
    title: 'Handle Size',
    id: 'handleSize',
    selected: '',
  },
  {
    data: ['Knob', 'Bar', 'Custom'],
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
    data: ['1°', '3°', '5°'],
    placeholder: 'Select Backslope',
    title: 'Backslope',
    id: 'backslope',
    selected: '',
  },
  {
    data: ['None', 'Scratch', 'Crack'],
    placeholder: 'Select Existing Damage',
    title: 'Existing Damage',
    id: 'existingDamage',
    selected: '',
  },
  {
    data: ['2 in', '4 in', '6 in'],
    placeholder: 'Select Curb/Tub Height',
    title: 'Curb/Tub Height',
    id: 'curbTubHeight',
    selected: '',
  },
  {
    data: ['Left', 'Center', 'Right'],
    placeholder: 'Select Curb Offset',
    title: 'Curb Offset',
    id: 'curbOffset',
    selected: '',
  },
  {
    data: ['22"', '24"', '26"'],
    placeholder: 'Select Door Width',
    title: 'Door Width',
    id: 'doorWidth',
    selected: '',
  },
  {
    data: ['72"', '76"', '80"'],
    placeholder: 'Select Door Height',
    title: 'Door Height',
    id: 'doorHeight',
    selected: '',
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
