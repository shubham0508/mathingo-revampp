// app/calculus/page.tsx

import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Calculator, BookOpen, Zap, CheckCircle, Users, Clock, Target, ArrowRight, Infinity, TrendingUp, AreaChart, FunctionSquare } from 'lucide-react';

export const metadata = generatePageMetadata({
    title: 'Master Calculus - Derivatives, Integrals & Limits',
    description: 'A complete guide to calculus. Understand limits, derivatives, and integrals with detailed explanations, real-world examples, and AI-driven support for complex problems.',
    url: 'https://mathzai.com/calculus',
    keywords: ['calculus', 'derivatives', 'integrals', 'limits', 'differentiation', 'integration', 'calculus help', 'calculus tutor']
});

const calculusPillars = [
    { name: 'Limits', notation: 'lim f(x) as x → c', description: 'Describes the value a function approaches as the input approaches some value.' },
    { name: 'Derivatives', notation: "f'(x) or dy/dx", description: 'Measures the instantaneous rate of change of a function; its slope at a point.' },
    { name: 'Integrals', notation: '∫f(x)dx', description: 'Represents the accumulation of quantities, such as the area under a curve.' }
];

const calculusTopics = [
    { title: 'Limits and Continuity', description: 'The conceptual foundation upon which all of calculus is built.', difficulty: 'Beginner', timeToMaster: '8-10 hours' },
    { title: 'Differentiation: The Derivative', description: 'Learning the rules to find rates of change (Power, Product, Quotient, Chain rules).', difficulty: 'Intermediate', timeToMaster: '15-20 hours' },
    { title: 'Applications of Differentiation', description: 'Using derivatives to solve optimization, related rates, and curve sketching problems.', difficulty: 'Intermediate', timeToMaster: '12-15 hours' },
    { title: 'Integration: The Antiderivative', description: 'Mastering the techniques to find the area under curves and accumulate quantities.', difficulty: 'Advanced', timeToMaster: '20-25 hours' },
    { title: 'The Fundamental Theorem of Calculus', description: 'The profound link connecting derivatives and integrals.', difficulty: 'Advanced', timeToMaster: '5-8 hours' },
    { title: 'Differential Equations', description: 'Modeling real-world phenomena involving rates of change.', difficulty: 'Expert', timeToMaster: '25-30 hours' }
];

const realWorldApplications = [
    {
        title: 'Physics & Engineering',
        description: 'Modeling motion, acceleration, fluid flow, and electrical circuits.',
        concepts: ['Velocity as the derivative of position', 'Work as an integral of force', 'Optimization of structures']
    },
    {
        title: 'Economics & Finance',
        description: 'Calculating marginal cost/revenue and optimizing investment strategies.',
        concepts: ['Marginal analysis (derivatives)', 'Consumer surplus (integrals)', 'Black-Scholes model']
    },
    {
        title: 'Computer Science & AI',
        description: 'Training machine learning models and creating realistic graphics.',
        concepts: ['Gradient descent for optimization', 'Physics engines in gaming', 'Image processing algorithms']
    },
    {
        title: 'Medicine & Biology',
        description: 'Modeling population growth, drug concentration, and blood flow.',
        concepts: ['Logistic growth models', 'Pharmacokinetics', 'Tumor growth rates']
    }
];

export default function CalculusPage() {
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
                            name: 'Mathz AI Calculus Course',
                            description: 'Advanced calculus learning platform with AI-powered problem solving for derivatives, integrals, and limits.',
                            url: 'https://mathzai.com/calculus',
                            courseMode: 'online',
                            educationalLevel: 'tertiary education',
                            teaches: 'Calculus, Differentiation, Integration, Limits, Differential Equations'
                        }
                    ])
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-sm">
                <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative container mx-auto px-4 py-8 sm:py-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                <FunctionSquare className="w-4 h-4 mr-2" />
                                The Mathematics of Change
                            </Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                                Unlock the Power of Calculus with
                                <span className="bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent"> AI-Driven Clarity</span>
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
                                Grasp the concepts of limits, derivatives, and integrals. Solve complex problems with step-by-step guidance from our advanced AI tutor.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-purple-50">
                                    <Link href="/homework-assistant">
                                        <Calculator className="w-5 h-5 mr-2" />
                                        Solve a Calculus Problem
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Chat with an AI Tutor
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                What is Calculus?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        Calculus is the mathematical study of continuous change. It provides the tools to understand and describe how things change over time, from the motion of planets to fluctuations in the stock market.
                                    </p>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        It has two major branches: <strong>Differential Calculus</strong>, which concerns instantaneous rates of change and the slopes of curves, and <strong>Integral Calculus</strong>, which concerns the accumulation of quantities and the areas under or between curves.
                                    </p>
                                    <Alert className="bg-purple-50 border-purple-200">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        <AlertDescription className="text-purple-800">
                                            <strong>Key Insight:</strong> The two branches are linked by the <a href="#ftc" className="font-bold underline">Fundamental Theorem of Calculus</a>, one of the most important discoveries in mathematics.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {calculusPillars.map((pillar) => (
                                         <Card key={pillar.name} className="bg-gradient-to-r from-purple-50 to-indigo-50">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-purple-900 flex items-center justify-between">
                                                    {pillar.name}
                                                    {pillar.name === 'Limits' && <Infinity className="w-5 h-5" />}
                                                    {pillar.name === 'Derivatives' && <TrendingUp className="w-5 h-5" />}
                                                    {pillar.name === 'Integrals' && <AreaChart className="w-5 h-5" />}
                                                </CardTitle>
                                                <code className='text-indigo-600 font-mono pt-1'>{pillar.notation}</code>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-700">{pillar.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Your Calculus Learning Roadmap
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Calculus is a challenging but rewarding journey. Follow this structured path to build a solid understanding from the ground up.
                            </p>
                            <div className="space-y-6">
                                {calculusTopics.map((topic, index) => (
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

                <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Deep Dive: Finding a Derivative
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-purple-900">The Power Rule</h3>
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        The Power Rule is one of the most fundamental differentiation rules. It states that to find the derivative of a variable raised to a power, you bring the power down as a multiplier and then subtract one from the original power.
                                    </p>
                                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                        <p className="mb-2 text-gray-600">If <code className="font-mono">f(x) = xⁿ</code></p>
                                        <p className="text-xl font-bold text-indigo-700">Then <code className="font-mono">f'(x) = nxⁿ⁻¹</code></p>
                                    </div>
                                    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-2">Practice Question:</h4>
                                        <p className="text-gray-700 text-sm">Using the power rule, what is the derivative of <code className="font-mono">f(x) = 5x⁴</code>?</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-purple-900">Worked Example</h3>
                                    <Card className="bg-white shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Find the derivative of f(x) = 3x² + 2x - 5</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="font-mono text-sm mb-2">Term 1 (3x²): 3 × 2x²⁻¹ = 6x¹ = 6x</p>
                                                <p className="font-mono text-sm mb-2">Term 2 (2x): 2 × 1x¹⁻¹ = 2x⁰ = 2</p>
                                                <p className="font-mono text-sm mb-2">Term 3 (-5): Derivative of a constant is 0</p>
                                                <Separator className="my-2" />
                                                <p className="font-mono text-sm text-purple-700 font-semibold">Solution: f'(x) = 6x + 2</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <div className="text-center mt-12">
                                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                    <Link href="/smart-solution-check">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Check Your Derivatives
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="ftc" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Real-World Impact of Calculus
                        </h2>
                         <div className="max-w-6xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Calculus is the language of science and engineering. It's the mathematical engine behind many of modern society's greatest technological achievements.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                {realWorldApplications.map((app, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-purple-900">{app.title}</CardTitle>
                                            <CardDescription className="text-gray-600">
                                                {app.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <h4 className="font-semibold text-gray-900 mb-3">Key Concepts:</h4>
                                            <ul className="space-y-2">
                                                {app.concepts.map((concept, cIndex) => (
                                                   <li key={cIndex} className="flex items-center text-sm text-gray-700">
                                                        <FunctionSquare className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                                                        <span>{concept}</span>
                                                   </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                Ready to Master the Mathematics of Change?
                            </h2>
                            <p className="text-xl mb-8 text-purple-100 leading-relaxed">
                                Stop struggling with complex concepts. Let Mathz AI guide you through the intricacies of calculus and build your confidence for exams and beyond.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-purple-50">
                                    <Link href="/homework-assistant">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Solve Now
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get Expert Help
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}