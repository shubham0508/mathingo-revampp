const PrivacyPolicy = () => {
    const lastUpdatedDate = "28/02/2025";

    const sections = [
        { id: "about-mathz-ai", title: "1. About Mathz AI" },
        { id: "data-collection", title: "2. What Data Does Mathz AI Collect?" },
        { id: "data-usage", title: "3. How Does Mathz AI Use Your Data?" },
        { id: "data-sharing", title: "4. With Whom Does Mathz AI Share Your Data?" },
        { id: "data-processing-location", title: "5. Where Is Your Data Processed?" },
        { id: "data-storage-duration", title: "6. How Long Does Mathz AI Store Your Data?" },
        { id: "cookies-tracking", title: "7. Cookies & Tracking" },
        { id: "online-advertising-analytics", title: "8. Online Advertising and Analytics" },
        { id: "ai-ml-usage", title: "9. Use of Artificial Intelligence and Machine Learning" },
        { id: "your-rights", title: "10. What Are Your Rights?" },
        { id: "notice-for-parents", title: "11. Special Notice for Parents" },
        { id: "managing-data", title: "12. Managing Your Personal Data" },
        { id: "policy-updates", title: "13. Updating This Policy" },
        { id: "contact-us", title: "14. Contact Us" },
    ];

    const stickyOffsetClass = 'top-28';
    const scrollMarginClass = 'scroll-mt-28';

    return (
        <>
            <div className="min-h-screen flex flex-col text-foreground font-sans">
                <div className="flex-grow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:flex lg:flex-row lg:gap-8 xl:gap-12 py-10 sm:py-12">

                            <div className="lg:w-2/3 xl:w-3/4">
                                <header className="text-center flex justify-center items-center flex-col lg:text-left mb-8 md:mb-12">
                                    <h1 className="headingmd text-primary">Privacy Policy</h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Last Updated: {lastUpdatedDate}
                                    </p>
                                </header>

                                <main className="bg-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl space-y-10 text-foreground/90 border border-border/20">
                                    <p className="text-base lg:text-lg leading-relaxed">
                                        Welcome to Mathz AI! We prioritize your privacy and are committed to ensuring the protection of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our smart learning platform.
                                    </p>

                                    <section id={sections[0].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[0].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Mathz AI is an AI-powered learning companion designed for students, parents, and teachers. Our platform provides step-by-step math solutions through text and image inputs, validates your existing solutions, and offers real-time tutoring on mathematical concepts and problems, making mathematics accessible and enjoyable.
                                        </p>
                                    </section>

                                    <section id={sections[1].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[1].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed mb-6">
                                            At Mathz AI, we collect certain types of information to provide a seamless, personalized, and secure user experience. Our data collection ensures that you receive tailored learning support, smooth platform functionality, and secure transactions. Below is a detailed breakdown of the types of data we collect and their purposes:
                                        </p>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-4 mb-2">
                                                1. Basic Details
                                            </h3>
                                            <p className="text-base lg:text-lg leading-relaxed">
                                                We collect fundamental personal information when you sign up for Mathz AI or interact with our platform. These include:
                                            </p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                                <li><strong>Name</strong> – Used for personalization, account identification, and communication.</li>
                                                <li><strong>Email Address</strong> – Essential for account creation, password recovery, customer support, and notifications.</li>
                                                <li><strong>Grade Level</strong> – Allows us to customize the learning experience based on your educational needs.</li>
                                                <li><strong>Password</strong> – Ensures secure access to your account and protects your personal information.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">
                                                2. Academic Information
                                            </h3>
                                            <p className="text-base lg:text-lg leading-relaxed">
                                                Mathz AI is an education-focused platform, so we collect academic data to track your progress and improve learning outcomes:
                                            </p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                                <li><strong>Questions and Answers</strong> – Your responses to quizzes, exercises, and assessments help us refine recommendations for your studies.</li>
                                                <li><strong>Learning Progress</strong> – We monitor your completed lessons, scores, and overall engagement to tailor content that enhances your learning experience.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">
                                                3. Technical Data
                                            </h3>
                                            <p className="text-base lg:text-lg leading-relaxed">
                                                To optimize platform performance, diagnose technical issues, and ensure security, we collect:
                                            </p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                                <li><strong>Device Information</strong> – Includes device type, operating system, and hardware specifications to enhance compatibility.</li>
                                                <li><strong>IP Address</strong> – Helps in fraud prevention, security monitoring, and regional content customization.</li>
                                                <li><strong>Browser Type & Version</strong> – Ensures optimal user experience by supporting relevant browser configurations.</li>
                                                <li><strong>Connection Details</strong> – Includes network speed and latency data to improve app performance and reduce loading times.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">
                                                4. Payment Information
                                            </h3>
                                            <p className="text-base lg:text-lg leading-relaxed">
                                                For users purchasing premium subscriptions or services, we collect:
                                            </p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                                <li><strong>Billing Details</strong> – Name and payment method information for transaction processing.</li>
                                                <li><strong>Payment Transaction History</strong> – Ensures smooth billing, refunds, and fraud prevention.</li>
                                            </ul>
                                            <p className="text-base lg:text-lg leading-relaxed mt-2">
                                                We use secure third-party payment processors to handle financial transactions, ensuring that your payment details remain protected.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-primary/90 mt-6 mb-2">
                                                5. Authentication Data
                                            </h3>
                                            <p className="text-base lg:text-lg leading-relaxed">
                                                If you sign in using third-party accounts like Google, Apple, or Facebook, we collect:
                                            </p>
                                            <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                                <li><strong>Basic Profile Information</strong> – Such as your name, email, and profile picture.</li>
                                                <li><strong>Authentication Tokens</strong> – Securely verify your identity without storing passwords.</li>
                                            </ul>
                                            <p className="text-base lg:text-lg leading-relaxed mt-2">
                                                We only collect the data necessary for authentication and do not have access to your full social media accounts.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 3 */}
                                    <section id={sections[2].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[2].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Your information helps us:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li>Create and manage your account.</li>
                                            <li>Improve Mathz AI's features and personalizes your experience.</li>
                                            <li>Ensure a safe and spam-free environment.</li>
                                            <li>Provide customer support and respond to your requests.</li>
                                            <li>Display relevant content and advertisements (if applicable).</li>
                                            <li>Comply with legal obligations.</li>
                                        </ul>
                                    </section>

                                    {/* Section 4 */}
                                    <section id={sections[3].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[3].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Your privacy is our priority. However, in certain cases, we may share your data with:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li><strong>Other Users:</strong> Publicly shared content, such as questions and answers.</li>
                                            <li><strong>Service Providers:</strong> For hosting, analytics, payment processing, and customer support.</li>
                                            <li><strong>Advertisers & Marketing Partners:</strong> To offer personalized ads and content.</li>
                                            <li><strong>Legal Authorities:</strong> When required by law.</li>
                                        </ul>
                                    </section>

                                    {/* Section 5 */}
                                    <section id={sections[4].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[4].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Your personal data may be processed in locations outside your country, including by our partners or affiliates. This can happen when we collaborate with service providers in different regions to improve our services, store data, or fulfill legal and business obligations.
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            To ensure your data remains secure, we implement legally required safeguards, such as standard contractual clauses, data protection agreements, and security measures that comply with applicable laws. These measures help protect your personal information from unauthorized access, loss, or misuse, regardless of where it is processed.
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            If your data is transferred internationally, we ensure that it is handled in accordance with privacy regulations like the GDPR or other relevant data protection laws. This means your rights and privacy remain protected, even when data is processed in countries with different legal frameworks.
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            By using our services, you acknowledge and consent to the possible transfer of your data across borders under these protections. If you have concerns or want more details on how we protect your data during international transfers, you can contact us through the details provided in our Privacy Policy.
                                        </p>
                                    </section>

                                    {/* Section 6 */}
                                    <section id={sections[5].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[5].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed mb-4">
                                            At Mathz AI, we are committed to handling your personal data responsibly and transparently. The duration for which we store your data depends on various factors, including the purpose of collection, legal obligations, and operational requirements. Below are the key considerations that determine our data retention periods:
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Retention Based on Purpose</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We retain your personal data only for as long as necessary to fulfill the original purpose for which it was collected. Once the data is no longer required, we securely delete or anonymize it, ensuring it is no longer personally identifiable.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Contract Performance</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If your personal data is required to fulfill contractual obligations, we will store it for the duration of the contract and any necessary period thereafter to comply with post-contractual obligations, such as dispute resolution or record-keeping.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Legitimate Business Interests</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We may retain your data for an extended period if it serves legitimate business interests, including but not limited to:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-2 text-foreground/80">
                                            <li>Providing customer support and responding to inquiries</li>
                                            <li>Enhancing user experience and improving our services</li>
                                            <li>Preventing fraudulent activity and ensuring security</li>
                                            <li>Conducting marketing activities based on user engagement</li>
                                        </ul>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Legal and Regulatory Requirements</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Certain laws and regulations require us to store personal data for a specified period. In such cases, we retain the data for the legally mandated duration, even if it is no longer needed for its original purpose. This includes compliance with tax, financial, and data protection laws.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">User Consent-Based Processing</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            In cases where we process data based on user consent (e.g., email subscriptions or optional data collection), we store the data until the user withdraws their consent. Users can request the deletion of such data at any time by contacting us.
                                        </p>
                                    </section>

                                    {/* Section 7 */}
                                    <section id={sections[6].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[6].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Mathz AI places cookies or other tracking technologies on your device to enhance functionality and display personalized ads.
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">Types of cookies we use:</p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-2 text-foreground/80">
                                            <li><strong>Necessary Cookies:</strong> Essential for website functionality and security.</li>
                                            <li><strong>Functional Cookies:</strong> Remember preferences like language or font size.</li>
                                            <li><strong>Performance Cookies:</strong> Gather analytics data to improve platform performance.</li>
                                            <li><strong>Advertising Cookies:</strong> Personalize ads based on your interests.</li>
                                            <li><strong>Social Media Cookies:</strong> Enable linking to your social media accounts.</li>
                                        </ul>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            You can manage your cookie preferences in your browser settings.
                                        </p>
                                    </section>

                                    {/* Section 8 */}
                                    <section id={sections[7].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[7].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We work with third-party providers like Google Analytics to understand user behavior and improve Mathz AI.
                                        </p>
                                    </section>

                                    {/* Section 9 */}
                                    <section id={sections[8].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[8].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We may use AI to enhance your learning experience but do not use your personal data for AI training purposes.
                                        </p>
                                    </section>

                                    {/* Section 10 */}
                                    <section id={sections[9].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[9].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed mb-4">
                                            At Mathz AI, we respect your privacy and are committed to ensuring that you have control over your personal data. You have several rights regarding how we collect, use, and share your information. These rights allow you to manage your data and make informed choices about your privacy.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">1. Right to Access Your Personal Data</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You have the right to request and receive a copy of the personal data we hold about you. This includes details on how your data is being used, stored, and shared.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">2. Right to Update or Correct Inaccurate Information</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If any of your personal information is incorrect, incomplete, or outdated, you have the right to request corrections. Keeping your data accurate ensures better service and security.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">3. Right to Request Deletion of Your Personal Data</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You can request that we erase your personal data from our systems, subject to legal and contractual obligations. This is often referred to as the "right to be forgotten." However, some data may need to be retained for legal compliance or security purposes.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">4. Right to Object to or Restrict Data Processing</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If you disagree with how we process your personal data, you can request that we limit or stop certain uses. This applies in situations where you believe processing is unnecessary or unlawful.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">5. Right to Receive a Copy of Your Data in a Machine-Readable Format</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You can request a structured, commonly used, and machine-readable copy of your personal data. This ensures that you can transfer your data to another service provider if needed.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">6. Right Not to Be Subject to Automated Decision-Making</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If we use automated systems to make decisions that significantly affect you (e.g., profiling or AI-based recommendations), you have the right to request human intervention and challenge the decision.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">7. Right to File a Complaint with a Supervisory Authority</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If you believe your privacy rights have been violated, you have the right to file a complaint with a relevant data protection authority. We encourage you to reach out to us first so we can address any concerns.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Exercising Your Rights</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You can request access to, update, or delete your data by contacting us. We may require identity verification.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Opt-Out of Data Sales and Targeted Advertising</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            Depending on your jurisdiction, you may opt out of personal data sales and targeted advertising by adjusting your preferences.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Denial of Requests</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We may deny a request if legally permitted. If denied, we will notify you with the reason. You may appeal our decision if applicable.
                                        </p>
                                        <h3 className="text-lg font-semibold text-primary/80 mt-4 mb-2">Requests by Agents</h3>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You can designate an authorized agent to act on your behalf. Written authorization is required.
                                        </p>
                                    </section>

                                    {/* Section 11 */}
                                    <section id={sections[10].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[10].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We do not knowingly collect data from children under 13 (or the applicable age in your country) without parental consent. If you believe your child has provided personal data, please contact us.
                                        </p>
                                    </section>

                                    {/* Section 12 */}
                                    <section id={sections[11].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[11].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            You have control over the data you share with us:
                                        </p>
                                        <ul className="list-disc list-inside pl-5 space-y-1 mt-3 text-foreground/80">
                                            <li><strong>Profile Management:</strong> Update email, password, change grade, picture and preferences.</li>
                                            <li><strong>Device Permissions:</strong> Adjust access to location, photos, and camera.</li>
                                            <li><strong>Communication Preferences:</strong> Opt out of promotional emails, though essential communications remain active.</li>
                                        </ul>
                                    </section>

                                    {/* Section 13 */}
                                    <section id={sections[12].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[12].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            We may update this Privacy Policy periodically. The date at the top indicates the latest revision. Major changes will be communicated via email or platform notifications.
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-3">
                                            By continuing to use Mathz AI, you acknowledge and agree to the latest version of this Privacy Policy.
                                        </p>
                                    </section>

                                    {/* Section 14 */}
                                    <section id={sections[13].id} className={scrollMarginClass}>
                                        <h2 className="headings text-primary mb-4">{sections[13].title}</h2>
                                        <p className="text-base lg:text-lg leading-relaxed">
                                            If you have any questions or concerns about this policy, reach out to us at:
                                        </p>
                                        <p className="text-base lg:text-lg leading-relaxed mt-2">
                                            Email: <a href="mailto:support@mathzai.com" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">support@mathzai.com</a>
                                        </p>
                                    </section>
                                </main>
                            </div>

                            {/* Sidebar / Table of Contents */}
                            <aside className="hidden lg:block lg:w-1/3 xl:w-1/4">
                                <div className={`sticky ${stickyOffsetClass} h-auto`}> {/* h-auto allows content to define height up to max-h */}
                                    <div className="p-5 xl:p-6 bg-card/85 backdrop-blur-md rounded-xl shadow-xl border border-border/50 max-h-[calc(100vh-theme('spacing.28')-theme('spacing.10'))] overflow-y-auto">
                                        {/* max-h calculation: 100vh - top_offset (7rem) - bottom_clearance (2.5rem) = 100vh - 9.5rem */}
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

export default PrivacyPolicy;