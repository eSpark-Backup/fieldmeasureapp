import { Dimensions } from 'react-native';
import { Tool } from '../../../types';
import uuid from 'react-native-uuid';

const { width, height } = Dimensions.get('screen');

export const pdfHTML = (uri: string) => {
  return `<style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 80%;
    }

    td,
    th {
      text-align: left;
      padding: 2px;
    }
    th {
      padding-block: 8px;
    }
  </style>
  <h2>Measurement Report</h2>
  <p>Quote: 12323as</p>
  <p>Client: John</p>
  <p>Client: John</p>
  <p>Date: 7/17/2025</p>

  <img src=${uri} alt="Image" width=${width - 40} height=${height * 0.8} />

  <h2>Measurements (Total 5)</h2>
  <table>
    <tr>
      <th>Label</th>
      <th>Type</th>
      <th>Value</th>
      <th>Area</th>
    </tr>
    <tr>
      <td>Note1</td>
      <td>NOTE</td>
      <td>511px</td>
      <td>Attach Bath</td>
    </tr>
    <tr>
      <td>Note1</td>
      <td>NOTE</td>
      <td>511px</td>
      <td>Attach Bath</td>
    </tr>
    <tr>
      <td>Note1</td>
      <td>NOTE</td>
      <td>511px</td>
      <td>Attach Bath</td>
    </tr>
    <tr>
      <td>Note1</td>
      <td>NOTE</td>
      <td>511px</td>
      <td>Attach Bath</td>
    </tr>
    <tr>
      <td>Note1</td>
      <td>NOTE</td>
      <td>511px</td>
      <td>Attach Bath</td>
    </tr>
  </table>`;
};

const getRandomDarkHexColor = () => {
  // Keep colors between 50–180 (medium-dark range)
  const r = Math.floor(50 + Math.random() * 130);
  const g = Math.floor(50 + Math.random() * 130);
  const b = Math.floor(50 + Math.random() * 130);

  const hex = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return hex.toUpperCase();
};

export const createNewTool = (type: Tool['type']): Tool => {
  const baseId = `${type.toLowerCase()}${uuid.v4()}`;

  const initialNX = [5];
  const initialNY = [5];

  const initialX = [5, 5];
  const initialY = [5, 50];

  console.log('initialX', initialX);

  const initialRX = [5, 5, 80, 80];
  const initialRY = [5, 50, 50, 5];

  const initialCX = [5, 5, 40, 80, 80, 40];

  const initialCY = [5, 50, 50, 50, 5, 5];

  const toolColor = getRandomDarkHexColor();

  switch (type) {
    case 'Tape':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: { value: '', fraction: '', focused: false },
        xCoords: initialX,
        yCoords: initialY,
        locked: false,
        hidden: false,
      };
    case 'Laser':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: {
          SideA: { value: '', fraction: '', focused: false },
          SideB: { value: '', fraction: '', focused: false },
        },
        xCoords: initialX,
        yCoords: initialY,
        locked: false,
        hidden: false,
      };
    case 'Rake':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: {
          value: '',
          fraction: '',
          focused: false,
          distance: { value: '', fraction: '', focused: false },
        },
        xCoords: initialX,
        yCoords: initialY,
        xCoordsDist: [initialX[0], initialX[1] / 0.8],
        yCoordsDist: [initialY[0], initialY[1] / 0.8],
        showDist: false,
        locked: false,
        hidden: false,
      };
    case 'Rectangle':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: {
          TopA: { value: '', fraction: '', focused: false },
          TopB: { value: '', fraction: '', focused: false },
          RightA: { value: '', fraction: '', focused: false },
          RightB: { value: '', fraction: '', focused: false },
          BotA: { value: '', fraction: '', focused: false },
          BotB: { value: '', fraction: '', focused: false },
          LeftA: { value: '', fraction: '', focused: false },
          LeftB: { value: '', fraction: '', focused: false },
        },
        xCoords: initialRX,
        yCoords: initialRY,
        locked: false,
        hidden: false,
      };
    case 'Corner':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: {
          TopLA: { value: '', fraction: '', focused: false },
          TopLB: { value: '', fraction: '', focused: false },
          TopRA: { value: '', fraction: '', focused: false },
          TopRB: { value: '', fraction: '', focused: false },
          RightA: { value: '', fraction: '', focused: false },
          RightB: { value: '', fraction: '', focused: false },
          CenterA: { value: '', fraction: '', focused: false },
          CenterB: { value: '', fraction: '', focused: false },
          LeftA: { value: '', fraction: '', focused: false },
          LeftB: { value: '', fraction: '', focused: false },
          BotLA: { value: '', fraction: '', focused: false },
          BotLB: { value: '', fraction: '', focused: false },
          BotRA: { value: '', fraction: '', focused: false },
          BotRB: { value: '', fraction: '', focused: false },
        },
        xCoords: initialCX,
        yCoords: initialCY,
        locked: false,
        hidden: false,
      };
    case 'Note':
      return {
        id: baseId,
        color: toolColor,
        type,
        data: { value: '', focused: false },
        xCoords: initialNX,
        yCoords: initialNY,
        locked: false,
        hidden: false,
      };
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};
