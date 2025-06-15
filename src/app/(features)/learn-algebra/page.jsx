import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Calculator, BookOpen, Zap, CheckCircle, Users, Clock, Target, ArrowRight } from 'lucide-react';

export const metadata = generatePageMetadata({
    title: 'Master Algebra - Complete Guide to Algebraic Concepts',
    description: 'Learn algebra from basics to advanced concepts. Master equations, polynomials, functions, and more with step-by-step explanations, practice problems, and AI-powered tutoring.',
    url: 'https://mathzai.com/algebra',
});

const algebraicEquations = [
    { name: 'Linear Equation', equation: 'ax + b = 0', description: 'Simplest form of algebraic equation' },
    { name: 'Quadratic Equation', equation: 'ax² + bx + c = 0', description: 'Second-degree polynomial equation' },
    { name: 'Cubic Equation', equation: 'ax³ + bx² + cx + d = 0', description: 'Third-degree polynomial equation' },
    { name: 'Exponential Function', equation: 'f(x) = aˣ', description: 'Function with variable exponent' },
    { name: 'Logarithmic Function', equation: 'f(x) = log_a(x)', description: 'Inverse of exponential function' },
    { name: 'Rational Function', equation: 'f(x) = P(x)/Q(x)', description: 'Ratio of two polynomials' }
];

const algebraTopics = [
    { title: 'Variables and Constants', description: 'Understanding symbols that represent numbers', difficulty: 'Beginner', timeToMaster: '2-3 hours' },
    { title: 'Linear Equations', description: 'Solving equations with one variable', difficulty: 'Beginner', timeToMaster: '4-6 hours' },
    { title: 'Systems of Equations', description: 'Solving multiple equations simultaneously', difficulty: 'Intermediate', timeToMaster: '8-10 hours' },
    { title: 'Quadratic Equations', description: 'Working with second-degree polynomials', difficulty: 'Intermediate', timeToMaster: '10-12 hours' },
    { title: 'Polynomial Functions', description: 'Understanding multi-term expressions', difficulty: 'Advanced', timeToMaster: '12-15 hours' },
    { title: 'Rational Expressions', description: 'Working with algebraic fractions', difficulty: 'Advanced', timeToMaster: '15-18 hours' }
];

const realWorldApplications = [
    {
        title: 'Engineering & Physics',
        description: 'Designing bridges, calculating trajectories, analyzing electrical circuits',
        equations: ['F = ma', 'V = IR', 'E = mc²']
    },
    {
        title: 'Finance & Economics',
        description: 'Compound interest, investment growth, market analysis',
        equations: ['A = P(1 + r)ᵗ', 'NPV = Σ(Cₜ/(1+r)ᵗ)', 'ROI = (Gain - Cost)/Cost']
    },
    {
        title: 'Computer Science',
        description: 'Algorithm complexity, data structures, machine learning',
        equations: ['O(n²)', 'f(x) = wx + b', 'E = -Σ(y log(ŷ))']
    },
    {
        title: 'Medicine & Biology',
        description: 'Drug dosage calculations, population dynamics, genetic analysis',
        equations: ['C = C₀e^(-kt)', 'dN/dt = rN(1-N/K)', 'H-W: p² + 2pq + q² = 1']
    }
];

export default function AlgebraPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        createOrganizationSchema(),
                        createWebsiteSchema(),
                        {
                            '@context': 'https://schema.org',
                            '@type': 'EducationalOrganization',
                            name: 'Mathz AI Algebra Course',
                            description: 'Comprehensive algebra learning platform with AI-powered tutoring',
                            url: 'https://mathzai.com/algebra',
                            courseMode: 'online',
                            educationalLevel: 'secondary education',
                            teaches: 'Algebra, Mathematical Problem Solving, Equation Solving'
                        }
                    ])
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-sm">
                <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative container mx-auto px-4 py-20 sm:py-32">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Complete Algebra Guide
                            </Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                                Master Algebra with
                                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> AI-Powered Learning</span>
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                                From basic variables to advanced polynomial functions, learn algebra step-by-step with personalized AI tutoring and instant feedback.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
                                    <Link href="/homework-assistant">
                                        <Calculator className="w-5 h-5 mr-2" />
                                        Start Learning Now
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get AI Tutor
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What is Algebra Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                What is Algebra?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. It's the language of mathematics that allows us to describe patterns, relationships, and solve complex problems systematically.
                                    </p>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        Think of algebra as a powerful tool that extends arithmetic. While arithmetic deals with specific numbers, algebra uses variables (like x, y, z) to represent unknown values, making it possible to solve problems in a general way.
                                    </p>
                                    <Alert className="bg-blue-50 border-blue-200">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <AlertDescription className="text-blue-800">
                                            <strong>Key Insight:</strong> Algebra is everywhere around us - from calculating tips at restaurants to determining loan payments, from designing video games to analyzing scientific data.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-blue-900">Core Algebraic Concepts</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            <li className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>Variables and Constants</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>Equations and Inequalities</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>Functions and Graphs</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>Polynomials and Factoring</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>Systems of Equations</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Essential Algebraic Equations */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Essential Algebraic Equations
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {algebraicEquations.map((eq, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-blue-900">{eq.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
                                            <code className="text-xl font-mono text-purple-700 font-bold">
                                                {eq.equation}
                                            </code>
                                        </div>
                                        <p className="text-gray-600 text-sm">{eq.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/smart-solution-check">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Practice Solving Equations
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Algebra Learning Path */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Your Algebra Learning Journey
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Algebra builds upon itself systematically. Each concept prepares you for the next level. Here's your structured path to algebraic mastery:
                            </p>
                            <div className="space-y-6">
                                {algebraTopics.map((topic, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {index + 1}. {topic.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-3">{topic.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            <Target className="w-3 h-3 mr-1" />
                                                            {topic.difficulty}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {topic.timeToMaster}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href="/homework-assistant">
                                                        Start Topic
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Deep Dive: Solving Linear Equations */}
                <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Deep Dive: Solving Linear Equations
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Step-by-Step Process</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-2">1. Identify the Equation</h4>
                                            <p className="text-gray-700 text-sm">A linear equation has the form ax + b = c, where a ≠ 0</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-2">2. Isolate the Variable</h4>
                                            <p className="text-gray-700 text-sm">Use inverse operations to get the variable alone on one side</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-2">3. Simplify</h4>
                                            <p className="text-gray-700 text-sm">Perform all arithmetic operations to find the solution</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-2">4. Check Your Answer</h4>
                                            <p className="text-gray-700 text-sm">Substitute back into the original equation to verify</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Worked Example</h3>
                                    <Card className="bg-white shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Solve: 3x + 7 = 22</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="font-mono text-sm mb-2">Original equation: 3x + 7 = 22</p>
                                                <p className="font-mono text-sm mb-2">Subtract 7 from both sides: 3x = 15</p>
                                                <p className="font-mono text-sm mb-2">Divide both sides by 3: x = 5</p>
                                                <p className="font-mono text-sm text-green-700 font-semibold">Solution: x = 5</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-semibold mb-2">Verification:</p>
                                                <p className="font-mono text-sm text-green-700">3(5) + 7 = 15 + 7 = 22 ✓</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <div className="text-center mt-12">
                                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get Personalized Tutoring
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-World Applications */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Real-World Applications of Algebra
                        </h2>
                        <div className="max-w-6xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Algebra isn't just abstract mathematics—it's the foundation of countless real-world applications that shape our modern world. From the technology in your smartphone to the medications that save lives, algebraic principles are at work everywhere.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                {realWorldApplications.map((app, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-blue-900">{app.title}</CardTitle>
                                            <CardDescription className="text-gray-600">
                                                {app.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <h4 className="font-semibold text-gray-900 mb-3">Key Equations:</h4>
                                            <div className="space-y-2">
                                                {app.equations.map((eq, eqIndex) => (
                                                    <div key={eqIndex} className="bg-gray-50 p-3 rounded-lg">
                                                        <code className="text-purple-700 font-mono font-semibold">{eq}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Advanced Algebra Concepts */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Advanced Algebra Concepts
                            </h2>
                            <div className="space-y-12">
                                {/* Quadratic Functions */}
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Quadratic Functions and Parabolas</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                Quadratic functions form the foundation of advanced algebra. They create parabolic curves that model everything from projectile motion to profit optimization in business.
                                            </p>
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <h4 className="font-semibold mb-2">Standard Form:</h4>
                                                <code className="text-lg font-mono text-purple-700 font-bold">f(x) = ax² + bx + c</code>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3 text-gray-900">Key Properties:</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• Vertex form reveals the turning point</li>
                                                <li>• Discriminant determines number of solutions</li>
                                                <li>• Axis of symmetry divides the parabola</li>
                                                <li>{'• Opens upward if a > 0, downward if a < 0'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Systems of Equations */}
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Systems of Equations</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                When multiple equations work together, they form systems that can be solved using substitution, elimination, or graphical methods. These are crucial for optimization problems.
                                            </p>
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <h4 className="font-semibold mb-2">Example System:</h4>
                                                <div className="font-mono text-purple-700">
                                                    <div>2x + 3y = 12</div>
                                                    <div>x - y = 1</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3 text-gray-900">Solution Methods:</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• <strong>Substitution:</strong> Solve for one variable, substitute into other equation</li>
                                                <li>• <strong>Elimination:</strong> Add/subtract equations to eliminate a variable</li>
                                                <li>• <strong>Graphical:</strong> Find intersection points of the lines</li>
                                                <li>• <strong>Matrix:</strong> Use matrices for larger systems</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Polynomial Functions */}
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Polynomial Functions</h3>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        Polynomials are algebraic expressions with multiple terms. They're incredibly versatile and appear in calculus, physics, engineering, and computer science. Understanding their behavior helps solve complex real-world problems.
                                    </p>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <Card className="bg-white">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">Degree 1 (Linear)</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <code className="text-purple-700 font-mono">f(x) = mx + b</code>
                                                <p className="text-sm text-gray-600 mt-2">Straight line, constant rate of change</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">Degree 2 (Quadratic)</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <code className="text-purple-700 font-mono">f(x) = ax² + bx + c</code>
                                                <p className="text-sm text-gray-600 mt-2">Parabola, one turning point</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">Degree 3 (Cubic)</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <code className="text-purple-700 font-mono">f(x) = ax³ + bx² + cx + d</code>
                                                <p className="text-sm text-gray-600 mt-2">S-shaped curve, up to 2 turning points</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-12">
                                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    <Link href="/smart-solution-check">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Master Advanced Concepts
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem-Solving Strategies */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Essential Problem-Solving Strategies
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">The PEMDAS Approach</h3>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        When solving complex algebraic expressions, following the correct order of operations is crucial. PEMDAS helps you tackle even the most complicated equations systematically.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <strong className="text-purple-700">P</strong>arentheses - Solve expressions in parentheses first
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <strong className="text-purple-700">E</strong>xponents - Handle powers and roots
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <strong className="text-purple-700">M</strong>ultiplication & <strong className="text-purple-700">D</strong>ivision - From left to right
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <strong className="text-purple-700">A</strong>ddition & <strong className="text-purple-700">S</strong>ubtraction - From left to right
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Problem-Solving Framework</h3>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        Successful algebra problem-solving requires a systematic approach. This framework works for everything from simple equations to complex word problems.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Understand the Problem</h4>
                                                <p className="text-gray-600 text-sm">Read carefully, identify what you're solving for</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Plan Your Approach</h4>
                                                <p className="text-gray-600 text-sm">Choose the right method or formula</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Execute the Solution</h4>
                                                <p className="text-gray-600 text-sm">Work step-by-step, show all work</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Verify Your Answer</h4>
                                                <p className="text-gray-600 text-sm">Check if your solution makes sense</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Common Mistakes and How to Avoid Them */}
                <section className="py-16 bg-red-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Common Algebra Mistakes & How to Avoid Them
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="bg-white border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-red-700 flex items-center">
                                            <span className="bg-red-100 rounded-full p-2 mr-3">⚠️</span>
                                            Sign Errors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="bg-red-50 p-3 rounded-lg">
                                                <p className="text-red-800 font-mono text-sm">❌ -3x + 5 = 2x - 7</p>
                                                <p className="text-red-800 font-mono text-sm">❌ -3x - 2x = -7 + 5</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-green-800 font-mono text-sm">✅ -3x + 5 = 2x - 7</p>
                                                <p className="text-green-800 font-mono text-sm">✅ -3x - 2x = -7 - 5</p>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                <strong>Solution:</strong> When moving terms across the equals sign, always change the sign. Double-check your work by color-coding positive and negative terms.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-red-700 flex items-center">
                                            <span className="bg-red-100 rounded-full p-2 mr-3">⚠️</span>
                                            Distribution Errors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="bg-red-50 p-3 rounded-lg">
                                                <p className="text-red-800 font-mono text-sm">❌ 3(x + 4) = 3x + 4</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-green-800 font-mono text-sm">✅ 3(x + 4) = 3x + 12</p>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                <strong>Solution:</strong> Distribute the coefficient to EVERY term inside the parentheses. Use the acronym "FOIL" for binomial multiplication.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-red-700 flex items-center">
                                            <span className="bg-red-100 rounded-full p-2 mr-3">⚠️</span>
                                            Combining Unlike Terms
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="bg-red-50 p-3 rounded-lg">
                                                <p className="text-red-800 font-mono text-sm">❌ 3x² + 5x = 8x³</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-green-800 font-mono text-sm">✅ 3x² + 5x (cannot be simplified)</p>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                <strong>Solution:</strong> Only combine terms with identical variable parts. 3x² and 5x have different powers, so they cannot be combined.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-red-700 flex items-center">
                                            <span className="bg-red-100 rounded-full p-2 mr-3">⚠️</span>
                                            Forgetting to Check Solutions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 text-sm mb-3">
                                                Many students find a solution but forget to verify it works in the original equation.
                                            </p>
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-blue-800 text-sm">
                                                    <strong>Always substitute your answer back into the original equation.</strong> If both sides equal the same value, your solution is correct!
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="text-center mt-12">
                                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                                    <Link href="/homework-assistant">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Practice Mistake-Free Solutions
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Study Tips and Learning Strategies */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Proven Study Strategies for Algebra Success
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Active Learning Techniques</h3>
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                            <h4 className="font-semibold text-blue-900 mb-2">📝 Practice, Practice, Practice</h4>
                                            <p className="text-blue-800 text-sm">
                                                Algebra is like learning to ride a bike - you need hands-on practice. Aim for 15-20 problems per topic, starting with easy ones and gradually increasing difficulty.
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                            <h4 className="font-semibold text-green-900 mb-2">🎯 Focus on Understanding, Not Memorization</h4>
                                            <p className="text-green-800 text-sm">
                                                Don't just memorize formulas - understand why they work. Ask yourself "What is this equation telling me?" and "Why does this step make sense?"
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                                            <h4 className="font-semibold text-purple-900 mb-2">🧠 Use Multiple Representations</h4>
                                            <p className="text-purple-800 text-sm">
                                                Express the same concept using equations, graphs, tables, and words. This builds deeper understanding and helps you tackle problems from different angles.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-blue-900">Time Management & Organization</h3>
                                    <div className="space-y-4">
                                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                                            <h4 className="font-semibold text-orange-900 mb-2">⏰ Spaced Repetition</h4>
                                            <p className="text-orange-800 text-sm">
                                                Review algebra concepts at increasing intervals: after 1 day, 3 days, 1 week, 2 weeks. This strengthens long-term retention better than cramming.
                                            </p>
                                        </div>
                                        <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                                            <h4 className="font-semibold text-teal-900 mb-2">📊 Track Your Progress</h4>
                                            <p className="text-teal-800 text-sm">
                                                Keep a learning journal. Note which topics you find challenging and celebrate small wins. Seeing your progress motivates continued effort.
                                            </p>
                                        </div>
                                        <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
                                            <h4 className="font-semibold text-pink-900 mb-2">👥 Study Groups & Teaching Others</h4>
                                            <p className="text-pink-800 text-sm">
                                                Explaining algebra concepts to friends reveals gaps in your understanding. If you can teach it clearly, you truly understand it.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Alert className="mt-8 bg-blue-50 border-blue-200">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <AlertDescription className="text-blue-800">
                                    <strong>Pro Tip:</strong> Create a "mistake journal" where you record errors you make and their correct solutions. Reviewing this before tests helps you avoid repeating the same mistakes.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </section>

                {/* Technology and Tools */}
                <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900">
                                Leverage Technology for Algebra Mastery
                            </h2>
                            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
                                In today's digital age, you have powerful tools at your fingertips to accelerate your algebra learning. From AI tutors to interactive graphing calculators, technology can provide personalized support that adapts to your learning style.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <Calculator className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg text-center">AI-Powered Problem Solving</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm text-center mb-4">
                                            Get instant step-by-step solutions with explanations tailored to your learning level.
                                        </p>
                                        <Button asChild className="w-full" size="sm">
                                            <Link href="/homework-assistant">Try Homework Assistant</Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                        <CardTitle className="text-lg text-center">Personalized Tutoring</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm text-center mb-4">
                                            Get real-time help from AI tutors who adapt to your learning pace and style.
                                        </p>
                                        <Button asChild className="w-full" size="sm" variant="outline">
                                            <Link href="/ai-math-tutor">Start Tutoring Session</Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <CardTitle className="text-lg text-center">Smart Solution Checking</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm text-center mb-4">
                                            Verify your work and get detailed feedback on your problem-solving approach.
                                        </p>
                                        <Button asChild className="w-full" size="sm" variant="outline">
                                            <Link href="/smart-solution-check">Check Solutions</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Why Choose Mathz AI for Algebra?</h3>
                                <div className="grid md:grid-cols-2 gap-6 text-left">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Adaptive Learning</h4>
                                                <p className="text-gray-600 text-sm">Our AI adjusts difficulty based on your progress and identifies knowledge gaps automatically.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">24/7 Availability</h4>
                                                <p className="text-gray-600 text-sm">Get help whenever you need it - no scheduling required, no waiting for office hours.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Step-by-Step Explanations</h4>
                                                <p className="text-gray-600 text-sm">Every solution includes detailed reasoning, helping you understand the 'why' behind each step.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Multiple Learning Styles</h4>
                                                <p className="text-gray-600 text-sm">Visual learners get graphs, kinesthetic learners get interactive problems, and auditory learners get clear explanations.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                                                <p className="text-gray-600 text-sm">Monitor your improvement with detailed analytics and personalized study recommendations.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Exam Preparation</h4>
                                                <p className="text-gray-600 text-sm">Targeted practice problems and mock tests to prepare you for standardized tests and school exams.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                Ready to Master Algebra?
                            </h2>
                            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                                Join thousands of students who have transformed their algebra skills with Mathz AI. Start your journey from confused to confident today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
                                    <Link href="/homework-assistant">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Start Free Learning
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get Personal Tutor
                                    </Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-300">10,000+</div>
                                    <div className="text-blue-100 text-sm">Problems Solved Daily</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-300">95%</div>
                                    <div className="text-blue-100 text-sm">Student Success Rate</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-300">24/7</div>
                                    <div className="text-blue-100 text-sm">AI Tutor Available</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}