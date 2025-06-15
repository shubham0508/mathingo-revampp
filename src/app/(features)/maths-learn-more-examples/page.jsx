import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Users, BookOpen, ArrowRight, Lightbulb, BarChart3, BrainCircuit, KeyRound, Network, Shuffle, CheckCircle, Calculator, Target, Zap, Trophy, Clock, Star, TrendingUp, Brain, FileCheck, MessageSquare } from 'lucide-react';

export const metadata = generatePageMetadata({
    title: 'Explore More Math Topics - Statistics, Logic & More',
    description: 'Dive into diverse mathematical fields beyond the basics. Explore statistics, probability, logic, number theory, linear algebra, and more with our AI-powered guides.',
    url: 'https://mathzai.com/more-examples',
    keywords: ['statistics', 'probability', 'logic', 'set theory', 'number theory', 'discrete math', 'linear algebra', 'mathematics topics']
});

const mathTopics = [
    {
        title: 'Statistics & Probability',
        icon: BarChart3,
        description: 'The science of collecting, analyzing, and interpreting data, and the mathematics of chance and uncertainty. Essential for data science, finance, and scientific research.',
        keyConcepts: ['Mean, Median, Mode', 'Standard Deviation', 'Probability Distributions', 'Hypothesis Testing'],
        realWorld: 'A/B testing for websites, clinical trials for new drugs, weather forecasting.',
        question: 'What is the median of the set {2, 5, 2, 8, 7, 4, 2}?',
        difficulty: 'Intermediate',
        studyTime: '4-6 weeks',
        careerPaths: ['Data Scientist', 'Market Researcher', 'Quality Analyst', 'Biostatistician'],
        prerequisite: 'Basic Algebra'
    },
    {
        title: 'Linear Algebra',
        icon: Shuffle,
        description: 'The study of vectors, vector spaces, linear transformations, and systems of linear equations. It is the mathematical backbone of machine learning and computer graphics.',
        keyConcepts: ['Vectors and Matrices', 'Eigenvalues & Eigenvectors', 'Vector Spaces', 'Determinants'],
        realWorld: 'Google\'s PageRank algorithm, 3D game rendering, data compression.',
        question: 'If you multiply a 3x2 matrix by a 2x4 matrix, what are the dimensions of the resulting matrix?',
        difficulty: 'Advanced',
        studyTime: '6-8 weeks',
        careerPaths: ['Machine Learning Engineer', 'Computer Graphics Designer', 'Data Engineer'],
        prerequisite: 'Algebra & Basic Calculus'
    },
    {
        title: 'Discrete Mathematics',
        icon: Network,
        description: 'The study of mathematical structures that are fundamentally discrete rather than continuous. It is the language of computer science.',
        keyConcepts: ['Graph Theory', 'Combinatorics', 'Set Theory', 'Recurrence Relations'],
        realWorld: 'Social network analysis, GPS navigation (shortest path), logistics and scheduling.',
        question: 'In a group of 5 people, how many unique handshakes are possible?',
        difficulty: 'Intermediate',
        studyTime: '5-7 weeks',
        careerPaths: ['Software Engineer', 'Algorithm Designer', 'Network Analyst'],
        prerequisite: 'Basic Logic & Algebra'
    },
    {
        title: 'Number Theory',
        icon: KeyRound,
        description: 'A branch of pure mathematics devoted primarily to the study of the integers and their properties. It has critical applications in modern cryptography.',
        keyConcepts: ['Prime Numbers', 'Modular Arithmetic', 'Diophantine Equations', 'Fermat\'s Last Theorem'],
        realWorld: 'RSA encryption that secures online communication, generating secure random numbers.',
        question: 'What is 7 mod 3?',
        difficulty: 'Advanced',
        studyTime: '8-10 weeks',
        careerPaths: ['Cryptographer', 'Security Analyst', 'Research Mathematician'],
        prerequisite: 'Strong Algebra Foundation'
    },
    {
        title: 'Logic and Set Theory',
        icon: BrainCircuit,
        description: 'The formal study of reasoning and the foundational principles of mathematics. It provides the rules for constructing valid arguments and categorizing collections of objects.',
        keyConcepts: ['Propositional Logic', 'Venn Diagrams', 'Set Operations (Union, Intersection)', 'Truth Tables'],
        realWorld: 'Designing computer circuits, database queries (SQL), and formal verification of software.',
        question: 'If P is "it is raining" and Q is "the ground is wet", what does P -> Q mean?',
        difficulty: 'Beginner to Intermediate',
        studyTime: '3-5 weeks',
        careerPaths: ['Software Developer', 'Database Administrator', 'Logic Designer'],
        prerequisite: 'Basic Mathematical Reasoning'
    }
];

const features = [
    {
        icon: Brain,
        title: 'AI-Powered Learning',
        description: 'Get personalized explanations tailored to your learning style and pace'
    },
    {
        icon: Target,
        title: 'Practice Problems',
        description: 'Access thousands of problems with step-by-step solutions'
    },
    {
        icon: Trophy,
        title: 'Progress Tracking',
        description: 'Monitor your improvement with detailed analytics and achievements'
    },
    {
        icon: Clock,
        title: '24/7 Availability',
        description: 'Learn at your own pace, anytime, anywhere'
    }
];

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Computer Science Student',
        quote: 'Linear algebra finally clicked for me thanks to the visual explanations and interactive examples!'
    },
    {
        name: 'Marcus Rodriguez',
        role: 'Data Analyst',
        quote: 'The statistics section helped me land my dream job. The real-world examples made all the difference.'
    }
];

export default function MoreExamplesPage() {
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
                            name: 'Mathz AI Advanced Topics',
                            description: 'Explore diverse fields of mathematics like statistics, logic, and number theory with AI-powered tutoring.',
                            url: 'https://mathzai.com/more-examples',
                            courseMode: 'online',
                            teaches: ['Statistics', 'Probability', 'Logic', 'Number Theory', 'Discrete Mathematics', 'Linear Algebra']
                        }
                    ])
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
                <section className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative container mx-auto px-4 py-20 sm:py-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Beyond the Classroom
                            </Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                                Discover the Vast Universe of
                                <span className="block text-black mt-2"> Mathematics</span>
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                                Math is more than just algebra and calculus. Explore fascinating fields like statistics, number theory, and logic that power our modern world.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-yellow-50 text-lg px-8 py-4">
                                    <Link href="/ai-math-tutor">
                                        <Lightbulb className="w-5 h-5 mr-2" />
                                        Start Your Exploration
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-white text-black text-lg px-8 py-4 hover:bg-gray-50">
                                    <Link href="/homework-assistant">
                                        <Calculator className="w-5 h-5 mr-2" />
                                        Get Homework Help
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex justify-center gap-8 text-yellow-100">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">50,000+</div>
                                    <div className="text-sm">Problems Solved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">5+</div>
                                    <div className="text-sm">Math Fields</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">24/7</div>
                                    <div className="text-sm">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                <section className="py-8 bg-white border-b" >
                    <div className="container mx-auto px-4">
                        <Alert className="max-w-4xl mx-auto bg-blue-50 border-blue-200 flex align-middle">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-blue-800 flex flex-row gap-1 mt-1">
                                <strong>Core Subjects:</strong> Master the fundamentals with our comprehensive guides for{' '}
                                <Link href="/learn-algebra" className="font-bold underline hover:text-blue-900">Algebra</Link>,{' '}
                                <Link href="/learn-geometry" className="font-bold underline hover:text-blue-900">Geometry</Link>, and{' '}
                                <Link href="/learn-calculus" className="font-bold underline hover:text-blue-900">Calculus</Link>.
                            </AlertDescription>
                        </Alert>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                                Why Choose Our AI Math Platform?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Experience the future of mathematics education with cutting-edge AI technology
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
                                    <CardContent className="p-6">
                                        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <feature.icon className="w-8 h-8 text-orange-600" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Math Topics Section */}
                <section section className="py-20 bg-white" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                                Explore Diverse Mathematical Fields
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Each field offers unique insights and practical applications. Choose your path and start learning today.
                            </p>
                        </div>
                        <div className="max-w-6xl mx-auto space-y-12">
                            {mathTopics.map((topic, index) => (
                                <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-l-orange-500">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-orange-50 p-6">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <CardTitle className="text-2xl text-gray-900 flex items-center">
                                                <topic.icon className="w-8 h-8 mr-4 text-orange-600" />
                                                {topic.title}
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="text-lg">
                                                    {topic.difficulty}
                                                </Badge>
                                                <Badge variant="secondary" className="text-lg">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {topic.studyTime}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid lg:grid-cols-3 gap-6 mb-6">
                                            <div className="lg:col-span-2">
                                                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                    <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                                                    What You'll Learn
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed mb-4">{topic.description}</p>

                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-md mb-3 text-gray-800">Key Concepts</h4>
                                                        <ul className="space-y-2">
                                                            {topic.keyConcepts.map(concept => (
                                                                <li key={concept} className="flex items-center text-sm text-gray-700">
                                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                                                    {concept}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-md mb-3 text-gray-800">Prerequisites</h4>
                                                        <Badge variant="outline" className="mb-3">
                                                            {topic.prerequisite}
                                                        </Badge>
                                                        <h4 className="font-semibold text-md mb-2 text-gray-800">Career Paths</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {topic.careerPaths.slice(0, 2).map(career => (
                                                                <Badge key={career} variant="secondary" className="text-lg">
                                                                    {career}
                                                                </Badge>
                                                            ))}
                                                            {topic.careerPaths.length > 2 && (
                                                                <Badge variant="secondary" className="text-lg">
                                                                    +{topic.careerPaths.length - 2} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Alert className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                    <AlertDescription className="text-blue-800">
                                                        <strong>Real-World Impact:</strong><br />
                                                        {topic.realWorld}
                                                    </AlertDescription>
                                                </Alert>

                                                <Alert className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                                    <Brain className="h-4 w-4 text-green-600" />
                                                    <AlertDescription className="text-green-800">
                                                        <strong>Quick Challenge:</strong><br />
                                                        {topic.question}
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                                            <div className="flex gap-2">
                                                <Button asChild size="lg">
                                                    <Link href="/ai-math-tutor">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        Start Learning
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="lg">
                                                    <Link href="/homework-assistant">
                                                        <Calculator className="w-4 h-4 mr-2" />
                                                        Practice Problems
                                                    </Link>
                                                </Button>
                                            </div>
                                            <Button asChild variant="ghost" size="lg" className="text-orange-600 hover:text-orange-700">
                                                <Link href="/smart-solution-check">
                                                    <FileCheck className="w-4 h-4 mr-2" />
                                                    Check Your Work
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                                What Our Learners Say
                            </h2>
                            <p className="text-xl text-gray-600">
                                Join thousands of students achieving their math goals
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="bg-white/80 backdrop-blur border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gradient-to-r from-yellow-500 to-orange-600 text-white relative overflow-hidden" >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                Your Mathematical Journey
                                <span className="block text-black">Starts Here</span>
                            </h2>
                            <p className="text-xl mb-8 text-yellow-100 leading-relaxed max-w-2xl mx-auto">
                                Whatever mathematical topic sparks your interest, our AI is ready to be your guide. Ask any question, explore any concept, and satisfy your intellectual curiosity.
                            </p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-yellow-50">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        AI Tutor Chat
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="bg-black/20 text-white hover:bg-black/30 border border-white/30">
                                    <Link href="/homework-assistant">
                                        <Calculator className="w-5 h-5 mr-2" />
                                        Homework Help
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="bg-black/20 text-white hover:bg-black/30 border border-white/30">
                                    <Link href="/smart-solution-check">
                                        <FileCheck className="w-5 h-5 mr-2" />
                                        Check Solutions
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="bg-black/20 text-white hover:bg-black/30 border border-white/30">
                                    <Link href="/learn-algebra">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Start with Algebra
                                    </Link>
                                </Button>
                            </div>
                            <div className="text-yellow-100 text-sm">
                                <p>✨ Free to start • No credit card required • Instant access</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    );
}