import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Calculator.css';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');

  const append = useCallback((char: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Hata') {
        return char === '.' ? '0.' : char;
      }
      return prev + char;
    });
  }, []);

  const clear = useCallback(() => {
    setDisplay('0');
  }, []);

  const backspace = useCallback(() => {
    setDisplay(prev => {
      if (prev === 'Hata' || prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, []);

  const calculate = useCallback(() => {
    setDisplay(prev => {
      try {
        if (!prev || prev === 'Hata') return '0';
        // Clean and evaluate securely
        const sanitized = prev.replace(/[^-()\d/*+.]/g, '');
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (result === Infinity || Number.isNaN(result)) {
          return 'Hata';
        }
        return String(Math.round(result * 100) / 100);
      } catch {
        return 'Hata';
      }
    });
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        append(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        append(e.key);
      } else if (e.key === '.' || e.key === ',') {
        append('.');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [append, calculate, backspace, clear]);

  return (
    <div className="calculator-section">
      <div className="calc-header">HESAP MAKİNESİ</div>
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        <button className="calc-btn calc-clear" onClick={clear}>C</button>
        <button className="calc-btn calc-operator" onClick={() => append('/')}>/</button>
        <button className="calc-btn calc-operator" onClick={() => append('*')}>*</button>
        <button className="calc-btn calc-operator" onClick={backspace}>⌫</button>

        <button className="calc-btn" onClick={() => append('7')}>7</button>
        <button className="calc-btn" onClick={() => append('8')}>8</button>
        <button className="calc-btn" onClick={() => append('9')}>9</button>
        <button className="calc-btn calc-operator" onClick={() => append('-')}>-</button>

        <button className="calc-btn" onClick={() => append('4')}>4</button>
        <button className="calc-btn" onClick={() => append('5')}>5</button>
        <button className="calc-btn" onClick={() => append('6')}>6</button>
        <button className="calc-btn calc-operator" onClick={() => append('+')}>+</button>

        <button className="calc-btn" onClick={() => append('1')}>1</button>
        <button className="calc-btn" onClick={() => append('2')}>2</button>
        <button className="calc-btn" onClick={() => append('3')}>3</button>
        <button className="calc-btn calc-equal" onClick={calculate} style={{ gridRow: 'span 2' }}>=</button>

        <button className="calc-btn" onClick={() => append('0')} style={{ gridColumn: 'span 2' }}>0</button>
        <button className="calc-btn" onClick={() => append('.')}>.</button>
      </div>
    </div>
  );
};
