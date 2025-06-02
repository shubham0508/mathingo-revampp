import AboutUs from "@/components/marketing/aboutUs";
import React from "react";

export const metadata = {
  title: "About Mathz AI – AI-Powered Math Learning & Tutoring",
  description:
    "Discover how Mathz AI makes math learning smarter and stress-free with AI-powered tutoring, step-by-step solutions, and answer verification.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About Mathz AI – AI-Powered Math Learning & Tutoring",
    description:
      "Discover how Mathz AI makes math learning smarter and stress-free with AI-powered tutoring, step-by-step solutions, and answer verification.",
    url: "https://www.mathzai.com/about-us",
    type: "website",
  },
};

const AboutUsPage = () => {
  return <AboutUs />;
};

export default AboutUsPage;
