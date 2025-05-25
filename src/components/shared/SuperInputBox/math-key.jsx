import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const MathKey = ({ symbol, onClick, display }) => (
  <button
    className="h-12 flex items-center justify-center border rounded-lg bg-white hover:bg-gray-100 transition-colors border-gray-400"
    onClick={onClick}
  >
    <span className="text-base font-semibold text-gray-800 whitespace-pre-line">
      <Latex>{`$${display || symbol}$`}</Latex>
    </span>
  </button>
);

export default MathKey;
