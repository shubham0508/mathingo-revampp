import {
  Hash,
  AlignLeft,
  AlignRight,
  Sigma,
  Equal,
  CircleDot,
  Percent,
  Minus,
  Plus,
} from 'lucide-react';

export const pricingPlansData = [
  {
    title: 'BASIC',
    price: '0 USD',
    period: 'Year',
    features: ['Homework Assistance', 'Smart Solution Check', 'Basic AI tutor'],
    buttonText: 'Start Now',
    recommended: false,
    className: 'bg-[#034d6e]',
  },
  {
    title: 'PREMIUM',
    price: '1200 USD',
    period: 'Year',
    features: ['Homework Assistance', 'Smart Solution Check', 'Basic AI tutor'],
    buttonText: 'Choose Premium',
    recommended: false,
    className: '',
    discount: 'Save 30 %',
  },
  {
    title: 'PRO',
    price: '1800 USD',
    period: 'Year',
    features: [
      'Homework Assistance',
      'Smart Solution Check',
      'Advanced AI tutor',
    ],
    buttonText: 'Choose Pro',
    recommended: true,
    className:
      '[background:linear-gradient(180deg,rgba(255,251,245,1)_0%,rgba(255,228,151,1)_100%)]',
  },
];

export const productSectionsData = [
  {
    title: 'AI Math Tutor',
    description: 'Solve on AI whiteboard, buddy will guide you!',
    learnMoreLink: '/products/ai-tutor',
    buttonText: 'Get Started',
    image: '/images/products/ai-tutor.png',
  },
  {
    title: 'Homework Assistant',
    description:
      'Quickly extract math questions from any assignment and learn!',
    learnMoreLink: '/products/homework-assistant',
    buttonText: 'Get Started',
    image: '/images/products/homework-assistant.png',
  },
  {
    title: 'Smart Solution Check',
    description: 'Get even your handwritten answers checked!',
    learnMoreLink: '/products/solution-check',
    buttonText: 'Get Started',
    image: '/images/products/solution-check.png',
  },
];

export const MODES = {
  TEXT: 'text',
  DRAW: 'draw',
  UPLOAD: 'upload',
};

export const FILE_TYPES = {
  IMAGE: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  PDF: ['application/pdf'],
  ALL: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
  ],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 5;

export const MATH_KEYBOARD_TABS = {
  123: { icon: <Hash size={18} />, label: 'Numbers' },
  αβγ: { icon: <CircleDot size={18} />, label: 'Greek' },
  '≥≠': { icon: <Equal size={18} />, label: 'Comparisons' },
  '∈⊂': { icon: <Percent size={18} />, label: 'Set Theory' },
  'sin cos': { icon: <Minus size={18} />, label: 'Trigonometry' },
  ΣΠ: { icon: <Sigma size={18} />, label: 'Operators' },
  ΩΔ: { icon: <Plus size={18} />, label: 'Symbols' },
};

export const MATH_SYMBOLS = {
  123: [
    '+',
    '-',
    '\\times',
    '\\div',
    '=',
    '(',
    ')',
    '[',
    ']',
    '\\{',
    '\\}',
    '.',
    ',',
    '!',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
  ],
  αβγ: [
    'alpha',
    'beta',
    'gamma',
    'delta',
    'epsilon',
    'zeta',
    'eta',
    'theta',
    'iota',
    'kappa',
    'lambda',
    'mu',
    'nu',
    'xi',
    'omicron',
    'pi',
    'rho',
    'sigma',
    'tau',
    'upsilon',
    'phi',
    'chi',
    'psi',
    'omega',
  ],
  '≥≠': [
    ['<', '<'],
    ['>', '>'],
    ['leq', '≤'],
    ['geq', '≥'],
    ['neq', '≠'],
    ['approx', '≈'],
    ['equiv', '≡'],
    ['cong', '≅'],
    ['sim', '∼'],
    ['simeq', '≃'],
    ['propto', '∝'],
  ],
  '∈⊂': [
    ['in', '∈'],
    ['notin', '∉'],
    ['subset', '⊂'],
    ['supset', '⊃'],
    ['subseteq', '⊆'],
    ['supseteq', '⊇'],
    ['cap', '∩'],
    ['cup', '∪'],
    ['emptyset', '∅'],
    ['forall', '∀'],
    ['exists', '∃'],
    ['nexists', '∄'],
  ],
  'sin cos': [
    'sin',
    'cos',
    'tan',
    'sec',
    'csc',
    'cot',
    'arcsin',
    'arccos',
    'arctan',
    'sinh',
    'cosh',
    'tanh',
  ],
  ΣΠ: [
    { type: 'frac', display: '\\frac{\\Box}{\\Box}' },
    { type: 'exponent', display: '□^{2}' },
    { type: 'exponent', display: 'x^{□}' },
    { type: 'sqrt', display: '\\sqrt{\\Box}' },
    { type: 'nthroot', display: '\\sqrt[\\Box]{\\Box}' },
    { type: 'log', display: '\\log{\\Box}' },
    { type: 'pi', display: '\\pi' },
    { type: 'infty', display: '\\infty' },
    { type: 'integral', display: '\\int' },
    { type: 'sum', display: '\\sum' },
    { type: 'product', display: '\\prod' },
    { type: 'limit', display: '\\lim_{x \\to \\Box}' },
    { type: 'times', display: '\\times' },
    { type: 'div', display: '\\div' },
    { type: 'subscript', display: 'x_{\\Box}' },
  ],
  ΩΔ: [
    'Gamma',
    'Delta',
    'Theta',
    'Lambda',
    'Xi',
    'Pi',
    'Sigma',
    'Phi',
    'Psi',
    'Omega',
    'nabla',
    'partial',
    'hbar',
    'imath',
    'jmath',
  ],
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const satExamples = {
  beginner: [
    'Solve for x: 2x + 5 = 13',
    'Find the area of a rectangle with length 8 and width 5',
    'What is 15% of 80?',
    'Simplify: 3x + 2x - x',
    'If y = 2x + 3, find y when x = 4',
  ],
  intermediate: [
    'Solve the quadratic equation: x² - 5x + 6 = 0',
    'Find the slope of the line passing through (2, 3) and (5, 9)',
    'Simplify: √(48)',
    'If f(x) = x² + 2x - 1, find f(3)',
    'Solve the system: 2x + y = 7, x - y = 2',
  ],
  hard: [
    'Find the derivative of f(x) = 3x³ - 2x² + x - 5',
    'Solve: log₂(x + 1) + log₂(x - 1) = 3',
    'Find the integral: ∫(2x³ - 4x + 1)dx',
    'Given sin(θ) = 3/5, find cos(2θ)',
    'Find the limit: lim(x→∞) (3x² + 2x)/(x² - 1)',
  ],
};

export const paymentPlans = [
  {
    id: 1,
    title: "Free",
    description: "A Perfect way to start your journey",
    monthlyPrice: 0,
    annualPrice: 0,
  },
  {
    id: 2,
    title: "Pro",
    description: "Up to 10 users. Perfect for design teams, agencies and startups.",
    monthlyPrice: 8.99,
    annualPrice: 21.56,
  },
  {
    id: 3,
    title: "Premium",
    description: "Up to 10 users. Perfect for design teams, agencies and startups.",
    monthlyPrice: 18.99,
    annualPrice: 45.56,
  },
];

export const RAZORPAY_KEY = "rzp_test_MMVb9tQV2FQTuW"

export const SUBSCRIPTION_FEATURES = {
  free: [
    "Unlimited Homework Assistant queries",
    "Unlimited Smart Solution Checks",
    "2 AI Math Tutor credits monthly",
  ],
  pro: [
    "Unlimited Homework Assistant queries",
    "Unlimited Smart Solution Checks",
    "40 AI Math Tutor credits monthly",
  ],
  premium: [
    "Unlimited Homework Assistant queries",
    "Unlimited Smart Solution Checks",
    "Unlimited AI Math Tutor access",
  ]
};