import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import * as React from 'react';
import {ContactFormData, ContactOptions} from "@/providers";
import {en} from "@/i18n/locales";
import {DetailedRequestFormState, SubmitState} from "@/components/sections/Contact/useUIReducer";
import {premiumEase, premiumMotion} from "@/lib";
import {DetailedRequestWizard, MagneticButton} from "@/components";
import {EASE, Socket, TRAVEL} from "@/components/landing/it";

interface ContactFormLabels {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    languageLabel: string;
    sendButtonLabel: string;
    sendingLabel: string;
    successText: string;
}

type DetailedCopy = NonNullable<typeof en.contact.detailed>;

interface ContactFormProps extends ContactOptions {
    labels: ContactFormLabels;
    detailedCopy: DetailedCopy;
    formData: ContactFormData;
    detailedRequest: DetailedRequestFormState;
    useDetailedRequest: boolean;
    currentStep: number;
    isSubmitting: boolean;
    submitState: SubmitState;
    submittedRequestId: string | null;
    errorText: string;
    fieldErrors: Record<string, string>;
    optionNotice: string;
    hasDetailedRequiredOptions: boolean;
    stepTitles: string[];
    onChange: (field: keyof ContactFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onDetailedRequestToggle: (event: ChangeEvent<HTMLInputElement>) => void;
    onDetailedFieldChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    // onEnterpriseInquiryToggle: (event: ChangeEvent<HTMLInputElement>) => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
}

interface FieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    type?: 'text' | 'email' | 'textarea';
    required?: boolean;
}

const fieldShellClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-lg text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

const Field = ({ label, placeholder, value, onChange, error, type = 'text', required }: FieldProps) => (
    <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-slate-500 uppercase">{label}</label>
        {type === 'textarea' ? (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={5}
                className={`${fieldShellClass} resize-none`}
                required={required}
            />
        ) : (
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={fieldShellClass} required={required} />
        )}
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
);

const ToggleCard = ({
    checked,
    onChange,
    hint,
    title,
}: {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    hint: string;
    title: string;
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
            <span>{title}</span>
        </label>
        {checked && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
);

const StatusMessage = ({
    submitState,
    submittedRequestId,
    errorText,
    submittedWithId,
    successText,
}: {
    submitState: SubmitState;
    submittedRequestId: string | null;
    errorText: string;
    submittedWithId: string;
    successText: string;
}) => {
    if (submitState === 'success') {
        return (
            <motion.p role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-slate-900">
                {submittedRequestId ? `${submittedWithId} ${submittedRequestId}` : successText}
            </motion.p>
        );
    }

    if (submitState === 'error' && errorText) {
        return (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-red-600">
                {errorText}
            </motion.p>
        );
    }

    return null;
};

export const ContactForm = ({
    labels,
    detailedCopy,
    formData,
    detailedRequest,
    useDetailedRequest,
    currentStep,
    isSubmitting,
    submitState,
    submittedRequestId,
    errorText,
    fieldErrors,
    optionNotice,
    hasDetailedRequiredOptions,
    stepTitles,
    projectTypeOptions,
    desiredStartWindowOptions,
    budgetRangeOptions,
    budgetFlexibilityOptions,
    communicationPreferenceOptions,
    dataSensitivityOptions,
    priorityOptions,
    languageOptions,
    onChange,
    onDetailedRequestToggle,
    onDetailedFieldChange,
    // onEnterpriseInquiryToggle,
    onNextStep,
    onPreviousStep,
    onSubmit,
}: ContactFormProps) => {
    const reduced = useReducedMotion();
    const formRef = useRef<HTMLFormElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<HTMLSpanElement>(null);
    const wasSubmittingRef = useRef(false);
    const [ready, setReady] = useState(false);
    const [flight, setFlight] = useState<{ x: number; y: number } | null>(null);

    // The dot arrives when the form can carry It — native validity, no new rules.
    useEffect(() => {
        setReady(formRef.current?.checkValidity() ?? false);
    }, [formData, detailedRequest, useDetailedRequest, currentStep]);

    // Send-off: as the request leaves, It leaves with it. The flight is pure
    // theater — the network call is already in motion and is never gated by it.
    useEffect(() => {
        if (isSubmitting && !wasSubmittingRef.current && !reduced && socketRef.current && cardRef.current) {
            const s = socketRef.current.getBoundingClientRect();
            const c = cardRef.current.getBoundingClientRect();
            setFlight({ x: s.left - c.left + s.width / 2, y: s.top - c.top + s.height / 2 });
        }
        wasSubmittingRef.current = isSubmitting;
    }, [isSubmitting, reduced]);

    // Ready and idle: It sits in the socket. After success it's gone — handed
    // over. After an error it pops back in: it didn't go; it's still yours.
    const docked = ready && !isSubmitting && submitState !== 'success';

    return (
    <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: premiumMotion.normal, ease: premiumEase }}
        className="relative rounded-3xl border border-slate-900/6 bg-white p-7 soft-shadow md:p-9 lg:col-span-7"
    >
        <form ref={formRef} onSubmit={onSubmit} className="space-y-8">
            <ToggleCard
                checked={useDetailedRequest}
                onChange={onDetailedRequestToggle}
                title={detailedCopy.detailedToggleTitle}
                hint={detailedCopy.detailedToggleHint}
            />

            {(!useDetailedRequest || currentStep === 0) && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Field
                        label={labels.nameLabel}
                        placeholder={labels.namePlaceholder}
                        value={formData.name}
                        onChange={onChange('name')}
                        error={fieldErrors.name || fieldErrors.requesterName}
                        required
                    />

                    <Field
                        label={labels.emailLabel}
                        placeholder={labels.emailPlaceholder}
                        value={formData.email}
                        onChange={onChange('email')}
                        error={fieldErrors.email || fieldErrors.requesterEmail}
                        type="email"
                        required
                    />

                    <div>
                        <label className="mb-3 block text-sm font-medium tracking-wider text-slate-500 uppercase">{labels.languageLabel}</label>
                        <select value={formData.language} onChange={onChange('language')} className={fieldShellClass}>
                            {(languageOptions ?? []).map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {useDetailedRequest && (
                <DetailedRequestWizard
                    detailedCopy={detailedCopy}
                    stepTitles={stepTitles}
                    currentStep={currentStep}
                    detailedRequest={detailedRequest}
                    fieldErrors={fieldErrors}
                    optionNotice={optionNotice}
                    hasDetailedRequiredOptions={hasDetailedRequiredOptions}
                    projectTypeOptions={projectTypeOptions}
                    desiredStartWindowOptions={desiredStartWindowOptions}
                    budgetRangeOptions={budgetRangeOptions}
                    budgetFlexibilityOptions={budgetFlexibilityOptions}
                    communicationPreferenceOptions={communicationPreferenceOptions}
                    dataSensitivityOptions={dataSensitivityOptions}
                    priorityOptions={priorityOptions}
                    onDetailedFieldChange={onDetailedFieldChange}
                    // onEnterpriseInquiryToggle={onEnterpriseInquiryToggle}
                />
            )}

            {(!useDetailedRequest || currentStep === 2) && (
                <Field
                    label={useDetailedRequest ? detailedCopy.projectDescriptionOptional : labels.messageLabel}
                    placeholder={labels.messagePlaceholder}
                    value={formData.message}
                    onChange={onChange('message')}
                    error={fieldErrors.message || fieldErrors.description}
                    type="textarea"
                    required={!useDetailedRequest}
                />
            )}

            <div className="pt-4">
                <div className="flex flex-wrap items-center gap-3">
                    {useDetailedRequest && currentStep > 0 && (
                        <button
                            type="button"
                            onClick={onPreviousStep}
                            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            {detailedCopy.back}
                        </button>
                    )}

                    {useDetailedRequest && currentStep < stepTitles.length - 1 ? (
                        <button
                            type="button"
                            onClick={onNextStep}
                            className="cursor-pointer rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                        >
                            {detailedCopy.nextStep}
                        </button>
                    ) : (
                        <MagneticButton
                            type="submit"
                            disabled={isSubmitting}
                            className="cta-polish group inline-flex cursor-pointer items-center gap-3 rounded-full bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-colors duration-300 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {/* The socket stays mounted through submit so the flight can launch from it */}
                            <span ref={socketRef} className="relative inline-flex h-1.5 w-1.5 shrink-0">
                                <Socket className="absolute inset-0" />
                                {reduced ? (
                                    docked && <span className="absolute -inset-px rounded-full bg-brand-600" />
                                ) : (
                                    <AnimatePresence>
                                        {docked && (
                                            <motion.span
                                                key="dock"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, transition: { duration: 0.24, ease: EASE } }}
                                                exit={{ scale: 0, transition: { duration: 0.12 } }}
                                                className="absolute -inset-px rounded-full bg-brand-600"
                                            />
                                        )}
                                    </AnimatePresence>
                                )}
                            </span>
                            {isSubmitting ? (
                                labels.sendingLabel
                            ) : (
                                <>
                                    {useDetailedRequest ? detailedCopy.submitProjectRequest : labels.sendButtonLabel}
                                    <HiArrowRight className="h-5 w-5 opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
                                </>
                            )}
                        </MagneticButton>
                    )}
                </div>
            </div>

            <StatusMessage
                submitState={submitState}
                submittedRequestId={submittedRequestId}
                errorText={errorText}
                submittedWithId={detailedCopy.submittedWithId}
                successText={labels.successText}
            />
        </form>

        {/* The send-off — It rises out of the socket and leaves with the message */}
        {flight && (
            <motion.span
                aria-hidden
                className="pointer-events-none absolute z-10 h-2 w-2 rounded-full bg-brand-600"
                style={{ left: flight.x - 4, top: flight.y - 4 }}
                initial={{ y: 0, scale: 1.25, opacity: 1 }}
                animate={{ y: -120, scale: 1, opacity: 0 }}
                transition={{
                    y: { type: 'spring', ...TRAVEL },
                    scale: { duration: 0.15, ease: EASE },
                    opacity: { duration: 0.3, delay: 0.25, ease: 'easeOut' },
                }}
                onAnimationComplete={() => setFlight(null)}
            />
        )}
    </motion.div>
    );
};
