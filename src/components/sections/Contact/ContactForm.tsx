import { type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import * as React from 'react';
import {ContactFormData, ContactOptions} from "@/providers";
import {en} from "@/i18n/locales";
import {DetailedRequestFormState, SubmitState} from "@/components/sections/Contact/useUIReducer";
import {premiumEase, premiumMotion} from "@/lib";
import {DetailedRequestWizard, MagneticButton} from "@/components";

interface ContactFormLabels {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
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
    onChange: (field: keyof ContactFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
    'w-full rounded-xl border border-gray-200 bg-white/85 px-4 py-3.5 text-lg text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-gray-400 focus:outline-none focus:ring-0';

const Field = ({ label, placeholder, value, onChange, error, type = 'text', required }: FieldProps) => (
    <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-500 uppercase">{label}</label>
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
    <div className="rounded-2xl border border-gray-200 bg-white/60 p-4">
        <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-gray-300" />
            <span>{title}</span>
        </label>
        {checked && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
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
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-gray-900">
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
    onChange,
    onDetailedRequestToggle,
    onDetailedFieldChange,
    // onEnterpriseInquiryToggle,
    onNextStep,
    onPreviousStep,
    onSubmit,
}: ContactFormProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: premiumMotion.normal, ease: premiumEase }}
        className="interactive-card premium-panel premium-texture rounded-3xl p-7 md:p-9 lg:col-span-7"
    >
        <form onSubmit={onSubmit} className="space-y-8">
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
                            className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                        >
                            {detailedCopy.back}
                        </button>
                    )}

                    {useDetailedRequest && currentStep < stepTitles.length - 1 ? (
                        <button
                            type="button"
                            onClick={onNextStep}
                            className="cursor-pointer rounded-full border border-gray-900 bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                        >
                            {detailedCopy.nextStep}
                        </button>
                    ) : (
                        <MagneticButton
                            type="submit"
                            disabled={isSubmitting}
                            className="cta-polish group inline-flex cursor-pointer items-center gap-3 rounded-full border border-gray-900 bg-gray-800 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/20 transition-colors duration-300 hover:bg-black hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {labels.sendingLabel}
                                </>
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
    </motion.div>
);
