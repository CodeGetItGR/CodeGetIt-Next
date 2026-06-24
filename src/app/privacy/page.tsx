import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How CodeGetIt collects, uses, and protects your information.',
};

const lastUpdated = 'June 23, 2026';

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
                        <p className="mt-3">We only collect information you choose to give us, through two forms on this site:</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>
                                <span className="font-semibold text-slate-800">Contact form</span> — your name, email
                                address, message, and preferred language.
                            </li>
                            <li>
                                <span className="font-semibold text-slate-800">Project request form</span> — your name,
                                email, phone number, and details about your project (title, description, goals,
                                budget, timeline, and similar). Please avoid including sensitive personal information
                                (health, financial, or similar) in free-text fields unless it&apos;s necessary to
                                describe your project.
                            </li>
                        </ul>
                        <p className="mt-3">
                            We don&apos;t run analytics or tracking cookies on this site. The only other thing we
                            briefly handle is your IP address, used only to prevent abuse of these forms (rate
                            limiting) — it&apos;s kept in memory, never written to a database, and discarded within a
                            few hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">3. How we use your information</h2>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>To respond to quote requests and contact form submissions.</li>
                            <li>
                                To generate an automatic acknowledgment reply and a preliminary analysis of project
                                requests, using an AI provider (see below).
                            </li>
                            <li>To deliver, maintain, and improve our services and this website.</li>
                            <li>To communicate updates about a project or inquiry you&apos;ve started with us.</li>
                            <li>To meet legal and accounting obligations, such as keeping records of paid work.</li>
                        </ul>
                        <p className="mt-3">We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">4. Sharing your information</h2>
                        <p className="mt-3">We share information only with the service providers that help us run our business:</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>
                                <span className="font-semibold text-slate-800">OpenAI</span>, a third-party AI
                                provider — we send it the content of contact messages and project requests (including
                                any free-text you write) to generate automatic acknowledgments and a preliminary
                                analysis of your request.
                            </li>
                            <li>
                                <span className="font-semibold text-slate-800">Our email provider</span> — to send you
                                acknowledgments, offers, and the data-export/deletion emails described below.
                            </li>
                        </ul>
                        <p className="mt-3">We may also disclose information if required by law.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">5. Data retention</h2>
                        <p className="mt-3">
                            We keep contact and project information for as long as needed to respond to your inquiry
                            or deliver a project. If a project moves forward and is paid for, we keep the related
                            records (including payment records) for as long as required for financial and tax
                            purposes, even after the project ends. You can ask us to delete eligible data earlier —
                            see your rights below.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-semibold text-slate-900">6. Your rights</h2>
                        <p className="mt-3">
                            You may request a copy of the personal data we hold about you, or ask us to delete it, at
                            any time via our{' '}
                            <Link href="/privacy/your-data" className="font-medium text-slate-900 underline">
                                Manage Your Data
                            </Link>{' '}
                            page. We&apos;ll email you a confirmation link first — nothing happens until you click it.
                        </p>
                        <p className="mt-3">
                            We&apos;ll delete everything eligible for deletion and confirm by email. Some data tied to
                            an active or completed paid engagement is retained as required for financial and tax
                            record-keeping, and we&apos;ll tell you specifically what was kept and why. Data tied to a
                            request or offer that&apos;s still actively being discussed is also kept until that&apos;s
                            resolved, so we don&apos;t lose track of an open conversation.
                        </p>
                        <p className="mt-3">
                            Depending on where you live, you may have additional rights, such as correcting inaccurate
                            information or objecting to certain uses of it. To exercise those, contact us using the
                            details below.
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
