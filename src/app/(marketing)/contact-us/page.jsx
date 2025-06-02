import Contact from '@/components/marketing/contactUs';

export const metadata = {
  title: "Contact Mathz AI – Get Support & Math Learning Assistance",
  description: "Need help with Mathz AI? Contact us for support, inquiries, or assistance with AI-powered math tutoring and homework solutions. We're here to help!",
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: "Contact Mathz AI – Get Support & Math Learning Assistance",
    description: "Need help with Mathz AI? Contact us for support, inquiries, or assistance with AI-powered math tutoring and homework solutions. We're here to help!",
    url: "https://www.mathzai.com/contact-us",
    type: "website",
  },
};

const ContactPage = () => {
  return (
    <Contact />
  )
}

export default ContactPage