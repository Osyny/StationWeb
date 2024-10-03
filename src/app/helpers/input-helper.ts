export class InputHelper {
  static readonly minTextLength = 3;

  static isMinimumTextChanged(event: KeyboardEvent): boolean {
    if (event.code == this.enterCode) {
      return true;
    }

    const text = (event.target as HTMLInputElement).value;
    if (text?.length < this.minTextLength) {
      return false;
    }
    return !this.specialSymbols.includes(event.code);
  }

  static isSpecialSymbolPressed(event: KeyboardEvent): boolean {
    return this.specialSymbols.includes(event.code);
  }

  static isDecimalSymbolPressed(event: KeyboardEvent): boolean {
    return this.decimalSymbols.includes(event.code);
  }

  static normalizeInteger(value: number): number {
    return Math.max(Math.min(value, 2147483647), -2147483648);
  }
  private static readonly specialSymbols = [
    'Control',
    'Alt',
    'Shift',
    'CapsLock',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'NumLock',
    'MediaPlayPause',
    'MediaTrackPrevious',
    'MediaTrackNext',
    'PrintScreen',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'Meta',
  ];
  private static readonly enterCode = 'Enter';
  private static readonly decimalSymbols = [
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Period',
  ];
}
