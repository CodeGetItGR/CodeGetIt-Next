import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How CodeGetIt collects, uses, and protects your information.',
};

const lastUpdated = 'June 22, 2026';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] px-6 py-20 text-slate-900">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                    ← Back to CodeGetIt
                </Link>

                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
                <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>

                <div className="mt-10 space-y-10 text-[15px] leading-7 text-slate-600">
                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">1. Who we are</h2>
                        <p className="mt-3">
                            CodeGetIt (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) designs and builds websites, web
                            applications, and full-stack products. This policy explains what information we collect
                            through codegetit.com, why we collect it, and how you can control it.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">2. Information we collect</h2>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>
                                <span className="font-semibold text-slate-800">Contact details you give us</span> — name,
                                email, phone number, and project details submitted through our contact and quote
                                request forms.
                            </li>
                            <li>
                                <span className="font-semibold text-slate-800">Usage data</span> — pages visited,
                                referring URLs, device and browser type, and approximate location, collected
                                automatically to understand how visitors use the site.
                            </li>
                            <li>
                                <span className="font-semibold text-slate-800">Cookies</span> — small files used to
                                remember preferences and measure site performance. You can disable cookies in your
                                browser settings at any time.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">3. How we use your information</h2>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>To respond to quote requests and contact form submissions.</li>
                            <li>To deliver, maintain, and improve our services and this website.</li>
                            <li>To communicate updates about a project or inquiry you&apos;ve started with us.</li>
                            <li>To meet legal and accounting obligations.</li>
                        </ul>
                        <p className="mt-3">We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">4. Sharing your information</h2>
                        <p className="mt-3">
                            We share information only with service providers that help us run our business — for
                            example, hosting, email delivery, and analytics providers — and only to the extent needed
                            for them to perform that service. We may also disclose information if required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">5. Data retention</h2>
                        <p className="mt-3">
                            We keep contact and project information for as long as needed to respond to your inquiry,
                            deliver a project, or satisfy legal and accounting requirements, after which it is deleted
                            or anonymized.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">6. Your rights</h2>
                        <p className="mt-3">
                            Depending on where you live, you may have the right to access, correct, export, or delete
                            the personal information we hold about you, or to object to certain uses of it. To
                            exercise any of these rights, contact us using the details below.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">7. Changes to this policy</h2>
                        <p className="mt-3">
                            We may update this policy from time to time. Material changes will be reflected by
                            updating the &quot;last updated&quot; date above.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">8. Contact us</h2>
                        <p className="mt-3">
                            Questions about this policy or your personal information? Reach us at{' '}
                            <a href="mailto:info@codegetit.com" className="font-medium text-slate-900 underline">
                                info@codegetit.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
