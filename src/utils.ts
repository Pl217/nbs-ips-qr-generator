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
 * Валидација имена (дозвољава САМО српска слова и размаке).
 * Не дозволи само размаке без слова.
 */
export function isValidName(text: string): boolean {
  // Валидна слова ћирилице и латинице
  const validChars =
    'абвгдђежзијклљмнњопрстћуфхцчџшАБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШabcčćdđefghijklmnoprsštuvzžABCČĆDĐEFGHIJKLMNOPRSŠTUVZŽ ';

  // Провера да ли сви карактери су валидни
  for (let i = 0; i < text.length; i++) {
    if (!validChars.includes(text[i])) {
      return false;
    }
  }

  // Провера да постоји бар једно слово (не само размаци)
  const lettersOnly = text.replace(/ /g, '');
  return lettersOnly.length > 0;
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
