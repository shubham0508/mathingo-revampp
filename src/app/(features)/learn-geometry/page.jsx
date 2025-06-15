// app/geometry/page.tsx

import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Calculator, BookOpen, Zap, CheckCircle, Users, Clock, Target, ArrowRight, Ruler, Compass, Shapes } from 'lucide-react';

export const metadata = generatePageMetadata({
    title: 'Explore Geometry - Shapes, Theorems & Proofs',
    description: 'A complete guide to geometry. Learn about shapes, angles, theorems like Pythagoras, and proofs with interactive examples, visualizations, and AI-powered help.',
    url: 'https://mathzai.com/geometry',
    keywords: ['geometry', 'shapes', 'angles', 'theorems', 'proofs', 'Pythagorean theorem', 'Euclidean geometry', 'coordinate geometry']
});

const fundamentalShapes = [
    { name: 'Triangle', formula: 'Area = ½ × b × h', description: 'A three-sided polygon, the foundation of trigonometry.' },
    { name: 'Circle', formula: 'Area = πr²', description: 'A perfectly round shape with all points equidistant from the center.' },
    { name: 'Square', formula: 'Area = s²', description: 'A quadrilateral with four equal sides and four right angles.' },
    { name: 'Rectangle', formula: 'Area = l × w', description: 'A quadrilateral with four right angles and opposite sides equal.' },
    { name: 'Trapezoid', formula: 'Area = ½(a+b)h', description: 'A quadrilateral with at least one pair of parallel sides.' },
    { name: 'Cylinder', formula: 'V = πr²h', description: 'A 3D shape with two parallel circular bases.' }
];

const geometryTopics = [
    { title: 'Points, Lines, and Planes', description: 'The fundamental building blocks of all geometric figures.', difficulty: 'Beginner', timeToMaster: '2-4 hours' },
    { title: 'Angles and Their Properties', description: 'Understanding acute, obtuse, right, and straight angles.', difficulty: 'Beginner', timeToMaster: '3-5 hours' },
    { title: 'Triangles and Quadrilaterals', description: 'Exploring the properties of the most common polygons.', difficulty: 'Intermediate', timeToMaster: '8-10 hours' },
    { title: 'The Pythagorean Theorem', description: 'The essential relationship in right-angled triangles.', difficulty: 'Intermediate', timeToMaster: '4-6 hours' },
    { title: 'Circles: Arcs, Chords, and Tangents', description: 'Diving deep into the properties of circles.', difficulty: 'Advanced', timeToMaster: '10-12 hours' },
    { title: 'Coordinate Geometry', description: 'Bridging algebra and geometry on the Cartesian plane.', difficulty: 'Advanced', timeToMaster: '12-15 hours' }
];

const realWorldApplications = [
    {
        title: 'Architecture & Engineering',
        description: 'Designing buildings, bridges, and infrastructure with stable and efficient shapes.',
        concepts: ['Triangulation for stability', 'Calculating material volumes', 'Blueprints and scale']
    },
    {
        title: 'Art, Design & Animation',
        description: 'Using perspective, symmetry, and tessellations to create visually appealing works.',
        concepts: ['Golden Ratio', 'Perspective drawing', '3D modeling for games/movies']
    },
    {
        title: 'Navigation & GPS',
        description: 'Calculating distances and positions on Earth using principles of spherical geometry.',
        concepts: ['Triangulation/Trilateration', 'Coordinate systems (Latitude/Longitude)', 'Shortest path calculation']
    },
    {
        title: 'Medical Imaging',
        description: 'Reconstructing 3D models of organs from 2D slices (CT scans, MRIs).',
        concepts: ['Geometric transformations', 'Volume rendering', 'Shape analysis']
    }
];

export default function GeometryPage() {
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
                            name: 'Mathz AI Geometry Course',
                            description: 'Comprehensive geometry learning platform with AI-powered tutoring and visual aids.',
                            url: 'https://mathzai.com/geometry',
                            courseMode: 'online',
                            educationalLevel: 'secondary education',
                            teaches: 'Geometry, Geometric Proofs, Spatial Reasoning, Trigonometry'
                        }
                    ])
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 rounded-sm">
                <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-cyan-600 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative container mx-auto px-4 py-8 sm:py-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                <Shapes className="w-4 h-4 mr-2" />
                                Comprehensive Geometry Guide
                            </Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                                Visualize and Conquer Geometry with
                                <span className="bg-gradient-to-r from-yellow-300 to-lime-300 bg-clip-text text-transparent"> AI-Powered Insights</span>
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
                                From points and lines to complex 3D shapes, master geometric concepts with interactive diagrams, step-by-step proofs, and instant AI assistance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-green-50">
                                    <Link href="/homework-assistant">
                                        <Ruler className="w-5 h-5 mr-2" />
                                        Start Exploring Shapes
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Ask an AI Geometer
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
                                What is Geometry?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        Geometry (from the Ancient Greek: γεωμετρία; geo- "earth", -metron "measurement") is a branch of mathematics concerned with properties of space such as the distance, shape, size, and relative position of figures.
                                    </p>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        It is one of the oldest mathematical sciences. Initially a body of practical knowledge concerning lengths, areas, and volumes, in the 3rd century BC, geometry was put into an axiomatic form by Euclid, whose treatment—Euclidean geometry—set a standard for many centuries to follow.
                                    </p>
                                    <Alert className="bg-green-50 border-green-200">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            <strong>Key Insight:</strong> Geometry is the art of good reasoning from bad drawings. It teaches us how to think logically and build rigorous arguments through proofs.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <Card className="bg-gradient-to-br from-green-50 to-cyan-50 border-green-200">
                                    <CardHeader>
                                        <CardTitle className="text-green-900">Core Geometric Concepts</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {['Points, Lines & Planes', 'Angles & Measurement', 'Polygons & Polyhedra', 'Circles & Spheres', 'Symmetry & Transformations', 'Theorems & Proofs'].map(concept => (
                                                <li key={concept} className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                    <span>{concept}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Fundamental Geometric Shapes & Formulas
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {fundamentalShapes.map((shape, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-green-900">{shape.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
                                            <code className="text-xl font-mono text-cyan-700 font-bold">
                                                {shape.formula}
                                            </code>
                                        </div>
                                        <p className="text-gray-600 text-sm">{shape.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                                <Link href="/smart-solution-check">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Calculate Area and Volume
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Your Geometry Learning Path
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Geometry is a visual journey. Start with the basics and build your way up to complex proofs and spatial reasoning.
                            </p>
                            <div className="space-y-6">
                                {geometryTopics.map((topic, index) => (
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

                <section className="py-16 bg-gradient-to-br from-green-50 to-cyan-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                                Deep Dive: The Pythagorean Theorem
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-green-900">The Core Principle</h3>
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        In any right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides (legs).
                                    </p>
                                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                        <code className="text-3xl font-mono text-cyan-700 font-bold">a² + b² = c²</code>
                                    </div>
                                    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-2">Practice Question:</h4>
                                        <p className="text-gray-700 text-sm">If a right triangle has legs of length 6 cm and 8 cm, what is the length of the hypotenuse?</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6 text-green-900">Worked Example</h3>
                                    <Card className="bg-white shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Find 'c' if a = 5 and b = 12</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="font-mono text-sm mb-2">Formula: a² + b² = c²</p>
                                                <p className="font-mono text-sm mb-2">Substitute values: 5² + 12² = c²</p>
                                                <p className="font-mono text-sm mb-2">Calculate squares: 25 + 144 = c²</p>
                                                <p className="font-mono text-sm mb-2">Sum the values: 169 = c²</p>
                                                <p className="font-mono text-sm mb-2">Find the square root: c = √169</p>
                                                <p className="font-mono text-sm text-green-700 font-semibold">Solution: c = 13</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <div className="text-center mt-12">
                                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get Help with Proofs
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                            Real-World Applications of Geometry
                        </h2>
                        <div className="max-w-6xl mx-auto">
                            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
                                Geometry is not confined to textbooks; it's the blueprint of the world around us. From the homes we live in to the technology we use, geometric principles are fundamental to design, function, and innovation.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                {realWorldApplications.map((app, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-green-900">{app.title}</CardTitle>
                                            <CardDescription className="text-gray-600">
                                                {app.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <h4 className="font-semibold text-gray-900 mb-3">Key Concepts:</h4>
                                            <ul className="space-y-2">
                                                {app.concepts.map((concept, cIndex) => (
                                                    <li key={cIndex} className="flex items-center text-sm text-gray-700">
                                                        <Compass className="w-4 h-4 mr-2 text-cyan-600 flex-shrink-0" />
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
                <section className="py-20 bg-gradient-to-r from-green-600 via-cyan-600 to-green-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                Ready to Master the World of Shapes?
                            </h2>
                            <p className="text-xl mb-8 text-green-100 leading-relaxed">
                                Don't let proofs and postulates intimidate you. Start building your geometric intuition with Mathz AI today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-green-50">
                                    <Link href="/homework-assistant">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Solve Geometry Problems
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-black border-white">
                                    <Link href="/ai-math-tutor">
                                        <Users className="w-5 h-5 mr-2" />
                                        Get Visual Explanations
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