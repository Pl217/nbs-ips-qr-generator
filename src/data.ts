import { Bank } from './types';

export const BANKS: Bank[] = [
  { id: '105', nameCyr: 'АИК банка', nameLat: 'AIK banka' },
  { id: '115', nameCyr: 'Јетел банка', nameLat: 'Yettel banka' },
  { id: '145', nameCyr: 'Адријатик банка', nameLat: 'Adriatic banka' },
  { id: '155', nameCyr: 'Халк банка', nameLat: 'Halkbank' },
  { id: '160', nameCyr: 'Банка Интеза', nameLat: 'Banka Intesa' },
  { id: '165', nameCyr: 'Адико банка', nameLat: 'Addiko banka' },
  { id: '170', nameCyr: 'Уникредит банка', nameLat: 'UniCredit banka' },
  { id: '190', nameCyr: 'Алта банка', nameLat: 'Alta banka' },
  {
    id: '200',
    nameCyr: 'Поштанска Штедионица',
    nameLat: 'Poštanska Štedionica',
  },
  { id: '205', nameCyr: 'НЛБ Комерцијална', nameLat: 'NLB Komercijalna' },
  { id: '220', nameCyr: 'Прокредит банка', nameLat: 'ProCredit banka' },
  { id: '265', nameCyr: 'Рајфајзен банка', nameLat: 'Raiffeisen banka' },
  { id: '295', nameCyr: 'Српска банка', nameLat: 'Srpska banka' },
  { id: '325', nameCyr: 'ОТП банка', nameLat: 'OTP banka' },
  { id: '340', nameCyr: 'Ерсте банка', nameLat: 'Erste banka' },
  { id: '370', nameCyr: 'Три банка', nameLat: 'Tri banka' },
  { id: '375', nameCyr: 'АПИ банка', nameLat: 'API banka' },
  { id: '380', nameCyr: 'Мира банка', nameLat: 'Mirabank' },
  { id: '385', nameCyr: 'Банка Кине', nameLat: 'Bank of China' },
  { id: '840', nameCyr: 'Управа за трезор', nameLat: 'Uprava za trezor' },
];

export const TRANSLATIONS = {
  cyr: {
    title: 'Генератор NBS IPS QR кôда',
    requiredNote:
      "Сва поља обележена звездицом (<span class='asterisk'>*</span>) морају бити попуњена.",
    modelLabel: 'Модел',
    currencyLabel: 'Валута',
    fields: {
      R: 'Број рачуна примаоца',
      N: 'Назив примаоца плаћања',
      I: 'Износ новчаних средстава',
      P: 'Подаци о платиоцу',
      SF: 'Шифра плаћања',
      S: 'Сврха плаћања',
      RO: 'Позив на број одобрења',
    },
    btnGenerate: 'Генериши Кôд',
    btnSave: 'Сачувај',
    btnDelete: 'Обриши',
    drawerTitle: 'Сачувани кодови',
    emptyDrawer: 'Нема сачуваних кодова',
    validation: {
      mod97: 'Неисправан контролни број (последње две цифре).',
      bankNotFound: 'Банка није пронађена.',
      required: 'Ово поље је обавезно.',
      format: 'Неисправан формат.',
      accountLength: 'Рачун мора имати тачно 18 цифара.',
      invalidReference: 'Неисправан позив на број (провера модулом 97).',
      purposeTooLong: 'Сврха плаћања не може имати више од 35 карактера.',
      charactersRemaining: 'карактера преостало',
      nameTooManyLines: 'Дозвољено је највише 3 линије.',
      invalidAmountPaste: 'Налепљени садржај није у важећем формату износа.',
      invalidCharacter: 'Унет је недозвољен знак.',
    },
    placeholders: {
      saveName: 'Унесите назив за чување...',
      accountNumber: '105-0000000000000-29',
      recipientName: 'нпр. Жика Жикић',
      amount: '545,95',
      payerData: 'нпр. Петар Петровић',
      purpose: 'нпр. плаћање рачуна',
      reference: 'нпр. 474654465',
    },
  },
  lat: {
    title: 'Generator NBS IPS QR kôda',
    requiredNote:
      "Sva polja obeležena zvezdicom (<span class='asterisk'>*</span>) moraju biti popunjena.",
    modelLabel: 'Model',
    currencyLabel: 'Valuta',
    fields: {
      R: 'Broj računa primaoca',
      N: 'Naziv primaoca plaćanja',
      I: 'Iznos novčanih sredstava',
      P: 'Podaci o platiocu',
      SF: 'Šifra plaćanja',
      S: 'Svrha plaćanja',
      RO: 'Poziv na broj odobrenja',
    },
    btnGenerate: 'Generiši Kod',
    btnSave: 'Sačuvaj',
    btnDelete: 'Obriši',
    drawerTitle: 'Sačuvani kodovi',
    emptyDrawer: 'Nema sačuvanih kodova',
    validation: {
      mod97: 'Neispravan kontrolni broj (poslednje dve cifre).',
      bankNotFound: 'Banka nije pronađena.',
      required: 'Ovo polje je obavezno.',
      format: 'Neispravan format.',
      accountLength: 'Račun mora imati tačno 18 cifara.',
      invalidReference: 'Neispravan poziv na broj (provera modulom 97).',
      purposeTooLong: 'Svrha plaćanja ne može imati više od 35 karaktera.',
      charactersRemaining: 'karaktera preostalo',
      nameTooManyLines: 'Dozvoljeno je najviše 3 linije.',
      invalidAmountPaste: 'Nalepljeni sadržaj nije u važećem formatu iznosa.',
      invalidCharacter: 'Unet je nedozvoljen znak.',
    },
    placeholders: {
      saveName: 'Unesite naziv za čuvanje...',
      accountNumber: '105-0000000000000-29',
      recipientName: 'npr. Žika Žikić\nulica i broj (opciono)\nmesto (opciono)',
      amount: '545,95',
      payerData: 'npr. Petar Petrović\nulica i broj (opciono)\nmesto (opciono)',
      purpose: 'npr. plaćanje računa',
      reference: 'npr. 474654465',
    },
  },
};

export const PAYMENT_CODES = {
  placeholder: {
    cyr: 'Изаберите шифру...',
    lat: 'Izaberite šifru...',
  },
  groups: {
    cyr: [
      {
        label: 'Најчешће шифре',
        codes: [
          {
            value: '253',
            text: '253 - Уплата јавних прихода изузев пореза и доприноса по одбитку',
          },
          { value: '289', text: '289 - Трансакције по налогу грађана' },
        ],
      },
      {
        label: 'Трансакције по основу промета робе и услуга',
        codes: [
          {
            value: '220',
            text: '220 - Промет робе и услуга - међуфазна потрошња',
          },
          {
            value: '221',
            text: '221 - Промет робе и услуга - финална потрошња',
          },
          { value: '222', text: '222 - Услуге јавних предузећа' },
          { value: '223', text: '223 - Инвестиције у објекте и опрему' },
          { value: '224', text: '224 - Инвестиције - остало' },
          {
            value: '225',
            text: '225 - Закупнине за непокретности у јавној својини',
          },
          { value: '226', text: '226 - Закупнине' },
          {
            value: '227',
            text: '227 - Субвенције, регреси и премије са посебних рачуна',
          },
          {
            value: '228',
            text: '228 - Субвенције, регреси и премије са осталих рачуна',
          },
          { value: '231', text: '231 - Царине и друге увозне дажбине' },
        ],
      },
      {
        label: 'Трансакције расподеле',
        codes: [
          { value: '240', text: '240 - Зараде и примања запослених' },
          {
            value: '241',
            text: '241 - Неопорезива примања запослених, социјална и друга давања изузета од опорезивања',
          },
          { value: '242', text: '242 - Накнаде зарада на терет послодавца' },
          {
            value: '244',
            text: '244 - Исплате преко омладинских и студентских задруга',
          },
          { value: '245', text: '245 - Пензије' },
          { value: '246', text: '246 - Обуставе од пензија и зарада' },
          {
            value: '247',
            text: '247 - Накнаде зарада на терет других исплатилаца',
          },
          {
            value: '248',
            text: '248 - Приходи физичких лица од капитала и других имовинских права',
          },
          { value: '249', text: '249 - Остали приходи физичких лица' },
          {
            value: '253',
            text: '253 - Уплата јавних прихода изузев пореза и доприноса по одбитку',
          },
          { value: '254', text: '254 - Уплата пореза и доприноса по одбитку' },
          {
            value: '257',
            text: '257 - Повраћај више наплаћених или погрешно наплаћених текућих прихода',
          },
          {
            value: '258',
            text: '258 - Прекњижавање више уплаћених или погрешно уплаћених текућих прихода',
          },
        ],
      },
      {
        label: 'Трансфери',
        codes: [
          { value: '260', text: '260 - Премије осигурања и надокнада штете' },
          { value: '261', text: '261 - Распоред текућих прихода' },
          { value: '262', text: '262 - Трансфери у оквиру државних органа' },
          { value: '263', text: '263 - Остали трансфери' },
          {
            value: '264',
            text: '264 - Пренос средстава из буџета за обезбеђење повраћаја више наплаћених текућих прихода',
          },
          { value: '265', text: '265 - Уплата пазара' },
          { value: '266', text: '266 - Исплата готовине' },
        ],
      },
      {
        label: 'Финансијске трансакције',
        codes: [
          { value: '270', text: '270 - Краткорочни кредити' },
          { value: '271', text: '271 - Дугорочни кредити' },
          { value: '272', text: '272 - Активна камата' },
          { value: '273', text: '273 - Полагање орочених депозита' },
          { value: '275', text: '275 - Остали пласмани' },
          { value: '276', text: '276 - Отплата краткорочних кредита' },
          { value: '277', text: '277 - Отплата дугорочних кредита' },
          { value: '278', text: '278 - Повраћај орочених депозита' },
          { value: '279', text: '279 - Пасивна камата' },
          { value: '280', text: '280 - Есконт хартија од вредности' },
          { value: '281', text: '281 - Позајмице оснивача за ликвидност' },
          {
            value: '282',
            text: '282 - Повраћај позајмице за ликвидност оснивачу',
          },
          { value: '283', text: '283 - Наплата чекова грађана' },
          { value: '284', text: '284 - Платне картице' },
          { value: '285', text: '285 - Мењачки послови' },
          { value: '286', text: '286 - Купопродаја девиза' },
          { value: '287', text: '287 - Донације и спонзорства' },
          { value: '288', text: '288 - Донације' },
          { value: '289', text: '289 - Трансакције по налогу грађана' },
          { value: '290', text: '290 - Друге трансакције' },
        ],
      },
    ],
    lat: [
      {
        label: 'Najčešće šifre',
        codes: [
          {
            value: '253',
            text: '253 - Uplata javnih prihoda izuzev poreza i doprinosa po odbitku',
          },
          { value: '289', text: '289 - Transakcije po nalogu građana' },
        ],
      },
      {
        label: 'Transakcije po osnovu prometa robe i usluga',
        codes: [
          {
            value: '220',
            text: '220 - Promet robe i usluga - međufazna potrošnja',
          },
          {
            value: '221',
            text: '221 - Promet robe i usluga - finalna potrošnja',
          },
          { value: '222', text: '222 - Usluge javnih preduzeća' },
          { value: '223', text: '223 - Investicije u objekte i opremu' },
          { value: '224', text: '224 - Investicije - ostalo' },
          {
            value: '225',
            text: '225 - Zakupnine za nekretnine u javnoj svojini',
          },
          { value: '226', text: '226 - Zakupnine' },
          {
            value: '227',
            text: '227 - Subvencije, regresi i premije sa posebnih računa',
          },
          {
            value: '228',
            text: '228 - Subvencije, regresi i premije sa ostalih računa',
          },
          { value: '231', text: '231 - Carine i druge uvozne dažbine' },
        ],
      },
      {
        label: 'Transakcije raspodele',
        codes: [
          { value: '240', text: '240 - Zarade i primanja zaposlenih' },
          {
            value: '241',
            text: '241 - Neoporeziva primanja zaposlenih, socijalna i druga davanja izuzeta od oporezivanja',
          },
          { value: '242', text: '242 - Naknade zarada na terет poslodavca' },
          {
            value: '244',
            text: '244 - Isplate preko omladinskih i studentskih zadruga',
          },
          { value: '245', text: '245 - Penzije' },
          { value: '246', text: '246 - Obustave od penzija i zarada' },
          {
            value: '247',
            text: '247 - Naknade zarada na teret drugih isplatilaća',
          },
          {
            value: '248',
            text: '248 - Prihodи fizičких lica od kapitala i drugih imovinskih prava',
          },
          { value: '249', text: '249 - Ostali prihodи fizičких lica' },
          {
            value: '253',
            text: '253 - Uplata javnih prihoda izuzev poreza i doprinosa po odbitku',
          },
          { value: '254', text: '254 - Uplata poreza i doprinosa po odbitku' },
          {
            value: '257',
            text: '257 - Povraćaj više naplaćenih ili pogrešno naplaćenih tekućih prihoda',
          },
          {
            value: '258',
            text: '258 - Preknjiživanje više uplaćenih ili pogrešno uplaćenih tekućih prihoda',
          },
        ],
      },
      {
        label: 'Transferi',
        codes: [
          { value: '260', text: '260 - Premije osiguranja i naknada štete' },
          { value: '261', text: '261 - Raspored tekućih prihoda' },
          { value: '262', text: '262 - Transferi u okviru državnih organa' },
          { value: '263', text: '263 - Ostali transferi' },
          {
            value: '264',
            text: '264 - Prenos sredstava iz budžeta za obezbeđenje povraćaja više naplaćenih tekućih prihoda',
          },
          { value: '265', text: '265 - Uplata pazara' },
          { value: '266', text: '266 - Isplata gotovine' },
        ],
      },
      {
        label: 'Finansijske transakcije',
        codes: [
          { value: '270', text: '270 - Kratkoročni krediti' },
          { value: '271', text: '271 - Dugoročni krediti' },
          { value: '272', text: '272 - Aktivna kamata' },
          { value: '273', text: '273 - Polагање orочenih depozita' },
          { value: '275', text: '275 - Ostali plasмani' },
          { value: '276', text: '276 - Otplata kratkoročnih kredita' },
          { value: '277', text: '277 - Otplata dugoročnih kredita' },
          { value: '278', text: '278 - Povraćaj orочenih depozita' },
          { value: '279', text: '279 - Pasivna kamata' },
          { value: '280', text: '280 - Eskont hartija od vrednosti' },
          { value: '281', text: '281 - Pozajmice osnivača za likvidnost' },
          {
            value: '282',
            text: '282 - Povraćaj pozajmice za likvidnost osnivačua',
          },
          { value: '283', text: '283 - Naplata čekova građana' },
          { value: '284', text: '284 - Platne kartice' },
          { value: '285', text: '285 - Menjački poslovi' },
          { value: '286', text: '286 - Kupoprodaja deviza' },
          { value: '287', text: '287 - Donacije i sponzorstva' },
          { value: '288', text: '288 - Donacije' },
          { value: '289', text: '289 - Transakcije po nalogu građana' },
          { value: '290', text: '290 - Druge transakcije' },
        ],
      },
    ],
  },
};
