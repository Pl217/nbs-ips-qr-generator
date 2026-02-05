// Type definitions matching qrcode-generator library
// Adapted using Claude to work the same as this code
// https://raw.githubusercontent.com/kazuhikoarase/qrcode-generator/refs/heads/master/js/dist/qrcode.js
// With its type definitions from
// https://raw.githubusercontent.com/kazuhikoarase/qrcode-generator/refs/heads/master/js/dist/qrcode.d.ts

type TypeNumber =
  | 0 // Auto-detect
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

type Mode = 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';

type QRCodeFactory = (
  typeNumber: TypeNumber,
  errorCorrectionLevel: ErrorCorrectionLevel
) => QRCode;

type QRCode = {
  addData(data: string, mode?: Mode): void;
  make(): void;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
  createDataURL(cellSize?: number, margin?: number): string;
  createImgTag(cellSize?: number, margin?: number, alt?: string): string;
  createSvgTag(cellSize?: number, margin?: number): string;
  createTableTag(cellSize?: number, margin?: number): string;
  createASCII(cellSize?: number, margin?: number): string;
  renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number): void;
};

// QR Code Constants
const PAD0 = 0xec;
const PAD1 = 0x11;

// Mode constants
const MODE_NUMBER = 1 << 0;
const MODE_ALPHA_NUM = 1 << 1;
const MODE_8BIT_BYTE = 1 << 2;
const MODE_KANJI = 1 << 3;

// Error correction level values
const EC_LEVEL_L = 1;
const EC_LEVEL_M = 0;
const EC_LEVEL_Q = 3;
const EC_LEVEL_H = 2;

const EC_LEVEL_MAP: Record<ErrorCorrectionLevel, number> = {
  L: EC_LEVEL_L,
  M: EC_LEVEL_M,
  Q: EC_LEVEL_Q,
  H: EC_LEVEL_H,
};

// Mask pattern functions
const MASK_PATTERNS: ((i: number, j: number) => boolean)[] = [
  (i, j) => (i + j) % 2 === 0,
  (i) => i % 2 === 0,
  (_, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
];

// RS Block table
type RSBlock = { totalCount: number; dataCount: number };

const RS_BLOCK_TABLE: (number[] | undefined)[] = [
  undefined,
  // Version 1
  [1, 26, 19],
  [1, 26, 16],
  [1, 26, 13],
  [1, 26, 9],
  // Version 2
  [1, 44, 34],
  [1, 44, 28],
  [1, 44, 22],
  [1, 44, 16],
  // Version 3
  [1, 70, 55],
  [1, 70, 44],
  [2, 35, 17],
  [2, 35, 13],
  // Version 4
  [1, 100, 80],
  [2, 50, 32],
  [2, 50, 24],
  [4, 25, 9],
  // Version 5
  [1, 134, 108],
  [2, 67, 43],
  [2, 33, 15, 2, 34, 16],
  [2, 33, 11, 2, 34, 12],
  // Version 6
  [2, 86, 68],
  [4, 43, 27],
  [4, 43, 19],
  [4, 43, 15],
  // Version 7
  [2, 98, 78],
  [4, 49, 31],
  [2, 32, 14, 4, 33, 15],
  [4, 39, 13, 1, 40, 14],
  // Version 8
  [2, 121, 97],
  [2, 60, 38, 2, 61, 39],
  [4, 40, 18, 2, 41, 19],
  [4, 40, 14, 2, 41, 15],
  // Version 9
  [2, 146, 116],
  [3, 58, 36, 2, 59, 37],
  [4, 36, 16, 4, 37, 17],
  [4, 36, 12, 4, 37, 13],
  // Version 10
  [2, 86, 68, 2, 87, 69],
  [4, 69, 43, 1, 70, 44],
  [6, 43, 19, 2, 44, 20],
  [6, 43, 15, 2, 44, 16],
  // Version 11
  [4, 101, 81],
  [1, 80, 50, 4, 81, 51],
  [4, 50, 22, 4, 51, 23],
  [3, 36, 12, 8, 37, 13],
  // Version 12
  [2, 116, 92, 2, 117, 93],
  [6, 58, 36, 2, 59, 37],
  [4, 46, 20, 6, 47, 21],
  [7, 42, 14, 4, 43, 15],
  // Version 13
  [4, 133, 107],
  [8, 59, 37, 1, 60, 38],
  [8, 44, 20, 4, 45, 21],
  [12, 33, 11, 4, 34, 12],
  // Version 14
  [3, 145, 115, 1, 146, 116],
  [4, 64, 40, 5, 65, 41],
  [11, 36, 16, 5, 37, 17],
  [11, 36, 12, 5, 37, 13],
  // Version 15
  [5, 109, 87, 1, 110, 88],
  [5, 65, 41, 5, 66, 42],
  [5, 54, 24, 7, 55, 25],
  [11, 36, 12, 7, 37, 13],
  // Version 16
  [5, 122, 98, 1, 123, 99],
  [7, 73, 45, 3, 74, 46],
  [15, 43, 19, 2, 44, 20],
  [3, 45, 15, 13, 46, 16],
  // Version 17
  [1, 135, 107, 5, 136, 108],
  [10, 74, 46, 1, 75, 47],
  [1, 50, 22, 15, 51, 23],
  [2, 42, 14, 17, 43, 15],
  // Version 18
  [5, 150, 120, 1, 151, 121],
  [9, 69, 43, 4, 70, 44],
  [17, 50, 22, 1, 51, 23],
  [2, 42, 14, 19, 43, 15],
  // Version 19
  [3, 141, 113, 4, 142, 114],
  [3, 70, 44, 11, 71, 45],
  [17, 47, 21, 4, 48, 22],
  [9, 39, 13, 16, 40, 14],
  // Version 20
  [3, 135, 107, 5, 136, 108],
  [3, 67, 41, 13, 68, 42],
  [15, 54, 24, 5, 55, 25],
  [15, 43, 15, 10, 44, 16],
  // Version 21
  [4, 144, 116, 4, 145, 117],
  [17, 68, 42],
  [17, 50, 22, 6, 51, 23],
  [19, 46, 16, 6, 47, 17],
  // Version 22
  [2, 139, 111, 7, 140, 112],
  [17, 74, 46],
  [7, 54, 24, 16, 55, 25],
  [34, 37, 13],
  // Version 23
  [4, 151, 121, 5, 152, 122],
  [4, 75, 47, 14, 76, 48],
  [11, 54, 24, 14, 55, 25],
  [16, 45, 15, 14, 46, 16],
  // Version 24
  [6, 147, 117, 4, 148, 118],
  [6, 73, 45, 14, 74, 46],
  [11, 54, 24, 16, 55, 25],
  [30, 46, 16, 2, 47, 17],
  // Version 25
  [8, 132, 106, 4, 133, 107],
  [8, 75, 47, 13, 76, 48],
  [7, 54, 24, 22, 55, 25],
  [22, 45, 15, 13, 46, 16],
  // Version 26
  [10, 142, 114, 2, 143, 115],
  [19, 74, 46, 4, 75, 47],
  [28, 50, 22, 6, 51, 23],
  [33, 46, 16, 4, 47, 17],
  // Version 27
  [8, 152, 122, 4, 153, 123],
  [22, 73, 45, 3, 74, 46],
  [8, 53, 23, 26, 54, 24],
  [12, 45, 15, 28, 46, 16],
  // Version 28
  [3, 147, 117, 10, 148, 118],
  [3, 73, 45, 23, 74, 46],
  [4, 54, 24, 31, 55, 25],
  [11, 45, 15, 31, 46, 16],
  // Version 29
  [7, 146, 116, 7, 147, 117],
  [21, 73, 45, 7, 74, 46],
  [1, 53, 23, 37, 54, 24],
  [19, 45, 15, 26, 46, 16],
  // Version 30
  [5, 145, 115, 10, 146, 116],
  [19, 75, 47, 10, 76, 48],
  [15, 54, 24, 25, 55, 25],
  [23, 45, 15, 25, 46, 16],
  // Version 31
  [13, 145, 115, 3, 146, 116],
  [2, 74, 46, 29, 75, 47],
  [42, 54, 24, 1, 55, 25],
  [23, 45, 15, 28, 46, 16],
  // Version 32
  [17, 145, 115],
  [10, 74, 46, 23, 75, 47],
  [10, 54, 24, 35, 55, 25],
  [19, 45, 15, 35, 46, 16],
  // Version 33
  [17, 145, 115, 1, 146, 116],
  [14, 74, 46, 21, 75, 47],
  [29, 54, 24, 19, 55, 25],
  [11, 45, 15, 46, 46, 16],
  // Version 34
  [13, 145, 115, 6, 146, 116],
  [14, 74, 46, 23, 75, 47],
  [44, 54, 24, 7, 55, 25],
  [59, 46, 16, 1, 47, 17],
  // Version 35
  [12, 151, 121, 7, 152, 122],
  [12, 75, 47, 26, 76, 48],
  [39, 54, 24, 14, 55, 25],
  [22, 45, 15, 41, 46, 16],
  // Version 36
  [6, 151, 121, 14, 152, 122],
  [6, 75, 47, 34, 76, 48],
  [46, 54, 24, 10, 55, 25],
  [2, 45, 15, 64, 46, 16],
  // Version 37
  [17, 152, 122, 4, 153, 123],
  [29, 74, 46, 14, 75, 47],
  [49, 54, 24, 10, 55, 25],
  [24, 45, 15, 46, 46, 16],
  // Version 38
  [4, 152, 122, 18, 153, 123],
  [13, 74, 46, 32, 75, 47],
  [48, 54, 24, 14, 55, 25],
  [42, 45, 15, 32, 46, 16],
  // Version 39
  [20, 147, 117, 4, 148, 118],
  [40, 75, 47, 7, 76, 48],
  [43, 54, 24, 22, 55, 25],
  [10, 45, 15, 67, 46, 16],
  // Version 40
  [19, 148, 118, 6, 149, 119],
  [18, 75, 47, 31, 76, 48],
  [34, 54, 24, 34, 55, 25],
  [20, 45, 15, 61, 46, 16],
];

// Pattern position table
const PATTERN_POSITION_TABLE: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

// G15 and G18 constants for BCH encoding
const G15 =
  (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G18 =
  (1 << 12) |
  (1 << 11) |
  (1 << 10) |
  (1 << 9) |
  (1 << 8) |
  (1 << 5) |
  (1 << 2) |
  (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

// Galois Field tables
const EXP_TABLE: number[] = new Array(256);
const LOG_TABLE: number[] = new Array(256);

// Initialize Galois Field tables
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x >= 256) {
      x ^= 0x11d;
    }
  }
  EXP_TABLE[255] = EXP_TABLE[0];
})();

// QRMath utility
const QRMath = {
  glog(n: number): number {
    if (n < 1) {
      throw new RangeError(`glog(${n})`);
    }
    return LOG_TABLE[n];
  },
  gexp(n: number): number {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return EXP_TABLE[n];
  },
};

// Polynomial class
class QRPolynomial {
  private num: number[];

  constructor(num: number[], shift: number = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
    for (let i = num.length - offset; i < this.num.length; i++) {
      this.num[i] = 0;
    }
  }

  getAt(index: number): number {
    return this.num[index];
  }

  getLength(): number {
    return this.num.length;
  }

  multiply(other: QRPolynomial): QRPolynomial {
    const num = new Array(this.getLength() + other.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < other.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(
          QRMath.glog(this.getAt(i)) + QRMath.glog(other.getAt(j))
        );
      }
    }
    return new QRPolynomial(num);
  }

  mod(other: QRPolynomial): QRPolynomial {
    if (this.getLength() - other.getLength() < 0) {
      return this;
    }
    const ratio = QRMath.glog(this.getAt(0)) - QRMath.glog(other.getAt(0));
    const num = [...this.num];
    for (let i = 0; i < other.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(other.getAt(i)) + ratio);
    }
    return new QRPolynomial(num).mod(other);
  }
}

// RS Block utility
const QRRSBlock = {
  getRSBlocks(typeNumber: number, errorCorrectionLevel: number): RSBlock[] {
    const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (!rsBlock) {
      throw new RangeError(
        `bad rs block @ typeNumber:${typeNumber}/errorCorrectionLevel:${errorCorrectionLevel}`
      );
    }

    const list: RSBlock[] = [];
    for (let i = 0; i < rsBlock.length; i += 3) {
      const count = rsBlock[i];
      const totalCount = rsBlock[i + 1];
      const dataCount = rsBlock[i + 2];
      for (let j = 0; j < count; j++) {
        list.push({ totalCount, dataCount });
      }
    }
    return list;
  },

  getRsBlockTable(
    typeNumber: number,
    errorCorrectionLevel: number
  ): number[] | undefined {
    switch (errorCorrectionLevel) {
      case EC_LEVEL_L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case EC_LEVEL_M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case EC_LEVEL_Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      case EC_LEVEL_H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 4];
      default:
        return undefined;
    }
  },
};

// BitBuffer class
class QRBitBuffer {
  private buffer: number[] = [];
  private length = 0;

  getBuffer(): number[] {
    return this.buffer;
  }

  getLengthInBits(): number {
    return this.length;
  }

  put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

// Data interfaces
type QRData = {
  getMode(): number;
  getLength(): number;
  write(buffer: QRBitBuffer): void;
};

// QR8BitByte class
class QR8BitByte implements QRData {
  private parsedData: number[] = [];

  constructor(data: string) {
    const bytes = new TextEncoder().encode(data);
    this.parsedData = [...bytes];
  }

  getMode(): number {
    return MODE_8BIT_BYTE;
  }

  getLength(): number {
    return this.parsedData.length;
  }

  write(buffer: QRBitBuffer): void {
    for (const byte of this.parsedData) {
      buffer.put(byte, 8);
    }
  }
}

// QRNumber class
class QRNumber implements QRData {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  getMode(): number {
    return MODE_NUMBER;
  }

  getLength(): number {
    return this.data.length;
  }

  write(buffer: QRBitBuffer): void {
    const data = this.data;
    let i = 0;
    while (i + 2 < data.length) {
      buffer.put(parseInt(data.substring(i, i + 3), 10), 10);
      i += 3;
    }
    if (i < data.length) {
      if (data.length - i === 1) {
        buffer.put(parseInt(data.substring(i, i + 1), 10), 4);
      } else if (data.length - i === 2) {
        buffer.put(parseInt(data.substring(i, i + 2), 10), 7);
      }
    }
  }
}

// QRAlphaNum class
class QRAlphaNum implements QRData {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  getMode(): number {
    return MODE_ALPHA_NUM;
  }

  getLength(): number {
    return this.data.length;
  }

  write(buffer: QRBitBuffer): void {
    const data = this.data;
    let i = 0;
    while (i + 1 < data.length) {
      buffer.put(
        QRAlphaNum.getCode(data.charAt(i)) * 45 +
          QRAlphaNum.getCode(data.charAt(i + 1)),
        11
      );
      i += 2;
    }
    if (i < data.length) {
      buffer.put(QRAlphaNum.getCode(data.charAt(i)), 6);
    }
  }

  static getCode(c: string): number {
    if (c >= '0' && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    if (c >= 'A' && c <= 'Z') {
      return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    }
    switch (c) {
      case ' ':
        return 36;
      case '$':
        return 37;
      case '%':
        return 38;
      case '*':
        return 39;
      case '+':
        return 40;
      case '-':
        return 41;
      case '.':
        return 42;
      case '/':
        return 43;
      case ':':
        return 44;
      default:
        throw new RangeError(`illegal char: ${c}`);
    }
  }
}

// QRKanji class
class QRKanji implements QRData {
  private bytes: number[];

  constructor(data: string) {
    // Encode as Shift_JIS
    this.bytes = QRKanji.encodeShiftJIS(data);
  }

  getMode(): number {
    return MODE_KANJI;
  }

  getLength(): number {
    return Math.floor(this.bytes.length / 2);
  }

  write(buffer: QRBitBuffer): void {
    const data = this.bytes;
    let i = 0;
    while (i + 1 < data.length) {
      let c = (data[i] << 8) | data[i + 1];
      if (c >= 0x8140 && c <= 0x9ffc) {
        c -= 0x8140;
      } else if (c >= 0xe040 && c <= 0xebbf) {
        c -= 0xc140;
      } else {
        throw new RangeError(`illegal char at ${i + 1}/${c}`);
      }
      c = ((c >>> 8) & 0xff) * 0xc0 + (c & 0xff);
      buffer.put(c, 13);
      i += 2;
    }
    if (i < data.length) {
      throw new RangeError(`illegal char at ${i + 1}`);
    }
  }

  static encodeShiftJIS(str: string): number[] {
    // Simple Shift_JIS encoder for common Kanji
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const sjis = QRKanji.unicodeToShiftJIS(code);
      if (sjis !== null) {
        if (sjis > 0xff) {
          bytes.push((sjis >> 8) & 0xff);
          bytes.push(sjis & 0xff);
        } else {
          bytes.push(sjis);
        }
      }
    }
    return bytes;
  }

  static unicodeToShiftJIS(unicode: number): number | null {
    // This is a simplified mapping - a full implementation would need a complete lookup table
    // For basic ASCII range
    if (unicode >= 0x20 && unicode <= 0x7e) {
      return unicode;
    }
    // For half-width katakana
    if (unicode >= 0xff61 && unicode <= 0xff9f) {
      return unicode - 0xff61 + 0xa1;
    }
    // For full-width characters and Kanji, we need a lookup table
    // This is a placeholder - full implementation requires SJIS mapping table
    const sjisMap = QRKanji.getSJISMap();
    const result = sjisMap.get(unicode);
    return result !== undefined ? result : null;
  }

  static getSJISMap(): Map<number, number> {
    // Minimal SJIS mapping for common characters
    // A complete implementation would have thousands of entries
    const map = new Map<number, number>();
    // Full-width digits
    for (let i = 0; i < 10; i++) {
      map.set(0xff10 + i, 0x824f + i);
    }
    // Full-width uppercase
    for (let i = 0; i < 26; i++) {
      map.set(0xff21 + i, 0x8260 + i);
    }
    // Full-width lowercase
    for (let i = 0; i < 26; i++) {
      map.set(0xff41 + i, 0x8281 + i);
    }
    // Common punctuation
    map.set(0x3000, 0x8140); // Ideographic space
    map.set(0x3001, 0x8141); // Ideographic comma
    map.set(0x3002, 0x8142); // Ideographic full stop
    return map;
  }
}

// QRUtil functions
const QRUtil = {
  getPatternPosition(typeNumber: number): number[] {
    return PATTERN_POSITION_TABLE[typeNumber - 1] ?? [];
  },

  getMaskFunction(maskPattern: number): (i: number, j: number) => boolean {
    const fn = MASK_PATTERNS[maskPattern];
    if (!fn) {
      throw new RangeError(`bad maskPattern: ${maskPattern}`);
    }
    return fn;
  },

  getLostPoint(qrcode: QRCodeModel): number {
    const moduleCount = qrcode.getModuleCount();
    let lostPoint = 0;

    // LEVEL1: Same color in row/column
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrcode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r === 0 && c === 0) {
              continue;
            }
            if (dark === qrcode.isDark(row + r, col + c)) {
              sameCount++;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }

    // LEVEL2: 2x2 blocks
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrcode.isDark(row, col)) {
          count++;
        }
        if (qrcode.isDark(row + 1, col)) {
          count++;
        }
        if (qrcode.isDark(row, col + 1)) {
          count++;
        }
        if (qrcode.isDark(row + 1, col + 1)) {
          count++;
        }
        if (count === 0 || count === 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3: Finder-like patterns
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row, col + 1) &&
          qrcode.isDark(row, col + 2) &&
          qrcode.isDark(row, col + 3) &&
          qrcode.isDark(row, col + 4) &&
          !qrcode.isDark(row, col + 5) &&
          qrcode.isDark(row, col + 6)
        ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row + 1, col) &&
          qrcode.isDark(row + 2, col) &&
          qrcode.isDark(row + 3, col) &&
          qrcode.isDark(row + 4, col) &&
          !qrcode.isDark(row + 5, col) &&
          qrcode.isDark(row + 6, col)
        ) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4: Dark ratio
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrcode.isDark(row, col)) {
          darkCount++;
        }
      }
    }
    const ratio =
      Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  },

  getBCHTypeInfo(data: number): number {
    let d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15) >= 0) {
      d ^= G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15));
    }
    return ((data << 10) | d) ^ G15_MASK;
  },

  getBCHTypeNumber(data: number): number {
    let d = data << 12;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G18) >= 0) {
      d ^= G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G18));
    }
    return (data << 12) | d;
  },

  getBCHDigit(data: number): number {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  },

  getMode(s: string): number {
    if (QRUtil.isAlphaNum(s)) {
      if (QRUtil.isNumber(s)) {
        return MODE_NUMBER;
      }
      return MODE_ALPHA_NUM;
    }
    if (QRUtil.isKanji(s)) {
      return MODE_KANJI;
    }
    return MODE_8BIT_BYTE;
  },

  isNumber(s: string): boolean {
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (c < '0' || c > '9') {
        return false;
      }
    }
    return true;
  },

  isAlphaNum(s: string): boolean {
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (
        !(
          (c >= '0' && c <= '9') ||
          (c >= 'A' && c <= 'Z') ||
          ' $%*+-./:'.includes(c)
        )
      ) {
        return false;
      }
    }
    return true;
  },

  isKanji(s: string): boolean {
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      // Check if character is in Kanji/CJK range
      if (
        !(
          (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
          (code >= 0x3040 && code <= 0x309f) || // Hiragana
          (code >= 0x30a0 && code <= 0x30ff) || // Katakana
          (code >= 0xff00 && code <= 0xffef) // Full-width characters
        )
      ) {
        return false;
      }
    }
    return true;
  },

  getLengthInBits(mode: number, type: number): number {
    if (1 <= type && type < 10) {
      switch (mode) {
        case MODE_NUMBER:
          return 10;
        case MODE_ALPHA_NUM:
          return 9;
        case MODE_8BIT_BYTE:
          return 8;
        case MODE_KANJI:
          return 8;
        default:
          throw new RangeError(`mode: ${mode}`);
      }
    } else if (type < 27) {
      switch (mode) {
        case MODE_NUMBER:
          return 12;
        case MODE_ALPHA_NUM:
          return 11;
        case MODE_8BIT_BYTE:
          return 16;
        case MODE_KANJI:
          return 10;
        default:
          throw new RangeError(`mode: ${mode}`);
      }
    } else if (type < 41) {
      switch (mode) {
        case MODE_NUMBER:
          return 14;
        case MODE_ALPHA_NUM:
          return 13;
        case MODE_8BIT_BYTE:
          return 16;
        case MODE_KANJI:
          return 12;
        default:
          throw new RangeError(`mode: ${mode}`);
      }
    }
    throw new RangeError(`type: ${type}`);
  },
};

// Error correction polynomial cache
const getErrorCorrectPolynomial = (
  errorCorrectLength: number
): QRPolynomial => {
  let a = new QRPolynomial([1]);
  for (let i = 0; i < errorCorrectLength; i++) {
    a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)]));
  }
  return a;
};

// QRCode Model
class QRCodeModel {
  private typeNumber: number;
  private errorCorrectionLevel: number;
  private modules: (boolean | null)[][] | null = null;
  private moduleCount = 0;
  private dataCache: number[] | null = null;
  private dataList: QRData[] = [];

  constructor(typeNumber: number, errorCorrectionLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectionLevel = errorCorrectionLevel;
  }

  addData(data: QRData): void {
    this.dataList.push(data);
    this.dataCache = null;
  }

  getDataList(): QRData[] {
    return this.dataList;
  }

  isDark(row: number, col: number): boolean {
    if (
      row < 0 ||
      this.moduleCount <= row ||
      col < 0 ||
      this.moduleCount <= col
    ) {
      throw new RangeError(`${row},${col}`);
    }
    const modules = this.modules;
    if (!modules) {
      return false;
    }
    const rowData = modules[row];
    if (!rowData) {
      return false;
    }
    return rowData[col] === true;
  }

  getModuleCount(): number {
    return this.moduleCount;
  }

  getTypeNumber(): number {
    return this.typeNumber;
  }

  setTypeNumber(typeNumber: number): void {
    this.typeNumber = typeNumber;
  }

  make(): void {
    if (this.typeNumber < 1) {
      let typeNumber = 1;
      for (; typeNumber < 40; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(
          typeNumber,
          this.errorCorrectionLevel
        );
        const buffer = new QRBitBuffer();
        let totalDataCount = 0;
        for (const block of rsBlocks) {
          totalDataCount += block.dataCount;
        }

        for (const data of this.dataList) {
          buffer.put(data.getMode(), 4);
          buffer.put(
            data.getLength(),
            QRUtil.getLengthInBits(data.getMode(), typeNumber)
          );
          data.write(buffer);
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      this.typeNumber = typeNumber;
    }
    this.makeImpl(false, this.getBestMaskPattern());
  }

  private getBestMaskPattern(): number {
    let minLostPoint = 0;
    let pattern = 0;

    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(this);
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  }

  private makeImpl(test: boolean, maskPattern: number): void {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = [];
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules.push([]);
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row].push(null);
      }
    }

    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }

    if (this.dataCache === null) {
      this.dataCache = QRCodeModel.createData(
        this.typeNumber,
        this.errorCorrectionLevel,
        this.dataList
      );
    }

    this.mapData(this.dataCache, maskPattern);
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) {
        continue;
      }
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) {
          continue;
        }
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules![row + r][col + c] = true;
        } else {
          this.modules![row + r][col + c] = false;
        }
      }
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = QRUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules![row][col] !== null) {
          continue;
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (
              r === -2 ||
              r === 2 ||
              c === -2 ||
              c === 2 ||
              (r === 0 && c === 0)
            ) {
              this.modules![row + r][col + c] = true;
            } else {
              this.modules![row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  private setupTimingPattern(): void {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules![r][6] !== null) {
        continue;
      }
      this.modules![r][6] = r % 2 === 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules![6][c] !== null) {
        continue;
      }
      this.modules![6][c] = c % 2 === 0;
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectionLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    // Vertical
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) {
        this.modules![i][8] = mod;
      } else if (i < 8) {
        this.modules![i + 1][8] = mod;
      } else {
        this.modules![this.moduleCount - 15 + i][8] = mod;
      }
    }

    // Horizontal
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 8) {
        this.modules![8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules![8][15 - i - 1 + 1] = mod;
      } else {
        this.modules![8][15 - i - 1] = mod;
      }
    }

    // Fixed dark module
    this.modules![this.moduleCount - 8][8] = !test;
  }

  private setupTypeNumber(test: boolean): void {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber);

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules![Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] =
        mod;
    }

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules![(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] =
        mod;
    }
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) {
        col--;
      }

      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules![row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            }
            const mask = maskFunc(row, col - c);
            if (mask) {
              dark = !dark;
            }
            this.modules![row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }

        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  static createData(
    typeNumber: number,
    errorCorrectionLevel: number,
    dataList: QRData[]
  ): number[] {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
    const buffer = new QRBitBuffer();

    for (const data of dataList) {
      buffer.put(data.getMode(), 4);
      buffer.put(
        data.getLength(),
        QRUtil.getLengthInBits(data.getMode(), typeNumber)
      );
      data.write(buffer);
    }

    let totalDataCount = 0;
    for (const block of rsBlocks) {
      totalDataCount += block.dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new RangeError(
        `code length overflow. (${buffer.getLengthInBits()} > ${totalDataCount * 8})`
      );
    }

    // Terminator
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    // Padding
    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false);
    }

    // Pad codewords
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }

    return QRCodeModel.createBytes(buffer, rsBlocks);
  }

  static createBytes(buffer: QRBitBuffer, rsBlocks: RSBlock[]): number[] {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata: number[][] = [];
    const ecdata: number[][] = [];

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = [];
      for (let i = 0; i < dcCount; i++) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;

      const rsPoly = getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);

      ecdata[r] = [];
      for (let i = 0; i < rsPoly.getLength() - 1; i++) {
        const modIndex = i + modPoly.getLength() - (rsPoly.getLength() - 1);
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (const block of rsBlocks) {
      totalCodeCount += block.totalCount;
    }

    const data: number[] = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }

    return data;
  }
}

// qrcode factory function
const qrcode: QRCodeFactory & {
  stringToBytes: (s: string) => number[];
  stringToBytesFuncs: Record<string, (s: string) => number[]>;
  createStringToBytes: (
    unicodeData: string,
    numChars: number
  ) => (s: string) => number[];
} = Object.assign(
  (
    typeNumber: TypeNumber,
    errorCorrectionLevel: ErrorCorrectionLevel
  ): QRCode => {
    const ecLevel = EC_LEVEL_MAP[errorCorrectionLevel];
    const model = new QRCodeModel(typeNumber, ecLevel);

    const escapeHtml = (s: string): string => {
      let result = '';
      for (const c of s) {
        switch (c) {
          case '<':
            result += '&lt;';
            break;
          case '>':
            result += '&gt;';
            break;
          case '&':
            result += '&amp;';
            break;
          case '"':
            result += '&quot;';
            break;
          default:
            result += c;
        }
      }
      return result;
    };

    const createDataURL = (
      cellSize: number = 2,
      margin: number = cellSize * 4
    ): string => {
      const mods = model.getModuleCount();
      const size = cellSize * mods + margin * 2;
      const canvas =
        typeof document !== 'undefined'
          ? document.createElement('canvas')
          : null;

      if (!canvas) {
        // Fallback for non-browser environments
        return '';
      }

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return '';
      }

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Draw modules
      ctx.fillStyle = '#000000';
      for (let row = 0; row < mods; row++) {
        for (let col = 0; col < mods; col++) {
          if (model.isDark(row, col)) {
            ctx.fillRect(
              margin + col * cellSize,
              margin + row * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      return canvas.toDataURL('image/png');
    };

    return {
      addData(data: string, mode?: Mode): void {
        let qrData: QRData;
        if (mode) {
          switch (mode) {
            case 'Numeric':
              qrData = new QRNumber(data);
              break;
            case 'Alphanumeric':
              qrData = new QRAlphaNum(data);
              break;
            case 'Kanji':
              qrData = new QRKanji(data);
              break;
            case 'Byte':
            default:
              qrData = new QR8BitByte(data);
              break;
          }
        } else {
          const detectedMode = QRUtil.getMode(data);
          switch (detectedMode) {
            case MODE_NUMBER:
              qrData = new QRNumber(data);
              break;
            case MODE_ALPHA_NUM:
              qrData = new QRAlphaNum(data);
              break;
            case MODE_KANJI:
              qrData = new QRKanji(data);
              break;
            case MODE_8BIT_BYTE:
            default:
              qrData = new QR8BitByte(data);
              break;
          }
        }
        model.addData(qrData);
      },

      make(): void {
        model.make();
      },

      getModuleCount(): number {
        return model.getModuleCount();
      },

      isDark(row: number, col: number): boolean {
        return model.isDark(row, col);
      },

      createDataURL,

      createImgTag(
        cellSize: number = 2,
        margin: number = cellSize * 4,
        alt: string = ''
      ): string {
        const dataUrl = createDataURL(cellSize, margin);
        const size = cellSize * model.getModuleCount() + margin * 2;
        return `<img src="${dataUrl}" width="${size}" height="${size}" alt="${escapeHtml(alt)}"/>`;
      },

      createSvgTag(
        cellSize: number = 2,
        margin: number = cellSize * 4
      ): string {
        const mods = model.getModuleCount();
        const size = cellSize * mods + margin * 2;
        let svg = '';
        svg += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`;
        svg += ` width="${size}px" height="${size}px"`;
        svg += ` viewBox="0 0 ${size} ${size}"`;
        svg += ` preserveAspectRatio="xMinYMin meet">`;
        svg += `<rect width="100%" height="100%" fill="#ffffff"/>`;
        svg += `<path d="`;

        for (let row = 0; row < mods; row++) {
          for (let col = 0; col < mods; col++) {
            if (model.isDark(row, col)) {
              const x = margin + col * cellSize;
              const y = margin + row * cellSize;
              svg += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z`;
            }
          }
        }

        svg += `" fill="#000000"/>`;
        svg += `</svg>`;
        return svg;
      },

      createTableTag(
        cellSize: number = 2,
        margin: number = cellSize * 4
      ): string {
        const mods = model.getModuleCount();
        let html = '';
        html += '<table style="border:0;border-collapse:collapse;">';

        // Top margin
        for (let i = 0; i < margin; i++) {
          html += '<tr>';
          for (let j = 0; j < mods * cellSize + margin * 2; j++) {
            html +=
              '<td style="border:0;padding:0;margin:0;width:1px;height:1px;background-color:#ffffff;"></td>';
          }
          html += '</tr>';
        }

        for (let row = 0; row < mods; row++) {
          for (let cy = 0; cy < cellSize; cy++) {
            html += '<tr>';
            // Left margin
            for (let i = 0; i < margin; i++) {
              html +=
                '<td style="border:0;padding:0;margin:0;width:1px;height:1px;background-color:#ffffff;"></td>';
            }
            for (let col = 0; col < mods; col++) {
              const dark = model.isDark(row, col);
              const color = dark ? '#000000' : '#ffffff';
              for (let cx = 0; cx < cellSize; cx++) {
                html += `<td style="border:0;padding:0;margin:0;width:1px;height:1px;background-color:${color};"></td>`;
              }
            }
            // Right margin
            for (let i = 0; i < margin; i++) {
              html +=
                '<td style="border:0;padding:0;margin:0;width:1px;height:1px;background-color:#ffffff;"></td>';
            }
            html += '</tr>';
          }
        }

        // Bottom margin
        for (let i = 0; i < margin; i++) {
          html += '<tr>';
          for (let j = 0; j < mods * cellSize + margin * 2; j++) {
            html +=
              '<td style="border:0;padding:0;margin:0;width:1px;height:1px;background-color:#ffffff;"></td>';
          }
          html += '</tr>';
        }

        html += '</table>';
        return html;
      },

      createASCII(cellSize: number = 1, margin: number = 2): string {
        const mods = model.getModuleCount();
        const minCellSize = Math.max(1, cellSize);
        const white = Array(minCellSize + 1).join('  ');
        const black = Array(minCellSize + 1).join('\u2588\u2588');
        const marginLine =
          Array(mods * minCellSize + margin * 2 + 1).join(' ') + '\n';
        let ascii = '';

        // Top margin
        for (let i = 0; i < margin; i++) {
          ascii += marginLine;
        }

        for (let row = 0; row < mods; row++) {
          for (let cy = 0; cy < minCellSize; cy++) {
            // Left margin
            ascii += Array(margin + 1).join(' ');
            for (let col = 0; col < mods; col++) {
              ascii += model.isDark(row, col) ? black : white;
            }
            // Right margin
            ascii += Array(margin + 1).join(' ');
            ascii += '\n';
          }
        }

        // Bottom margin
        for (let i = 0; i < margin; i++) {
          ascii += marginLine;
        }

        return ascii;
      },

      renderTo2dContext(
        context: CanvasRenderingContext2D,
        cellSize: number = 2
      ): void {
        const mods = model.getModuleCount();
        for (let row = 0; row < mods; row++) {
          for (let col = 0; col < mods; col++) {
            context.fillStyle = model.isDark(row, col) ? '#000000' : '#ffffff';
            context.fillRect(
              col * cellSize,
              row * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      },
    };
  },
  {
    stringToBytes(s: string): number[] {
      const bytes: number[] = [];
      for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    },

    stringToBytesFuncs: {
      default(s: string): number[] {
        return qrcode.stringToBytes(s);
      },
    },

    createStringToBytes(
      unicodeData: string,
      numChars: number
    ): (s: string) => number[] {
      // Parse unicode mapping data
      const unicodeMap = new Map<number, number>();
      for (let i = 0; i < numChars; i++) {
        const code =
          unicodeData.charCodeAt(i * 2) |
          (unicodeData.charCodeAt(i * 2 + 1) << 8);
        unicodeMap.set(i, code);
      }

      return (s: string): number[] => {
        const bytes: number[] = [];
        for (let i = 0; i < s.length; i++) {
          const c = s.charCodeAt(i);
          const mapped = unicodeMap.get(c);
          if (mapped !== undefined) {
            if (mapped > 0xff) {
              bytes.push((mapped >> 8) & 0xff);
            }
            bytes.push(mapped & 0xff);
          } else {
            bytes.push(c & 0xff);
          }
        }
        return bytes;
      };
    },
  }
);

// Export as default and named export
export default qrcode;
export { qrcode };
export type { QRCode, QRCodeFactory, TypeNumber, ErrorCorrectionLevel, Mode };

// QRCodeRenderer class for canvas rendering
export class QRCodeRenderer {
  static draw(text: string, canvas: HTMLCanvasElement): void {
    if (typeof text !== 'string') {
      throw new TypeError('text must be a string');
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError('canvas must be an HTMLCanvasElement');
    }

    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const cellSize = Math.floor(
      Math.min(canvas.width, canvas.height) / (moduleCount + 8)
    );
    const margin = Math.floor(
      (Math.min(canvas.width, canvas.height) - moduleCount * cellSize) / 2
    );

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new TypeError('Could not get 2D rendering context');
    }

    // Clear canvas with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw modules
    ctx.fillStyle = '#000000';
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            margin + col * cellSize,
            margin + row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  }
}
