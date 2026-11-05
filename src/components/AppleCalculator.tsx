import React, { useState } from 'react';
import { Delete, RotateCcw, X, Minus, Plus } from 'lucide-react';

interface AppleCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppleCalculator: React.FC<AppleCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const handleNumber = (n: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(n);
    } else {
      setDisplay(display + n);
    }
  };

  const handleDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== 'Error') {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    if (display !== '0' && display !== 'Error') {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setFormula(formula + ' ' + display + ' ' + op);
    setDisplay('0');
  };

  const handleParenthesis = (p: '(' | ')') => {
    if (p === '(') {
      setFormula(formula + ' ( ');
    } else {
      setFormula(formula + ' ' + display + ' ) ');
      setDisplay('0');
    }
  };

  const handleConstant = (value: number, label: string) => {
    setDisplay(value.toString());
  };

  const handleTrig = (type: 'sin' | 'cos' | 'tan') => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      const angle = isDeg ? (val * Math.PI) / 180 : val;
      let res = 0;
      if (type === 'sin') res = Math.sin(angle);
      else if (type === 'cos') res = Math.cos(angle);
      else if (type === 'tan') {
        if (Math.abs(Math.cos(angle)) < 1e-12) {
          setDisplay('Error');
          return;
        }
        res = Math.tan(angle);
      }
      // Round very small floats to avoid 0.0000000000000001
      const rounded = Math.abs(res) < 1e-12 ? 0 : Number(res.toFixed(6));
      setDisplay(rounded.toString());
      setFormula(`${type}(${val}${isDeg ? '°' : 'rad'})`);
    } catch {
      setDisplay('Error');
    }
  };

  const handleSqrt = () => {
    try {
      const val = parseFloat(display);
      if (isNaN(val) || val < 0) {
        setDisplay('Error');
        return;
      }
      const res = Number(Math.sqrt(val).toFixed(6));
      setDisplay(res.toString());
      setFormula(`√(${val})`);
    } catch {
      setDisplay('Error');
    }
  };

  const handleSquare = () => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      const res = Number((val * val).toFixed(6));
      setDisplay(res.toString());
      setFormula(`sqr(${val})`);
    } catch {
      setDisplay('Error');
    }
  };

  const handleEquals = () => {
    try {
      let fullExpression = formula + ' ' + display;
      // Sanitize expression for safe arithmetic evaluation
      // Replace × with *, ÷ with /
      let sanitized = fullExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[^0-9+\-*/().\s]/g, '');

      // Evaluate safely
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
      } else {
        const rounded = Number(result.toFixed(6));
        setDisplay(rounded.toString());
        setFormula('');
      }
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div
      className="fixed z-50 transition-all duration-200 select-none shadow-2xl"
      style={{
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '280px' : '360px',
      }}
    >
      <div className="bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Apple Style Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#2c2c2e]/50">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center text-black/60 group"
              title="Close Calculator"
            >
              <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center text-black/60 group"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-40"></div>
            <span className="text-xs font-medium text-zinc-400 ml-2">Physics Calculator</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDeg(!isDeg)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                isDeg ? 'bg-white/20 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isDeg ? 'DEG' : 'RAD'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-4 space-y-3">
            {/* Display Screen */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-right">
              <div className="text-[11px] font-mono text-zinc-400 min-h-[16px] truncate">
                {formula || '\u00A0'}
              </div>
              <div className="text-3xl font-light font-mono tracking-tight text-white mt-1 overflow-x-auto whitespace-nowrap">
                {display}
              </div>
            </div>

            {/* Quick Physics Constants Strip */}
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              <button
                onClick={() => handleConstant(9.8, 'g=9.8')}
                className="py-1.5 bg-[#2c2c2e]/70 hover:bg-[#3a3a3c] text-zinc-300 rounded-lg border border-white/5 text-[11px] font-medium transition-colors"
                title="Gravitational acceleration 9.8 m/s²"
              >
                g=9.8
              </button>
              <button
                onClick={() => handleConstant(10, 'g=10')}
                className="py-1.5 bg-[#2c2c2e]/70 hover:bg-[#3a3a3c] text-zinc-300 rounded-lg border border-white/5 text-[11px] font-medium transition-colors"
                title="Gravitational acceleration 10 m/s²"
              >
                g=10
              </button>
              <button
                onClick={() => handleConstant(Math.PI, 'π')}
                className="py-1.5 bg-[#2c2c2e]/70 hover:bg-[#3a3a3c] text-zinc-300 rounded-lg border border-white/5 text-[11px] font-medium transition-colors"
                title="Pi (3.14159...)"
              >
                π
              </button>
              <button
                onClick={handleSqrt}
                className="py-1.5 bg-[#2c2c2e]/70 hover:bg-[#3a3a3c] text-zinc-300 rounded-lg border border-white/5 text-[11px] font-medium transition-colors"
                title="Square Root"
              >
                √x
              </button>
            </div>

            {/* Scientific Trig / Power Strip */}
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              <button
                onClick={() => handleTrig('sin')}
                className="py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-200 rounded-lg text-xs font-medium transition-colors"
              >
                sin
              </button>
              <button
                onClick={() => handleTrig('cos')}
                className="py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-200 rounded-lg text-xs font-medium transition-colors"
              >
                cos
              </button>
              <button
                onClick={() => handleTrig('tan')}
                className="py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-200 rounded-lg text-xs font-medium transition-colors"
              >
                tan
              </button>
              <button
                onClick={handleSquare}
                className="py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-200 rounded-lg text-xs font-medium transition-colors"
              >
                x²
              </button>
            </div>

            {/* Standard Keypad */}
            <div className="grid grid-cols-4 gap-1.5 text-sm font-medium">
              <button
                onClick={handleClear}
                className="py-2.5 bg-[#3a3a3c] hover:bg-[#48484a] text-zinc-200 rounded-lg transition-colors"
              >
                AC
              </button>
              <button
                onClick={handleToggleSign}
                className="py-2.5 bg-[#3a3a3c] hover:bg-[#48484a] text-zinc-200 rounded-lg transition-colors"
              >
                ±
              </button>
              <button
                onClick={handleBackspace}
                className="py-2.5 bg-[#3a3a3c] hover:bg-[#48484a] text-zinc-200 rounded-lg flex items-center justify-center transition-colors"
                title="Delete"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className="py-2.5 bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-semibold rounded-lg transition-colors"
              >
                ÷
              </button>

              <button
                onClick={() => handleNumber('7')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                7
              </button>
              <button
                onClick={() => handleNumber('8')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                8
              </button>
              <button
                onClick={() => handleNumber('9')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                9
              </button>
              <button
                onClick={() => handleOperator('×')}
                className="py-2.5 bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-semibold rounded-lg transition-colors"
              >
                ×
              </button>

              <button
                onClick={() => handleNumber('4')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                4
              </button>
              <button
                onClick={() => handleNumber('5')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                5
              </button>
              <button
                onClick={() => handleNumber('6')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                6
              </button>
              <button
                onClick={() => handleOperator('-')}
                className="py-2.5 bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-semibold rounded-lg transition-colors"
              >
                −
              </button>

              <button
                onClick={() => handleNumber('1')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                1
              </button>
              <button
                onClick={() => handleNumber('2')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                2
              </button>
              <button
                onClick={() => handleNumber('3')}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                3
              </button>
              <button
                onClick={() => handleOperator('+')}
                className="py-2.5 bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-semibold rounded-lg transition-colors"
              >
                +
              </button>

              <button
                onClick={() => handleNumber('0')}
                className="col-span-2 py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg text-left px-5 transition-colors font-mono"
              >
                0
              </button>
              <button
                onClick={handleDot}
                className="py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg transition-colors font-mono"
              >
                .
              </button>
              <button
                onClick={handleEquals}
                className="py-2.5 bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-semibold rounded-lg transition-colors"
              >
                =
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
