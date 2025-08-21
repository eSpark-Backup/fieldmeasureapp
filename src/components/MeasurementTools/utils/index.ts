import { MeasurementPair } from '../../../types';

function fractionToNumber(fraction: string): number {
  if (!fraction || fraction === '0') return 0;
  const [num, den] = fraction.split('/').map(Number);
  return den ? num / den : 0;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function numberToFraction(value: number, maxDenominator = 16): string {
  if (value === 0) return '0';

  const denominator = maxDenominator;
  const numerator = Math.round(value * denominator);

  // reduce fraction
  const divisor = gcd(numerator, denominator);
  const simpleNum = numerator / divisor;
  const simpleDen = denominator / divisor;

  return `${simpleNum}/${simpleDen}`;
}

export function formatInches(pair: MeasurementPair): string {
  const inches = pair.value || '0';
  const fraction = pair.fraction || '0';

  if (fraction !== '0' && inches !== '0') {
    return `${inches}-${fraction}"`;
  } else if (fraction !== '0' && inches === '0') {
    return `0-${fraction}"`; // <-- now shows 0-fraction
  } else if (inches !== '0') {
    return `${inches}"`;
  } else {
    return `0"`;
  }
}

export function formatInchesSum(
  pair1: MeasurementPair,
  pair2: MeasurementPair,
): string {
  const inchesAB = Number(pair1.value || '0') + Number(pair2.value || '0');
  const fractionAB =
    fractionToNumber(pair1.fraction || '0') +
    fractionToNumber(pair2.fraction || '0');

  // 🔹 If the fraction part adds up to exactly 1
  if (fractionAB === 1) {
    return `${inchesAB + 1}"`;
  }

  // 🔹 If fraction > 1 (e.g. 1.25, 2.5, etc.)
  if (fractionAB > 1) {
    return `${inchesAB + Math.floor(fractionAB)}-${numberToFraction(
      fractionAB % 1,
    )}"`;
  }

  // 🔹 If fraction is non-zero
  if (fractionAB !== 0) {
    if (inchesAB === 0) {
      return `0-${numberToFraction(fractionAB)}"`;
    }
    return `${inchesAB}-${numberToFraction(fractionAB)}"`;
  }

  // 🔹 If only inches
  if (inchesAB !== 0) {
    return `${inchesAB}"`;
  }

  return `0"`;
}
