import MathQuizComponent from '@/components/marketing/mathQuiz';
import React from 'react'

export const metadata = {
  title: "Mathz AI – Interactive Math Quiz for AI-Powered Learning",
  description: "Test your math skills with Mathz AI’s interactive quiz. Get AI-powered solutions, step-by-step explanations, and instant answer verification.",
  alternates: {
    canonical: "/math-quiz",
  },
  openGraph: {
    title: "Mathz AI – Interactive Math Quiz for AI-Powered Learning",
    description: "Challenge yourself with AI-driven math quizzes. Improve problem-solving skills with step-by-step solutions and real-time feedback.",
    url: "https://www.mathzai.com/math-quiz",
    type: "website",
  },
};

const MathQuiz = () => {  
  return (
    <MathQuizComponent />
  )
}

export default MathQuiz
