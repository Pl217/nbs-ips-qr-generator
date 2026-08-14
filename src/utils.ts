import { BANKS } from './data';
import { ValidationResult } from './types';

/**
 * Конвертује карактер у нумеричку вредност по ISO/IEC 7064 стандарду.
 * Цифре 0-9 = 0-9
 * Слова A-Z = 10-35
 */
function charToValue(char: string): number {
  const code = char.charCodeAt(0);
  // Цифре 0-9
  if (code >= 48 && code <= 57) {
    return code - 48;
  }
  // Слова A-Z (upper case)
  if (code >= 65 && code <= 90) {
    return code - 55; // A=65 -> 10, Z=90 -> 35
  }
  // Слова a-z (lower case)
  if (code >= 97 && code <= 122) {
    return code - 87; // a=97 -> 10, z=122 -> 35
  }
  return 0;
}

/**
 * Рачуна остатак дељења великог броја са 97 по ISO/IEC 7064.
 * Подржава и цифре и слова (A-Z).
 */
export function calculateMod97Remainder(input: string): number {
  if (!input) {
    return 0;
  }

  try {
    // Конвертујемо сваки карактер у његову нумеричку вредност
    let numericString = '';
    for (let i = 0; i < input.length; i++) {
      const val = charToValue(input[i]);
      numericString += val.toString();
    }

    // Користимо BigInt за поделу великих бројева
    const remainder = Number(BigInt(numericString) % 97n);
    return remainder;
  } catch {
    return 0;
  }
}

/**
 * Валидација "Позив на број" по ISO/IEC 7064 Модулу 97 (Србија).
 * Формат: ККБББ...Б (КК = контролни број, Б = број или слово).
 * Логика: КК = 98 - (БББ...Б * 100) % 97.
 * Подржава алфанумеричке карактере (0-9, A-Z).
 */
export function validateReferenceNumber(ref: string): boolean {
  if (!ref) {
    return true; // Празно поље је валидно (опционо поље)
  }

  // Уклањамо размаке и конвертујемо у upper case
  const clean = ref.replace(/\s/g, '').toUpperCase();

  // Дозвољени су само алфанумерички карактери
  if (!/^[0-9A-Z]+$/.test(clean)) {
    return false;
  }

  // Минимална дужина је 3 (КК + бар један карактер)
  if (clean.length < 3) {
    return true; // Ако је краћи, не можемо проверити, прихватамо
  }

  // Издвајамо контролни број (прве 2 цифре) и тело
  const inputCC = Number(clean.substring(0, 2));
  const body = clean.substring(2);

  // Проверавамо да ли су прва два карактера цифре
  if (isNaN(inputCC)) {
    return false;
  }

  // Рачунамо остатак за тело * 100
  // Прво конвертујемо тело у нумерички стринг
  let bodyNumeric = '';
  for (let i = 0; i < body.length; i++) {
    bodyNumeric += charToValue(body[i]).toString();
  }

  // Додајемо 00 на крају (множење са 100)
  bodyNumeric += '00';

  // Рачунамо remainder
  const remainder = Number(BigInt(bodyNumeric) % 97n);
  const calculatedCC = 98 - remainder;

  return inputCC === calculatedCC;
}

/**
 * Слова и бројеви дозвољени у пољима "Назив примаоца плаћања" (N),
 * "Подаци о платиоцу" (P) и "Сврха плаћања" (S). Српска латиница
 * (ћирилица није дозвољена у тексту на основу кога се генерише QR кôд),
 * уз слово X (латинично икс), које се, иако није део српске латинице,
 * дозвољава јер се јавља у римским бројевима (нпр. XX, XIX...).
 */
export const NAME_LETTERS_AND_DIGITS =
  'abcčćdđefghijklmnoprsštuvxzžABCČĆDĐEFGHIJKLMNOPRSŠTUVXZŽ0123456789';

/**
 * Специјални карактери дозвољени у пољима N и P, у складу са табелом
 * специјалних карактера из НБС спецификације (Препоруке за NBS IPS QR кôд).
 */
export const NAME_ALLOWED_SPECIAL_CHARS: string[] = [
  '!',
  '(',
  '/',
  '@',
  '}',
  '“',
  ')',
  ':',
  '[',
  '~',
  '#',
  '*',
  ';',
  ']',
  '„',
  '$',
  '+',
  '<',
  '^',
  '”',
  '%',
  ',',
  '=',
  '_',
  '"',
  '&',
  '-',
  '>',
  '`',
  '’',
  '‘',
  '.',
  '?',
  '{',
  "'",
];

/** Максималан број карактера дозвољен у тагу N/P (укључујући размаке). */
export const NAME_MAX_LENGTH = 70;

/** Максималан број линија дозвољен у тагу N/P. */
export const NAME_MAX_LINES = 3;

/**
 * Провера да ли је појединачни карактер дозвољен у пољима N/P
 * (слово, цифра, размак или дозвољени специјални карактер).
 */
export function isValidNameChar(char: string): boolean {
  return (
    NAME_LETTERS_AND_DIGITS.includes(char) ||
    char === ' ' ||
    NAME_ALLOWED_SPECIAL_CHARS.includes(char)
  );
}

/**
 * Валидација вишелинијског имена/података (дозвољава српску латиницу,
 * размаке, бројеве и специјалне карактере у складу са НБС спецификацијом).
 * Дозвољено је највише 3 линије (раздвојене знаком за нову линију).
 * Не дозволи само размаке/специјалне карактере без слова или бројева.
 */
export function isValidName(text: string): boolean {
  const lines = text.split('\n');

  // Провера максималног броја линија
  if (lines.length > NAME_MAX_LINES) {
    return false;
  }

  // Провера да ли су сви карактери валидни (осим знака за нову линију)
  for (const line of lines) {
    if (![...line].every((c) => isValidNameChar(c))) {
      return false;
    }
  }

  // Провера да постоји бар једно слово или број у целом садржају
  return [...text].some((c) => NAME_LETTERS_AND_DIGITS.includes(c));
}

/**
 * Припрема вишелинијски садржај тагова N/P за упис у текстуални запис
 * QR кôда: уклања вишак празних линија (нпр. ако корисник не унесе адресу
 * већ само место седишта примаоца, средња празна линија се уклања како
 * би назив примаоца био у једној линији, а место у другој, у складу са
 * препоруком НБС спецификације) и уклања сувишне размаке.
 */
export function buildMultilineTagContent(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

/**
 * Филтрира вишелинијски садржај тагова N/P у складу са дозвољеним
 * карактерима, максималним бројем линија (NAME_MAX_LINES) и максималном
 * дужином (NAME_MAX_LENGTH). Чиста функција (искључиво зависи од уноса),
 * што омогућава да се исти позив користи и за рачунање нове позиције
 * курсора приликом филтрирања.
 */
export function filterMultilineTagInput(value: string): string {
  let filtered = '';
  let lineCount = 0;

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '\n') {
      if (lineCount < NAME_MAX_LINES - 1) {
        filtered += ch;
        lineCount++;
      }
      continue;
    }
    if (isValidNameChar(ch)) {
      filtered += ch;
    }
  }

  if (filtered.length > NAME_MAX_LENGTH) {
    filtered = filtered.substring(0, NAME_MAX_LENGTH);
  }

  return filtered;
}

/**
 * Филтрира једнолинијски садржај (нпр. таг S) - исти дозвољени карактери
 * као код N/P (isValidNameChar већ одбацује знак за нову линију), уз
 * ограничење максималне дужине. Чиста функција.
 */
export function filterSingleLineTagInput(
  value: string,
  maxLength: number
): string {
  let filtered = '';

  for (const ch of value) {
    if (isValidNameChar(ch)) {
      filtered += ch;
    }
  }

  if (filtered.length > maxLength) {
    filtered = filtered.substring(0, maxLength);
  }

  return filtered;
}

/**
 * Проналази први карактер који је „изгубљен" приликом филтрирања текста -
 * упоређује оригинални и филтрирани садржај, занемарујући разлике у
 * величини слова (нпр. код позива на број, где се мала слова аутоматски
 * претварају у велика, а то није одбацивање карактера). Користи се да би
 * се кориснику приказало ТАЧНО који је знак недозвољен.
 */
export function findFirstDroppedChar(
  original: string,
  filtered: string
): string | null {
  let j = 0;
  for (let i = 0; i < original.length; i++) {
    const oc = original[i];
    if (j < filtered.length && oc.toLowerCase() === filtered[j].toLowerCase()) {
      j++;
    } else {
      return oc;
    }
  }
  return null;
}

/**
 * Провера да ли садржај налепљен (paste) у поље износа задовољава
 * стандард онога што сме бити унето у поље: цифре, опционо тачке као
 * сепаратор хиљада и опционо зарез са до 2 децимале.
 */
export function isValidAmountPaste(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  // Формат са тачкама као сепаратором хиљада, нпр. 1.234.567,89
  const formattedPattern = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/;
  // Формат без сепаратора хиљада, нпр. 545,95 или 545
  const plainPattern = /^\d+(,\d{1,2})?$/;

  return formattedPattern.test(trimmed) || plainPattern.test(trimmed);
}

/**
 * Валидација банковног рачуна по ISO 7064 (mod 97 = 1).
 * Очекивани формат: 18 цифара (БББ-ЦЦЦЦЦЦЦЦЦЦЦЦЦ-КК).
 */
export function validateBankAccount(account: string): ValidationResult {
  let clean = account.replace(/\D/g, '');

  // Ако је унето мање од 18 цифара, покушавамо аутоматску попуну нулама
  if (clean.length < 18 && clean.length > 5) {
    const bankCode = clean.substring(0, 3);
    const control = clean.substring(clean.length - 2);
    const core = clean.substring(3, clean.length - 2);

    const zerosNeeded = 18 - 3 - 2 - core.length;
    if (zerosNeeded > 0) {
      clean = `${bankCode}${'0'.repeat(zerosNeeded)}${core}${control}`;
    }
  }

  // Провера дужине
  if (clean.length !== 18) {
    return { isValid: false, message: 'accountLength' };
  }

  // Провера банке
  const bankId = clean.substring(0, 3);
  const bank = BANKS.find((b) => b.id === bankId);
  if (!bank) {
    return { isValid: false, message: 'bankNotFound' };
  }

  // Валидација по ISO 7064 - модуо 97 мора бити 1
  const remainder = calculateMod97Remainder(clean);
  if (remainder !== 1) {
    return { isValid: false, message: 'mod97', formattedValue: clean };
  }

  const formatted = `${clean.substring(0, 3)}-${clean.substring(3, 16)}-${clean.substring(16)}`;
  return { isValid: true, formattedValue: formatted, bank: bank };
}

/**
 * Форматира износ за приказ (1234.56 -> 1.234,56).
 */
export function formatAmountDisplay(value: string): string {
  if (!value) {
    return '';
  }

  // Очекујемо да интерно користимо тачку за децимале
  const parts = value.split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';

  // Додајемо тачку као сепаратор хиљада
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}

/**
 * Парсира износ из формата приказа у интерни формат (1.234,56 -> 1234.56).
 */
export function parseAmountInput(value: string): string {
  // Уклањамо све тачке (сепараторе хиљада)
  let result = value.replace(/\./g, '');
  // Замењујемо запету тачком
  result = result.replace(',', '.');
  return result;
}

/**
 * Обезбеђује да износ увек има децимални део са тачно 2 цифре.
 */
export function ensureDecimalPart(value: string): string {
  const parsed = parseAmountInput(value);
  const num = parseFloat(parsed);

  if (isNaN(num)) {
    return '';
  }

  // Форсирамо 2 децимале
  return num.toFixed(2);
}
