import {ValidationError} from './validationError.js'

class Calculator extends ValidationError {
  constructor(previousValueTextElement, currentValueTextElement) {
    super('start');
    this.previousValueTextElement = previousValueTextElement;
    this.currentValueTextElement = currentValueTextElement;
    this.clear();
  }

  clear() {
    this.currentValue = '';
    this.previousValue = '';
    this.operator = undefined;
  }

  delete() {
    this.currentValue = this.currentValue.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentValue.includes('.')) return;
    this.currentValue = this.currentValue.toString() + number.toString();
  }

  chooseOperator(operator) {
    if (this.currentValue === '') return;
    if (this.previousValue !== '') {
      this.compute();
    }

    this.operator = operator;
    this.previousValue = this.currentValue;
    this.currentValue = '';
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(current)) return
    switch (this.operator) {
      case '+':
        computation = (prev + current).toFixed(8)
        break
      case '-':
        computation = (prev - current).toFixed(8)
        break
      case '*':
        computation = (prev * current).toFixed(8)
        break
      case '÷':
        computation = (prev / current).toFixed(8)
        break
      case '%':
        computation = (prev * current / 100).toFixed(8)
        break
      default:
        return
    }

    this.currentValue = computation;
    this.operator = undefined;
    this.previousValue = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentValueTextElement.innerText = this.getDisplayNumber(this.currentValue);

    if (this.operator != null) {
      this.previousValueTextElement.innerText = `${this.getDisplayNumber(this.previousValue)} ${this.operator}`;
    } else {
      this.previousValueTextElement.innerText = '';
    }
  }
}

const previousValueTextElement = document.querySelector('.previous-operand');
const currentValueTextElement = document.querySelector('.current-operand');

let runСalculator = (instance) => {
  document.querySelector('.calculator-grid').addEventListener('click', (event) => {
    let target = event.target;

    if(!instance) {
      throw new ValidationError("Сalculator instance should not be empty");
    }
    if (!target) {
      throw new ValidationError("Oops, something went wrong...");
    }
  
    if (target.className === 'number') {
      instance.appendNumber(target.textContent);
    }
    if (target.className === 'operation') {
      instance.chooseOperator(target.innerText);
    }
    if (target.className === 'delete') {
      instance.delete();
    }
    if (target.className.includes('equals')) {
      instance.compute();
    }
    if(target.className.includes('clear')) {
      instance.clear();
    }
  
    instance.updateDisplay()
  });
}

try {
  runСalculator(new Calculator(previousValueTextElement, currentValueTextElement));
} catch(err) {
  console.log(`ошибка: ${err.message}. The error was handled in ${err.name}`);
} finally {}