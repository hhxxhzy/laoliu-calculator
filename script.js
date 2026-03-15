class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.historyListElement = document.getElementById('history-list');
        this.clearHistoryButton = document.getElementById('clear-history');
        this.timestampElement = document.getElementById('timestamp');
        
        this.clear();
        this.loadHistory();
        this.updateTimestamp();
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 更新时间的定时器
        setInterval(() => this.updateTimestamp(), 60000);
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('错误：不能除以零！');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // 保存到历史记录
        const historyItem = `${this.previousOperand} ${this.operation} ${this.currentOperand} = ${computation}`;
        this.addToHistory(historyItem);
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }
    
    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.formatDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
    
    formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('zh-CN', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    addToHistory(item) {
        const history = this.getHistory();
        history.unshift({
            item: item,
            timestamp: new Date().toLocaleString('zh-CN')
        });
        
        // 只保留最近的20条记录
        if (history.length > 20) {
            history.pop();
        }
        
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        this.renderHistory();
    }
    
    getHistory() {
        const history = localStorage.getItem('calculatorHistory');
        return history ? JSON.parse(history) : [];
    }
    
    loadHistory() {
        this.renderHistory();
    }
    
    renderHistory() {
        const history = this.getHistory();
        this.historyListElement.innerHTML = '';
        
        history.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>${entry.item}</div>
                <small style="color: #999;">${entry.timestamp}</small>
            `;
            this.historyListElement.appendChild(li);
        });
    }
    
    clearHistory() {
        localStorage.removeItem('calculatorHistory');
        this.renderHistory();
    }
    
    updateTimestamp() {
        const now = new Date();
        this.timestampElement.textContent = 
            `当前时间: ${now.toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}`;
    }
    
    bindEvents() {
        // 数字按钮
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                this.appendNumber(number);
            });
        });
        
        // 操作符按钮
        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.delete();
                        break;
                    case 'percentage':
                        this.percentage();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        const operationMap = {
                            'add': '+',
                            'subtract': '-',
                            'multiply': '×',
                            'divide': '÷'
                        };
                        this.chooseOperation(operationMap[action]);
                        break;
                }
            });
        });
        
        // 等号按钮
        document.querySelector('.btn.equals').addEventListener('click', () => {
            this.compute();
        });
        
        // 清空历史按钮
        this.clearHistoryButton.addEventListener('click', () => {
            this.clearHistory();
        });
        
        // 键盘支持
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }
    
    handleKeyboardInput(event) {
        const key = event.key;
        
        if ((key >= '0' && key <= '9') || key === '.') {
            this.appendNumber(key);
        } else if (key === '+') {
            this.chooseOperation('+');
        } else if (key === '-') {
            this.chooseOperation('-');
        } else if (key === '*') {
            this.chooseOperation('×');
        } else if (key === '/') {
            event.preventDefault();
            this.chooseOperation('÷');
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.compute();
        } else if (key === 'Escape' || key === 'Delete') {
            this.clear();
        } else if (key === 'Backspace') {
            this.delete();
        } else if (key === '%') {
            this.percentage();
        }
    }
}

// 初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    
    // 添加一些初始历史记录示例
    if (calculator.getHistory().length === 0) {
        const examples = [
            '12 + 34 = 46',
            '100 ÷ 4 = 25',
            '7 × 8 = 56',
            '50 - 23 = 27',
            '15 % = 0.15'
        ];
        
        examples.forEach(example => {
            calculator.addToHistory(example);
        });
    }
});