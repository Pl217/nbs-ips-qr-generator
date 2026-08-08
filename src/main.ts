import { BANKS, TRANSLATIONS, PAYMENT_CODES } from './data';
import { QRCodeRenderer } from './qr-lib';
import { IpsFormData, Lang, Theme } from './types';
import {
  buildMultilineTagContent,
  ensureDecimalPart,
  formatAmountDisplay,
  isValidAmountPaste,
  isValidName,
  isValidNameChar,
  NAME_MAX_LENGTH,
  NAME_MAX_LINES,
  parseAmountInput,
  validateBankAccount,
  validateReferenceNumber,
} from './utils';

type SavedCode = { name: string; data: IpsFormData };

class App {
  lang: Lang = 'cyr';
  theme: Theme = 'light';
  form: HTMLFormElement | null = null;
  savedCodes: SavedCode[] = [];
  currentBankId: string | null = null; // Чување ID банке за ажурирање приликом промене језика

  constructor() {
    this.init();
  }

  init() {
    this.lang = (localStorage.getItem('lang') as Lang) || 'cyr';
    this.theme = (localStorage.getItem('theme') as Theme) || 'light';
    try {
      this.savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    } catch {
      this.savedCodes = [];
    }

    this.applyTheme();
    this.applyLang();
    this.cacheDom();
    this.renderDrawerList();
    this.bindEvents();
  }

  cacheDom() {
    this.form = document.getElementById('ips-form') as HTMLFormElement;
  }

  bindEvents() {
    document
      .getElementById('btn-theme')
      ?.addEventListener('click', () => this.toggleTheme());
    document
      .getElementById('btn-lang')
      ?.addEventListener('click', () => this.toggleLang());

    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    document.getElementById('btn-menu')?.addEventListener('click', () => {
      drawer?.classList.add('open');
      overlay?.classList.add('open');
    });
    overlay?.addEventListener('click', () => {
      drawer?.classList.remove('open');
      overlay?.classList.remove('open');
    });

    // 1. Account Input - само цифре и цртице
    const accInput = document.getElementById('field-R') as HTMLInputElement;
    accInput?.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      t.value = t.value.replace(/[^0-9-]/g, '');
    });
    accInput?.addEventListener('blur', () => this.handleAccountBlur(accInput));

    // 2. Name/Payer inputs (N, P) - вишелинијска поља (до 3 линије),
    // српска латиница, бројеви, размаци и дозвољени специјални карактери
    // (у складу са табелом специјалних карактера НБС спецификације).
    ['field-N', 'field-P'].forEach((id) => {
      const el = document.getElementById(id) as HTMLTextAreaElement;
      const tag = id.replace('field-', '');

      el.addEventListener('input', (e) => {
        const t = e.target as HTMLTextAreaElement;

        // Филтрирање - дозвољавамо само важеће карактере и знак за нову
        // линију (до NAME_MAX_LINES линија укупно).
        let filtered = '';
        let lineCount = 0;
        for (let i = 0; i < t.value.length; i++) {
          const ch = t.value[i];
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

        // Ограничење укупне дужине садржаја на NAME_MAX_LENGTH карактера
        if (filtered.length > NAME_MAX_LENGTH) {
          filtered = filtered.substring(0, NAME_MAX_LENGTH);
        }

        t.value = filtered;
        this.updateNameFieldFeedback(tag, filtered);
      });

      // Валидација при blur - мора имати бар једно слово или број
      el.addEventListener('blur', (e) => {
        const t = e.target as HTMLTextAreaElement;
        if (!isValidName(t.value)) {
          t.value = '';
          this.updateNameFieldFeedback(tag, '');
        }
      });
    });

    // 3. Purpose field (S) - исти дозвољени карактери као N/P (српска
    // латиница, бројеви, размак и специјални карактери НБС спецификације),
    // али у једној линији и максимално 35 карактера.
    const purposeInput = document.getElementById('field-S') as HTMLInputElement;

    purposeInput.addEventListener('input', () => {
      const feedback = document.getElementById('feedback-S');

      // Филтрирање - дозвољавамо само важеће карактере (isValidNameChar
      // већ одбацује знак за нову линију, чиме се обезбеђује да садржај
      // остане у једној линији чак и приликом лепљења вишелинијског текста).
      let filtered = '';
      for (let i = 0; i < purposeInput.value.length; i++) {
        const ch = purposeInput.value[i];
        if (isValidNameChar(ch)) {
          filtered += ch;
        }
      }
      purposeInput.value = filtered;

      if (!feedback) return;

      const length = purposeInput.value.length;
      const remaining = 35 - length;

      if (length > 35) {
        purposeInput.value = purposeInput.value.substring(0, 35);
        feedback.style.display = 'block';
        feedback.textContent =
          TRANSLATIONS[this.lang].validation.purposeTooLong;
        feedback.classList.add('error');
      } else if (length >= 30) {
        // Упозорење када се приближи лимиту
        feedback.style.display = 'block';
        feedback.textContent = `${remaining} ${TRANSLATIONS[this.lang].validation.charactersRemaining}`;
        feedback.classList.remove('error');
        feedback.style.color = 'var(--text)';
      } else {
        feedback.style.display = 'none';
        feedback.textContent = '';
      }
    });

    // 4. Amount Logic - строга валидација
    const amtInput = document.getElementById('field-I') as HTMLInputElement;

    amtInput.addEventListener('keydown', (e) => {
      // Дозволи контролне тастере
      if (
        ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(
          e.key
        )
      ) {
        return;
      }

      // Дозволи тастатурне пречице (нпр. Ctrl+V/Cmd+V за лепљење, Ctrl+C,
      // Ctrl+A, Ctrl+X, Ctrl+Z...) - у супротном, preventDefault() испод
      // спречава browser да уопште покрене paste акцију па чак и paste
      // event handler никад не би био позван.
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      const currentVal = amtInput.value;

      // Провери да ли већ постоји запета
      if (currentVal.includes(',')) {
        const parts = currentVal.split(',');
        const decimalPart = parts[1];

        // Ако децимални део већ има 2 цифре
        if (decimalPart.length >= 2) {
          const cursorPosition = amtInput.selectionStart || 0;
          const commaIndex = currentVal.indexOf(',');

          // Ако је курсор после запете, не дозволи унос
          if (cursorPosition > commaIndex) {
            e.preventDefault();
            return;
          }
        }
      }

      // Дозволи цифре
      if (/[0-9]/.test(e.key)) {
        return;
      }

      // Дозволи запету само ако већ не постоји
      if (e.key === ',' && !currentVal.includes(',')) {
        return;
      }

      // Блокирај све остало
      e.preventDefault();
    });

    amtInput.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      let val = t.value;

      // Уклони све осим цифара и запете
      val = val.replace(/[^0-9,]/g, '');

      // Дозволи само једну запету
      const parts = val.split(',');
      if (parts.length > 2) {
        val = parts[0] + ',' + parts.slice(1).join('');
      }

      // Ограничи децималне на 2 цифре
      if (parts.length === 2 && parts[1].length > 2) {
        val = parts[0] + ',' + parts[1].substring(0, 2);
      }

      t.value = val;
    });

    amtInput.addEventListener('focus', () => {
      // Уклони форматирање (тачке за хиљаде)
      let val = amtInput.value.replace(/\./g, '');
      amtInput.value = val;
    });

    amtInput.addEventListener('blur', () => {
      let val = amtInput.value.trim();

      if (!val) {
        return;
      }

      // Конвертуј у интерни формат
      const parsed = parseAmountInput(val);

      if (isNaN(Number(parsed))) {
        amtInput.value = '';
        return;
      }

      // Осигурај да има децимални део
      const withDecimals = ensureDecimalPart(val);

      // Форматирај за приказ
      amtInput.value = formatAmountDisplay(withDecimals);
    });

    // Лепљење (paste) у поље износа - дозвољено само ако садржај
    // задовољава важећи формат износа (цифре, опционо тачке као
    // сепаратор хиљада, опционо зарез са до 2 децимале).
    amtInput.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();

      const clipboardData = e.clipboardData || (window as any).clipboardData;
      const pasted = clipboardData
        ? (clipboardData.getData('text') as string)
        : '';

      const feedback = document.getElementById('feedback-I');

      if (!isValidAmountPaste(pasted)) {
        amtInput.classList.add('error');
        if (feedback) {
          feedback.style.display = 'block';
          feedback.textContent =
            TRANSLATIONS[this.lang].validation.invalidAmountPaste;
          feedback.classList.add('error');
        }
        return;
      }

      amtInput.classList.remove('error');
      if (feedback) {
        feedback.style.display = 'none';
        feedback.textContent = '';
      }

      const start = amtInput.selectionStart ?? amtInput.value.length;
      const end = amtInput.selectionEnd ?? amtInput.value.length;
      const trimmedPaste = pasted.trim();
      amtInput.value =
        amtInput.value.slice(0, start) +
        trimmedPaste +
        amtInput.value.slice(end);

      // Тригерујемо постојећу input логику (лимит децимала, филтрирање итд.)
      amtInput.dispatchEvent(new Event('input'));
    });

    // 5. Reference (RO) - алфанумеричка валидација по ISO/IEC 7064
    const roInput = document.getElementById('field-RO') as HTMLInputElement;

    roInput.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      // Дозволи само цифре и слова
      t.value = t.value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    });

    roInput.addEventListener('blur', () => {
      const val = roInput.value.trim();
      const feedback = document.getElementById('feedback-RO');

      if (!feedback) {
        return;
      }

      // Сакриј feedback ако је празно
      if (!val) {
        feedback.style.display = 'none';
        feedback.textContent = '';
        roInput.classList.remove('error');
        return;
      }

      // Валидирај
      const isValid = validateReferenceNumber(val);

      if (!isValid) {
        roInput.classList.add('error');
        feedback.style.display = 'block';
        feedback.textContent =
          TRANSLATIONS[this.lang].validation.invalidReference;
      } else {
        roInput.classList.remove('error');
        feedback.style.display = 'none';
        feedback.textContent = '';
      }
    });

    document
      .getElementById('btn-save-code')
      ?.addEventListener('click', () => this.saveCurrentCode());

    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateQR();
    });
  }

  handleAccountBlur(input: HTMLInputElement) {
    const res = validateBankAccount(input.value);
    const feedback = document.getElementById('feedback-R');
    const logoImg = document.getElementById('bank-logo') as HTMLImageElement;
    const bankName = document.getElementById('bank-name');
    const checkmark = document.getElementById('bank-checkmark');

    if (!feedback || !logoImg || !bankName || !checkmark) {
      return;
    }

    input.classList.remove('error', 'success');
    feedback.className = 'field-feedback';

    if (!res.isValid) {
      input.classList.add('error');
      feedback.style.display = 'block';
      feedback.textContent =
        (TRANSLATIONS[this.lang].validation[
          res.message as keyof typeof TRANSLATIONS.cyr.validation
        ] ||
          res.message) ??
        'До овде није требало да дође';
      feedback.classList.add('error');
      checkmark.style.display = 'none';
      logoImg.style.display = 'none';
      bankName.textContent = '';
      this.currentBankId = null;
    } else {
      input.value = res.formattedValue!;
      // Не додајемо .success класу - остаје стандардан оквир
      feedback.style.display = 'none';
      feedback.textContent = '';

      if (res.bank) {
        this.currentBankId = res.bank.id;
        checkmark.style.display = 'block';
        logoImg.style.display = 'none'; // Change to 'inline-block' if you have logos available
        // Placeholders for logos, assuming they are in assets folder or similar
        // logoImg.src = `assets/${res.bank.id}.png`;
        bankName.textContent =
          this.lang === 'cyr' ? res.bank.nameCyr : res.bank.nameLat;
      }
    }
  }

  updateNameFieldFeedback(tag: string, value: string) {
    const feedback = document.getElementById(`feedback-${tag}`);
    if (!feedback) {
      return;
    }

    const lineCount = value.split('\n').length;
    const remaining = NAME_MAX_LENGTH - value.length;

    if (lineCount >= NAME_MAX_LINES && remaining <= 10) {
      feedback.style.display = 'block';
      feedback.textContent = `${TRANSLATIONS[this.lang].validation.nameTooManyLines} (${remaining} ${TRANSLATIONS[this.lang].validation.charactersRemaining})`;
      feedback.classList.remove('error');
    } else if (remaining <= 10) {
      feedback.style.display = 'block';
      feedback.textContent = `${remaining} ${TRANSLATIONS[this.lang].validation.charactersRemaining}`;
      feedback.classList.remove('error');
    } else {
      feedback.style.display = 'none';
      feedback.textContent = '';
    }
  }

  updateBankNameLanguage() {
    // Ажурирај назив банке када се промени језик
    if (this.currentBankId) {
      const bank = BANKS.find((b) => b.id === this.currentBankId);
      const bankName = document.getElementById('bank-name');
      if (bank && bankName) {
        bankName.textContent =
          this.lang === 'cyr' ? bank.nameCyr : bank.nameLat;
      }
    }
  }

  saveCurrentCode() {
    const name = prompt(TRANSLATIONS[this.lang].placeholders.saveName);
    if (!name) {
      return;
    }

    const data: IpsFormData = {
      K: 'PR',
      V: '01',
      C: '1',
      R: (document.getElementById('field-R') as HTMLInputElement).value,
      N: (document.getElementById('field-N') as HTMLTextAreaElement).value,
      I: (document.getElementById('field-I') as HTMLInputElement).value,
      P: (document.getElementById('field-P') as HTMLTextAreaElement).value,
      SF: (document.getElementById('field-SF') as HTMLInputElement).value,
      S: (document.getElementById('field-S') as HTMLInputElement).value,
      RO: (document.getElementById('field-RO') as HTMLInputElement).value,
    };

    this.savedCodes.push({ name, data });
    localStorage.setItem('savedCodes', JSON.stringify(this.savedCodes));
    this.renderDrawerList();
    alert('Сачувано!');
  }

  renderDrawerList() {
    const list = document.getElementById('saved-list');
    if (!list) {
      return;
    }
    list.innerHTML = '';

    if (this.savedCodes.length === 0) {
      list.innerHTML = `<li>${TRANSLATIONS[this.lang].emptyDrawer}</li>`;
      return;
    }

    this.savedCodes.forEach((code, idx) => {
      const li = document.createElement('li');
      li.className = 'saved-item';

      const span = document.createElement('span');
      span.textContent = code.name;
      span.onclick = () => this.loadCode(code.data);

      const btnDel = document.createElement('button');
      btnDel.textContent = '✕';
      btnDel.className = 'btn-delete-small';
      btnDel.onclick = (e) => {
        e.stopPropagation();
        this.deleteCode(idx);
      };

      li.appendChild(span);
      li.appendChild(btnDel);
      list.appendChild(li);
    });
  }

  deleteCode(index: number) {
    this.savedCodes.splice(index, 1);
    localStorage.setItem('savedCodes', JSON.stringify(this.savedCodes));
    this.renderDrawerList();
  }

  loadCode(data: IpsFormData) {
    // Попуни поља
    const setVal = (id: string, val: string) =>
      ((
        document.getElementById(`field-${id}`) as
          | HTMLInputElement
          | HTMLTextAreaElement
      ).value = val);

    setVal('R', data.R);
    setVal('N', data.N);
    this.updateNameFieldFeedback('N', data.N || '');

    // Форматирај износ
    const rawAmount = parseAmountInput(data.I);
    if (!isNaN(Number(rawAmount))) {
      const withDecimals = ensureDecimalPart(data.I);
      (document.getElementById('field-I') as HTMLInputElement).value =
        formatAmountDisplay(withDecimals);
    } else {
      setVal('I', data.I);
    }

    setVal('P', data.P);
    this.updateNameFieldFeedback('P', data.P || '');
    setVal('SF', data.SF);
    setVal('S', data.S);
    setVal('RO', data.RO);

    // Тригеруј валидацију рачуна
    this.handleAccountBlur(
      document.getElementById('field-R') as HTMLInputElement
    );

    // Затвори фиоку
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
  }

  generateQR() {
    const getVal = (id: string) =>
      (
        document.getElementById(`field-${id}`) as HTMLInputElement
      )?.value.trim() || '';

    const R = getVal('R').replace(/-/g, '');

    // Уклањамо вишак празних линија (нпр. ако адреса није унета, а место
    // јесте, средња празна линија се уклања у складу са препоруком НБС
    // спецификације - назив у једној линији, место у другој).
    const N = buildMultilineTagContent(getVal('N'));

    // Износ: Уклањамо тачке (сепараторе), зарез остаје
    const rawI = getVal('I').replace(/\./g, '');
    const I_fmt = `RSD${rawI}`;

    const P = buildMultilineTagContent(getVal('P'));
    const SF = getVal('SF');
    const S = getVal('S');
    const RO = getVal('RO');

    // Валидација дужине сврхе плаћања
    if (S.length > 35) {
      alert(TRANSLATIONS[this.lang].validation.purposeTooLong);
      document.getElementById('field-S')?.focus();
      return;
    }

    // Формирање IPS стринга
    let payload = `K:PR|V:01|C:1|R:${R}|N:${N}|I:${I_fmt}|SF:${SF}`;
    if (P) {
      payload += `|P:${P}`;
    }
    if (S) {
      payload += `|S:${S}`;
    }
    if (RO) {
      payload += `|RO:97${RO}`;
    }

    // Генеришање QR кода
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      QRCodeRenderer.draw(payload, canvas);

      document.getElementById('qr-string-display')!.textContent = payload;
      document
        .getElementById('qr-result-container')
        ?.classList.remove('hidden');
    } else {
      console.error('Canvas element #qr-canvas not found!');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');

    if (this.theme === 'light') {
      // У светлој теми приказујемо месец (да се пребаци на тамну)
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      // У тамној теми приказујемо сунце (да се пребаци на светлу)
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  toggleLang() {
    this.lang = this.lang === 'cyr' ? 'lat' : 'cyr';
    localStorage.setItem('lang', this.lang);
    document.getElementById('btn-lang')!.textContent =
      this.lang === 'cyr' ? 'LAT' : 'ЋИР';
    this.applyLang();
    this.updateBankNameLanguage();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  updateSelectFieldLanguage() {
    const selectField = document.getElementById(
      'field-SF'
    ) as HTMLSelectElement;
    if (!selectField) {
      return;
    }

    // Очистимо поље
    selectField.innerHTML = '';

    // Додајемо placeholder опцију
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = PAYMENT_CODES.placeholder[this.lang];
    selectField.appendChild(placeholderOption);

    // Додајемо групе опција
    const groups = PAYMENT_CODES.groups[this.lang];
    for (const group of groups) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = group.label;

      for (const code of group.codes) {
        const option = document.createElement('option');
        option.value = code.value;
        option.textContent = code.text;
        optgroup.appendChild(option);
      }

      selectField.appendChild(optgroup);
    }
  }

  applyLang() {
    const t = TRANSLATIONS[this.lang];

    // Ажурирај наслове
    document.querySelector('h1')!.textContent = t.title;
    document.querySelector('.note')!.innerHTML = t.requiredNote;
    document.getElementById('drawer-title')!.textContent = t.drawerTitle;
    document.getElementById('btn-save-code')!.textContent = t.btnSave;

    // Лабеле "Валута" и "Модел" (нису везане за поља која се уписују у QR)
    const currencyLabel = document.getElementById('label-currency');
    if (currencyLabel) {
      currencyLabel.textContent = t.currencyLabel;
    }
    const modelLabel = document.getElementById('label-model');
    if (modelLabel) {
      modelLabel.textContent = t.modelLabel;
    }

    // Ажурирај лабеле
    Object.keys(t.fields).forEach((key) => {
      const label = document.querySelector(`label[for="field-${key}"]`);
      if (label) {
        const hasAsterisk = label.querySelector('.asterisk');
        label.textContent = t.fields[key as keyof typeof t.fields];
        if (hasAsterisk) {
          const sp = document.createElement('span');
          sp.className = 'asterisk';
          sp.textContent = ' *';
          label.appendChild(sp);
        }
      }
    });

    // Ажурирај placeholder-е - увек на латиници (TRANSLATIONS.lat), без
    // обзира на изабрано писмо интерфејса, јер ћирилична слова нису
    // дозвољена у тексту на основу кога се генерише QR кôд (видети
    // напомену изнад форме).
    const latPlaceholders = TRANSLATIONS.lat.placeholders;
    const placeholders: Record<string, string> = {
      'field-R': latPlaceholders.accountNumber,
      'field-N': latPlaceholders.recipientName,
      'field-I': latPlaceholders.amount,
      'field-P': latPlaceholders.payerData,
      'field-S': latPlaceholders.purpose,
      'field-RO': latPlaceholders.reference,
    };

    Object.entries(placeholders).forEach(([id, placeholder]) => {
      const input = document.getElementById(id) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (input) {
        input.placeholder = placeholder;
      }
    });

    // Ажурирај опције у field-SF селекту
    this.updateSelectFieldLanguage();

    this.renderDrawerList();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();

  // Регистрација Service Worker-а за PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
});
