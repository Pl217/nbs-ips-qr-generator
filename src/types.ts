export type Theme = 'light' | 'dark';
export type Lang = 'cyr' | 'lat';

export type Bank = {
  id: string;
  nameCyr: string;
  nameLat: string;
  logo?: string;
};

export type ValidationResult = {
  isValid: boolean;
  message?: string;
  formattedValue?: string;
  bank?: Bank;
};

export type IpsFormData = {
  K: string; // PR
  V: string; // 01
  C: string; // 1
  R: string; // Рачун
  N: string; // Назив примаоца
  I: string; // Износ
  P: string; // Подаци о платиоцу
  SF: string; // Шифра плаћања
  S: string; // Сврха
  RO: string; // Позив на број
};
