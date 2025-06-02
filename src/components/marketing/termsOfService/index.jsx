const TermsOfService = () => {
    const lastUpdatedDate = "25/02/2025";

    const sections = [
        { id: "acceptance-of-terms", title: "1. Acceptance of Terms" },
        { id: "about-mathz-ai", title: "2. About Mathz AI" },
        { id: "user-eligibility", title: "3. User Eligibility and Registration" },
        { id: "user-responsibilities", title: "4. User Responsibilities" },
        { id: "payment-subscription", title: "5. Payment & Subscription" },
        { id: "acceptable-use", title: "6. Acceptable Use Policy" },
        { id: "intellectual-property", title: "7. Intellectual Property Rights" },
        { id: "privacy-data-protection", title: "8. Privacy & Data Protection" },
        { id: "platform-content-services", title: "9. Platform Content & Services" },
        { id: "third-party-links", title: "10. Third-Party Links & Services" },
        { id: "termination", title: "11. Termination" },
        { id: "disclaimer-liability", title: "12. Disclaimer & Limitation of Liability" },
        { id: "indemnification", title: "13. Indemnification" },
        { id: "governing-law-dispute", title: "14. Governing Law & Dispute Resolution" },
        { id: "changes-to-terms", title: "15. Changes to Terms" },
        { id: "contact-information", title: "16. Contact Information" },
        { id: "severability-waiver", title: "17. Severability & Waiver" },
    ];

    const stickyOffsetClass = 'top-28';
    const scrollMarginClass = 'scroll-mt-28';

    return (
        <>
            <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
                <div className="flex-grow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:flex lg:flex-row lg:gap-8 xl:gap-12 py-10 sm:py-12">

                            <div className="lg:w-2/3 xl:w-3/4">
                                <header className="text-center flex flex-col justify-center items-center lg:text-left mb-8 md:mb-12">
                                    <h1 className="headingmd text-primary">Terms of Service</h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Last Updated: {lastUpdatedDate}
                                    </p>
                                </header>

                                <main className="bg-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl space-y-10 text-foreground/90 border border-border/20">
                                    <p className="text-base lg:text-lg leading-relaxed">
                                        Welcome to Mathz AI. We are Mathingo AI, LLP, a company registered in New Delhi, India at Rohini, New Delhi, 110086.
                                    </p>
                                    <p className="text-base lg:text-lg leading-relaxed">
                                        We function on our website, www.mathzai.com as well as any other related products and services that refer to below legal terms.
                                    </p>
                                    <p className="text-base lg:text-lg leading-relaxed">
                                        These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Mathz AI ("we," "us," or "our") governing your access and use of our website, mobile applications, products, and services (collectively, the "Services"). By using our Services, you acknowledge that you have read, understood, and agreed to these Terms. If you do not accept these Terms, you must refrain from using our Services. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                                    </p>

                                    {/* Section 1 */}
                                    <section id={sections[0].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[0].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            By registering, accessing, or using Mathz AI in any manner, you accept these Terms. Continued use of the Services implies acceptance of any future modifications.
                                        </p>
                                    </section>

                                    {/* Section 2 */}
                                    <section id={sections[1].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[1].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Mathz AI is an AI-powered educational platform that provides the following services:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li>Mathematical problem-solving assistance</li>
                                            <li>Step-by-step solutions</li>
                                            <li>Hints and concept explanations</li>
                                            <li>AI Math Tutor services</li>
                                            <li>Answer validation</li>
                                            <li>Access to educational resources and tools</li>
                                        </ul>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            Our mission is to make learning mathematics more accessible, engaging, and stress-free.
                                        </p>
                                    </section>

                                    {/* Section 3 */}
                                    <section id={sections[2].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[2].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Age Requirements</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Minors must obtain parental or legal guardian consent before using Mathz AI.</li>
                                                <li>Parents and guardians assume responsibility for monitoring a minor's activities on the platform.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Account Creation</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Users are required to submit truthful, up-to-date, and complete details during the registration process.</li>
                                                <li>It is the user's responsibility to safeguard their account and keep login credentials confidential.</li>
                                                <li>Notify us immediately at support@mathzai.com in case of unauthorized access.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 4 */}
                                    <section id={sections[3].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[3].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Account Security</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Maintain confidentiality of login credentials.</li>
                                                <li>Update account information promptly.</li>
                                                <li>Log out from shared devices after each session.</li>
                                                <li>Use strong, unique passwords.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Prohibited Account Activities</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Sharing or transferring accounts.</li>
                                                <li>Using another user's account.</li>
                                                <li>Creating accounts for malicious activities.</li>
                                                <li>Circumventing platform restrictions.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 5 */}
                                    <section id={sections[4].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[4].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Billing Terms</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Prices for subscriptions and services are subject to change with prior notice.</li>
                                                <li>Taxes and other applicable charges may vary based on location.</li>
                                                <li>Currency used for transactions is determined by the user's location.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Subscription Management</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Subscriptions auto-renew unless canceled before the renewal date.</li>
                                                <li>Users must cancel at least 24 hours before the renewal date to avoid charges.</li>
                                                <li>No partial refunds for unused periods of a subscription.</li>
                                                <li>Free trial terms are defined at the time of sign-up.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Refund Policy</h3>
                                            <p className="text-base lg:text-lg leading-relaxed mt-1">
                                                All payments made through this platform are final and non-refundable, except in circumstances where a duplicate transaction, technical error, or unauthorized payment has occurred.
                                            </p>
                                            <p className="text-base lg:text-lg leading-relaxed mt-2">
                                                In such exceptional cases, refund requests must be submitted in writing to our support team within 48 hours of the transaction.
                                            </p>
                                            <p className="text-base lg:text-lg leading-relaxed mt-2">
                                                Upon receiving a valid refund request, we will assess the claim and, if approved, initiate the refund within 48 to 72 business hours. The credited amount may take additional time to reflect depending on the payment method and banking partner policies.
                                            </p>
                                            <p className="text-base lg:text-lg leading-relaxed mt-2">
                                                We reserve the right to refuse refund requests that do not comply with this policy or are made after the stipulated period.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 6 */}
                                    <section id={sections[5].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[5].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Prohibited Activities</h3>
                                            <p className="text-base lg:text-lg leading-relaxed">Users may not engage in:</p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-1 text-foreground/80">
                                                <li>Cheating or academic dishonesty.</li>
                                                <li>Harassment, abuse, or bullying.</li>
                                                <li>Impersonation of another person or entity.</li>
                                                <li>Data scraping, automated crawling, or extracting content from the platform.</li>
                                                <li>Unauthorized automated access to Services.</li>
                                                <li>Any activity that interferes with platform security.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Content Guidelines</h3>
                                            <p className="text-base lg:text-lg leading-relaxed">Users must not:</p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-1 text-foreground/80">
                                                <li>Share inappropriate content unsuitable for all ages.</li>
                                                <li>Upload copyrighted material without permission.</li>
                                                <li>Disseminate misleading or false information.</li>
                                                <li>Post promotional, spam, or unauthorized advertising content.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 7 */}
                                    <section id={sections[6].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[6].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Our Rights</h3>
                                            <p className="text-base lg:text-lg leading-relaxed">All content, including but not limited to:</p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-1 text-foreground/80">
                                                <li>Features and functionality</li>
                                                <li>Trademarks, logos, and brand elements</li>
                                                <li>Proprietary algorithms and technology</li>
                                                <li>User interface and design elements</li>
                                            </ul>
                                            <p className="text-base lg:text-lg leading-relaxed mt-1">
                                                are owned by or licensed to Mathz AI. Unauthorized reproduction, distribution, or modification is prohibited.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">User Rights</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Users receive a limited license for personal use of our content.</li>
                                                <li>Users retain rights to their own generated content.</li>
                                                <li>Feedback and suggestions provided to Mathz AI can be used to improve our platform.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 8 */}
                                    <section id={sections[7].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[7].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Mathz AI prioritizes user privacy. Our Privacy Policy outlines data collection, usage, and protection methods. By using our Services, you agree to these practices. You can review our full <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">Privacy Policy here</a>.
                                        </p>
                                    </section>

                                    {/* Section 9 */}
                                    <section id={sections[8].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[8].title}</h2>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">AI-Generated Content</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>AI-generated solutions are for educational purposes only.</li>
                                                <li>Mathz AI does not guarantee 100% accuracy.</li>
                                                <li>AI-generated solutions should not replace professional or teacher guidance.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">Service Availability</h3>
                                            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                                <li>Service availability may vary by region.</li>
                                                <li>Periodic maintenance may result in downtime.</li>
                                                <li>No guarantees are made regarding uninterrupted service.</li>
                                                <li>Mathz AI reserves the right to modify or discontinue any feature.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 10 */}
                                    <section id={sections[9].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[9].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Mathz AI may include links to external services. We are not responsible for:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li>The accuracy or reliability of third-party content.</li>
                                            <li>The privacy practices of third-party services.</li>
                                            <li>Transactions or interactions with third-party platforms.</li>
                                            <li>Service unavailability of third-party platforms may result in downtime.</li>
                                        </ul>
                                    </section>

                                    {/* Section 11 */}
                                    <section id={sections[10].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[10].title}</h2>
                                        <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">Account Termination</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Users may terminate their accounts at any time. Mathz AI may suspend or terminate accounts for:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-1 text-foreground/80">
                                            <li>Violations of these Terms.</li>
                                            <li>Prolonged periods of inactivity.</li>
                                            <li>Legal obligations.</li>
                                        </ul>
                                        <p className="text-base lg:text-lg leading-relaxed mt-2">Access to paid content may be revoked.</p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-1">User data may be retained or deleted at our discretion.</p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-1">Refunds are not provided for terminated accounts.</p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-1">Certain provisions survive termination.</p>
                                    </section>

                                    {/* Section 12 */}
                                    <section id={sections[11].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[11].title}</h2>
                                        <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                            <li>Services are provided on an "as-is" basis.</li>
                                            <li>Mathz AI makes no guarantees regarding the accuracy of content.</li>
                                            <li>We are not liable for damages resulting from use of our Services.</li>
                                            <li>Indirect, incidental, and consequential damages are excluded.</li>
                                        </ul>
                                    </section>

                                    {/* Section 13 */}
                                    <section id={sections[12].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[12].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Users agree to indemnify and hold Mathz AI harmless from any claims arising from:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li>Misuse of our Services.</li>
                                            <li>Violation of these Terms.</li>
                                            <li>Infringement of third-party rights.</li>
                                            <li>User-generated content.</li>
                                        </ul>
                                    </section>

                                    {/* Section 14 */}
                                    <section id={sections[13].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[13].title}</h2>
                                        <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                            <li>These Terms shall be regulated in accordance with the law.</li>
                                            <li>Any disputes shall be resolved through arbitration.</li>
                                            <li>Users relinquish their right to take part in class-action lawsuits.</li>
                                            <li>Claims under small claims courts are permitted.</li>
                                        </ul>
                                    </section>

                                    {/* Section 15 */}
                                    <section id={sections[14].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[14].title}</h2>
                                        <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                            <li>Mathz AI reserves the right to update these Terms.</li>
                                            <li>Users will be notified of material changes.</li>
                                            <li>Continued use of the Services constitutes acceptance of revised Terms.</li>
                                            <li>Prior versions may be made available upon request.</li>
                                        </ul>
                                    </section>

                                    {/* Section 16 */}
                                    <section id={sections[15].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[15].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">For any inquiries, contact us at:</p>
                                        <ul className="list-none pl-0 space-y-1 mt-2 text-foreground/80">
                                            <li>Email: <a href="mailto:support@mathzai.com" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">support@mathzai.com</a></li>
                                            <li>Website: <a href="https://www.mathzai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">www.mathzai.com</a></li>
                                        </ul>
                                    </section>

                                    {/* Section 17 */}
                                    <section id={sections[16].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[16].title}</h2>
                                        <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
                                            <li>If any provision of these Terms is found to be invalid, the rest remains enforceable.</li>
                                            <li>Failure to enforce a provision does not waive our right to enforce it later.</li>
                                            <li>These Terms constitute the entire agreement between Mathz AI and the User.</li>
                                            <li>Users may not transfer their rights under these Terms.</li>
                                        </ul>
                                    </section>

                                    <p className="text-base lg:text-lg leading-relaxed mt-8 pt-6 border-t border-border/30">
                                        Thank you for using Mathz AI! We are committed to providing an engaging and secure educational experience for all users.
                                    </p>
                                </main>
                            </div>

                            {/* Sidebar / Table of Contents */}
                            <aside className="hidden lg:block lg:w-1/3 xl:w-1/4">
                                <div className={`sticky ${stickyOffsetClass} h-auto`}>
                                    <div className="p-5 xl:p-6 bg-card/85 backdrop-blur-md rounded-xl shadow-xl border border-border/50 max-h-[calc(100vh-theme('spacing.28')-theme('spacing.10'))] overflow-y-auto">
                                        <h3 className="text-base xl:text-lg font-semibold text-primary mb-4">
                                            On this page
                                        </h3>
                                        <nav>
                                            <ul className="space-y-1.5">
                                                {sections.map((section) => (
                                                    <li key={section.id}>
                                                        <a
                                                            href={`#${section.id}`}
                                                            className="block py-1.5 px-2.5 text-xs xl:text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                        >
                                                            {section.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </aside>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;