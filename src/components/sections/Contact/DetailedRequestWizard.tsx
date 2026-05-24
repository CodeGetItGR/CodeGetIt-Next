import type { ChangeEvent } from 'react';
import { en } from '@/i18n/locales/en';
import type { DetailedRequestFormState } from './useUIReducer';
import type { ContactOption, ContactOptions } from '../../../providers/ContactRequestProvider/contact.types';

type DetailedCopy = NonNullable<typeof en.contact.detailed>;

interface DetailedRequestWizardProps extends ContactOptions {
    detailedCopy: DetailedCopy;
    stepTitles: string[];
    currentStep: number;
    detailedRequest: DetailedRequestFormState;
    fieldErrors: Record<string, string>;
    optionNotice: string;
    hasDetailedRequiredOptions: boolean;
    onDetailedFieldChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    // onEnterpriseInquiryToggle: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface FieldProps {
    label: string;
    value: string;
    field: keyof DetailedRequestFormState;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    placeholder?: string;
    type?: 'text' | 'tel';
    required?: boolean;
    maxLength?: number;
    className?: string;
}

interface TextareaProps {
    label: string;
    value: string;
    field: keyof DetailedRequestFormState;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    maxLength?: number;
    className?: string;
}

interface SelectProps {
    label: string;
    value: string;
    field: keyof DetailedRequestFormState;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    options: ContactOption[];
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

const fieldShellClass = 'rounded-xl border border-gray-200 bg-white/85 px-4 py-3 text-base text-gray-900';

const renderError = (error?: string) => (error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null);

const Field = ({ label, value, field, onChange, error, placeholder, type = 'text', required, maxLength, className = '' }: FieldProps) => (
    <div className={className}>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-500 uppercase">{label}</label>
        <input
            type={type}
            value={value}
            data-request-field={field}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${fieldShellClass}`}
            required={required}
            maxLength={maxLength}
        />
        {renderError(error)}
    </div>
);

const TextareaField = ({ label, value, field, onChange, error, placeholder, rows = 3, required, maxLength, className = '' }: TextareaProps) => (
    <div className={className}>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-500 uppercase">{label}</label>
        <textarea
            value={value}
            data-request-field={field}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full resize-none ${fieldShellClass}`}
            required={required}
            maxLength={maxLength}
        />
        {renderError(error)}
    </div>
);

const SelectField = ({ label, value, field, onChange, options, error, placeholder, required, className = '' }: SelectProps) => (
    <div className={className}>
        <label className="mb-3 block text-sm font-medium tracking-wider text-gray-500 uppercase">{label}</label>
        <select value={value} data-request-field={field} onChange={onChange} className={`w-full ${fieldShellClass}`} required={required}>
            {placeholder ? (
                <option value="" hidden>
                    {placeholder}
                </option>
            ) : null}
            {options.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
        {renderError(error)}
    </div>
);

export const DetailedRequestWizard = ({
    detailedCopy,
    stepTitles,
    currentStep,
    detailedRequest,
    fieldErrors,
    optionNotice,
    hasDetailedRequiredOptions,
    projectTypeOptions,
    desiredStartWindowOptions,
    budgetRangeOptions,
    budgetFlexibilityOptions,
    communicationPreferenceOptions,
    dataSensitivityOptions,
    priorityOptions,
    onDetailedFieldChange,
    // onEnterpriseInquiryToggle,
}: DetailedRequestWizardProps) => (
    <>
        <div className="rounded-2xl border border-gray-200 bg-white/65 p-4">
            <div className="flex flex-wrap items-center gap-3">
                {stepTitles.map((title, index) => (
                    <div key={title} className="flex items-center gap-2">
                        <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                index <= currentStep ? 'bg-blue-900 text-white' : 'bg-gray-700 text-gray-600'
                            }`}
                        >
                            {index + 1}
                        </span>
                        <span className={`text-xs font-medium ${index === currentStep ? 'text-gray-900' : 'text-gray-500'}`}>{title}</span>
                    </div>
                ))}
            </div>
        </div>

        {currentStep === 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                    label={detailedCopy.projectTitle}
                    value={detailedRequest.title}
                    field="title"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.title}
                    required
                    maxLength={255}
                />

                <Field
                    label={detailedCopy.phone}
                    value={detailedRequest.requesterPhone}
                    field="requesterPhone"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.requesterPhone}
                    type="tel"
                    required
                    maxLength={50}
                />

                {/*<label className="flex items-start gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 md:col-span-2">*/}
                {/*  <input*/}
                {/*    type="checkbox"*/}
                {/*    checked={detailedRequest.enterpriseInquiry}*/}
                {/*    onChange={onEnterpriseInquiryToggle}*/}
                {/*    className="mt-0.5"*/}
                {/*  />*/}
                {/*  <span>{detailedCopy.enterpriseInquiry}</span>*/}
                {/*</label>*/}

                {/*{detailedRequest.enterpriseInquiry && (*/}
                {/*  <p className="rounded-xl border border-gray-600 px-3 py-2 text-sm text-white-700 md:col-span-2">*/}
                {/*    {detailedCopy.enterpriseHint}*/}
                {/*  </p>*/}
                {/*)}*/}
            </div>
        )}

        {currentStep === 1 && (
            <>
                <TextareaField
                    label={detailedCopy.businessGoal}
                    value={detailedRequest.businessGoal}
                    field="businessGoal"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.businessGoal}
                    rows={3}
                    required
                    maxLength={2000}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectField
                        label={detailedCopy.projectType}
                        value={detailedRequest.projectType}
                        field="projectType"
                        onChange={onDetailedFieldChange}
                        options={projectTypeOptions}
                        error={fieldErrors.projectType}
                        placeholder={detailedCopy.selectProjectType}
                        required
                    />

                    <SelectField
                        label={detailedCopy.desiredStart}
                        value={detailedRequest.desiredStartWindow}
                        field="desiredStartWindow"
                        onChange={onDetailedFieldChange}
                        options={desiredStartWindowOptions}
                        error={fieldErrors.desiredStartWindow}
                        placeholder={detailedCopy.selectStartWindow}
                        required
                    />

                    <SelectField
                        label={detailedCopy.budgetRange}
                        value={detailedRequest.budgetRange}
                        field="budgetRange"
                        onChange={onDetailedFieldChange}
                        options={budgetRangeOptions}
                        error={fieldErrors.budgetRange}
                        placeholder={detailedCopy.selectBudgetRange}
                        required
                    />

                    {!detailedRequest.enterpriseInquiry && (
                        <>
                            <SelectField
                                label={detailedCopy.budgetFlexibility}
                                value={detailedRequest.budgetFlexibility}
                                field="budgetFlexibility"
                                onChange={onDetailedFieldChange}
                                options={budgetFlexibilityOptions}
                                placeholder={detailedCopy.selectFlexibility}
                            />

                            <SelectField
                                label={detailedCopy.communicationPreference}
                                value={detailedRequest.communicationPreference}
                                field="communicationPreference"
                                onChange={onDetailedFieldChange}
                                options={communicationPreferenceOptions}
                                placeholder={detailedCopy.selectPreference}
                            />

                            <SelectField
                                label={detailedCopy.dataSensitivity}
                                value={detailedRequest.dataSensitivity}
                                field="dataSensitivity"
                                onChange={onDetailedFieldChange}
                                options={dataSensitivityOptions}
                                placeholder={detailedCopy.selectSensitivity}
                            />

                            <SelectField
                                label={detailedCopy.priority}
                                value={detailedRequest.priority}
                                field="priority"
                                onChange={onDetailedFieldChange}
                                options={priorityOptions}
                            />
                        </>
                    )}
                </div>
            </>
        )}

        {currentStep === 2 && !detailedRequest.enterpriseInquiry && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                    label={detailedCopy.organizationNameOptional}
                    value={detailedRequest.organizationName}
                    field="organizationName"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.organizationName}
                />

                <Field
                    label={detailedCopy.industryOptional}
                    value={detailedRequest.industry}
                    field="industry"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.industry}
                />

                <Field
                    label={detailedCopy.targetAudienceOptional}
                    value={detailedRequest.targetAudience}
                    field="targetAudience"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.targetAudience}
                    className="md:col-span-2"
                />

                <Field
                    label={detailedCopy.targetLaunchWindowOptional}
                    value={detailedRequest.targetLaunchWindow}
                    field="targetLaunchWindow"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.targetLaunchWindow}
                    className="md:col-span-2"
                />

                <TextareaField
                    label={detailedCopy.legalConstraintsOptional}
                    value={detailedRequest.legalOrBrandConstraints}
                    field="legalOrBrandConstraints"
                    onChange={onDetailedFieldChange}
                    error={fieldErrors.legalOrBrandConstraints}
                    rows={3}
                    className="md:col-span-2"
                />
            </div>
        )}

        {optionNotice && <p className="text-xs text-amber-700">{optionNotice}</p>}
        {!hasDetailedRequiredOptions && <p className="text-xs text-amber-700">{detailedCopy.optionsLoadingHint}</p>}
    </>
);
