// src/main.ts
// Simple calculator logic and DOM wiring

type Operator = '+' | '-' | '*' | '/';

class Calculator {
  private display: HTMLInputElement;
  private current = '';   // current input number as string
  private previous = '';  // previous number as string
  private operator: Operator | null = null;
  private resetNext = false;

  constructor(display: HTMLInputElement) {
    this.display = display;
    this.updateDisplay('0');
  }

  pressDigit(d: string) {
    if (this.resetNext) {
      this.current = '';
      this.resetNext = false;
    }
    if (d === '.' && this.current.includes('.')) return;
    if (d === '0' && this.current === '0') return;
    this.current = (this.current === '0' && d !== '.') ? d : this.current + d;
    this.updateDisplay(this.current);
  }

  pressOperator(op: Operator) {
    if (this.current === '' && this.previous !== '') {
      this.operator = op; // change operator
      return;
    }
    if (this.previous === '') {
      this.previous = this.current || '0';
    } else if (this.current !== '') {
      this.compute();
    }
    this.operator = op;
    this.resetNext = true;
  }

  compute() {
    const a = parseFloat(this.previous || '0');
    const b = parseFloat(this.current || this.previous || '0');
    let res = 0;
    switch (this.operator) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if (b === 0) {
          this.updateDisplay('Error: div by 0');
          this.clearAll();
          return;
        }
        res = a / b; break;
      default:
        res = b; break;
    }
    const out = Number.isFinite(res) ? String(res) : 'Error';
    this.previous = out;
    this.current = '';
    this.operator = null;
    this.updateDisplay(out);
    this.resetNext = true;
  }

  clearAll() {
    this.current = '';
    this.previous = '';
    this.operator = null;
    this.updateDisplay('0');
    this.resetNext = false;
  }

  deleteLast() {
    if (this.current) {
      this.current = this.current.slice(0, -1);
      this.updateDisplay(this.current || '0');
    }
  }

  updateDisplay(text: string) {
    this.display.value = text;
  }
}

// wire up DOM
window.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('#display') as HTMLInputElement;
  if (!display) return;
  const calc = new Calculator(display);

  document.querySelectorAll('[data-digit]').forEach(btn => {
    btn.addEventListener('click', () => calc.pressDigit((btn as HTMLElement).getAttribute('data-digit')!));
  });

  document.querySelectorAll('[data-op]').forEach(btn => {
    btn.addEventListener('click', () => calc.pressOperator((btn as HTMLElement).getAttribute('data-op') as Operator));
  });

  const equals = document.querySelector('#equals')!;
  equals.addEventListener('click', () => calc.compute());

  const clear = document.querySelector('#clear')!;
  clear.addEventListener('click', () => calc.clearAll());

  const del = document.querySelector('#del')!;
  del.addEventListener('click', () => calc.deleteLast());

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') calc.pressDigit(e.key);
    if (e.key === '.') calc.pressDigit('.');
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') calc.pressOperator(e.key as Operator);
    if (e.key === 'Enter' || e.key === '=') calc.compute();
    if (e.key === 'Backspace') calc.deleteLast();
    if (e.key === 'Escape') calc.clearAll();
  });
});
