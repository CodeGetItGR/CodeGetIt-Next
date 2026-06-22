import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The terms that govern your use of CodeGetIt and our services.',
};

const lastUpdated = 'June 22, 2026';

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-[#fafafa] px-6 py-20 text-slate-900">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                    ← Back to CodeGetIt
                </Link>

                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
                <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>

                <div className="mt-10 space-y-10 text-[15px] leading-7 text-slate-600">
                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">1. Agreement to terms</h2>
                        <p className="mt-3">
                            These Terms of Service govern your use of codegetit.com (the &quot;Site&quot;) and any
                            quote request, contact, or inquiry you submit through it. By using the Site, you agree to
                            these terms. They don&apos;t cover the separate, signed agreement we use for an actual
                            project engagement — that document takes precedence once a project starts.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">2. Using the site</h2>
                        <p className="mt-3">
                            The Site is provided to share information about our services and to let you request a
                            quote or get in touch. You agree not to misuse the Site — including attempting to disrupt
                            it, submitting false information through our forms, or using it for any unlawful purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">3. Quotes and project requests</h2>
                        <p className="mt-3">
                            Pricing, timelines, and estimates shown on the Site are indicative starting points, not
                            binding quotes. The scope, price, and timeline for any project are confirmed in writing
                            once we&apos;ve discussed your specific needs.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">4. Intellectual property</h2>
                        <p className="mt-3">
                            All content on the Site — including text, design, graphics, and the CodeGetIt name and
                            logo — belongs to CodeGetIt or its licensors and may not be copied or reused without
                            permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">5. Third-party links</h2>
                        <p className="mt-3">
                            The Site may link to third-party sites, including past client projects. We aren&apos;t
                            responsible for the content or practices of those sites.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">6. Disclaimer and liability</h2>
                        <p className="mt-3">
                            The Site is provided &quot;as is&quot;, without warranties of any kind. To the extent
                            permitted by law, CodeGetIt is not liable for any indirect or consequential loss arising
                            from your use of the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">7. Changes to these terms</h2>
                        <p className="mt-3">
                            We may revise these terms from time to time. Continued use of the Site after a change
                            means you accept the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">8. Contact us</h2>
                        <p className="mt-3">
                            Questions about these terms? Reach us at{' '}
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
