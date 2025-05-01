import React from 'react';
import MathKeyboardDropdown from './math-keyboard-dropdown';
import MathKeyboardTab from './math-keyboard-tab';
import MathKey from './math-key';
import { MATH_SYMBOLS } from '@/config/constant';

const MathKeyboard = ({
  activeTab,
  setActiveTab,
  insertSymbol,
  insertCommand,
  insertExponent,
  insertSubscript,
  insertComplexExpression,
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className="mt-2 border rounded-lg bg-white shadow-lg overflow-hidden">
      {isMobile ? (
        <MathKeyboardDropdown
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <MathKeyboardTab activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <div className="p-3">
        {activeTab === '123' && (
          <div className="grid grid-cols-6 gap-2">
            {MATH_SYMBOLS['123'].map((symbol) => (
              <MathKey
                key={symbol}
                symbol={symbol}
                display={
                  symbol === '\\times' ? '×' : symbol === '\\div' ? '÷' : symbol
                }
                onClick={() => insertSymbol(symbol)}
              />
            ))}
          </div>
        )}

        {activeTab === 'αβγ' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {MATH_SYMBOLS['αβγ'].map((symbol) => (
              <MathKey
                key={symbol}
                symbol={symbol}
                onClick={() => insertCommand(symbol)}
              />
            ))}
          </div>
        )}

        {activeTab === '≥≠' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {MATH_SYMBOLS['≥≠'].map(([cmd, symbol]) => (
              <MathKey
                key={cmd}
                symbol={symbol}
                onClick={() =>
                  cmd === '<' || cmd === '>'
                    ? insertSymbol(cmd)
                    : insertCommand(cmd)
                }
              />
            ))}
          </div>
        )}

        {activeTab === '∈⊂' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {MATH_SYMBOLS['∈⊂'].map(([cmd, symbol]) => (
              <MathKey
                key={cmd}
                symbol={symbol}
                onClick={() => insertCommand(cmd)}
              />
            ))}
          </div>
        )}

        {activeTab === 'sin cos' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {MATH_SYMBOLS['sin cos'].map((symbol) => (
              <MathKey
                key={symbol}
                symbol={symbol}
                onClick={() => insertCommand(symbol)}
              />
            ))}
          </div>
        )}

        {activeTab === 'ΣΠ' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {MATH_SYMBOLS['ΣΠ'].map(({ type, display }, index) => (
              <MathKey
                key={`${type}-${index}`}
                symbol={display}
                onClick={() => {
                  if (type === 'frac') insertCommand('frac');
                  else if (type === 'exponent')
                    insertExponent(display === '□²' ? '^2' : '^');
                  else if (type === 'sqrt') insertCommand('sqrt');
                  else if (type === 'nthroot') insertCommand('nthroot');
                  else if (type === 'log') insertComplexExpression('\\log_{}');
                  else if (type === 'pi') insertCommand('pi');
                  else if (type === 'infty') insertCommand('infty');
                  else if (type === 'integral')
                    insertComplexExpression('\\int_{}');
                  else if (type === 'sum') insertComplexExpression('\\sum_{}');
                  else if (type === 'product')
                    insertComplexExpression('\\prod_{}');
                  else if (type === 'limit')
                    insertComplexExpression('\\lim_{x \\to }');
                  else if (type === 'times') insertCommand('times');
                  else if (type === 'div') insertCommand('div');
                  else if (type === 'subscript') insertSubscript();
                }}
              />
            ))}
          </div>
        )}

        {activeTab === 'ΩΔ' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {MATH_SYMBOLS['ΩΔ'].map((symbol) => (
              <MathKey
                key={symbol}
                symbol={symbol}
                onClick={() => insertCommand(symbol)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathKeyboard;
