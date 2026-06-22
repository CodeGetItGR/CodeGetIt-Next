import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { blankDetailedRequest, initialUIState, type DetailedRequestFormState, uiReducer } from './useUIReducer';
import * as React from 'react';
import {useSettingsOptions} from "@/hooks";
import {ContactFormData, useContactRequest} from "@/providers";
import {useLocale} from "@/i18n/UseLocale";
import {usePublicSettings} from "@/settings/usePublicSettings";
import {en} from "@/i18n/locales";
import {contactMessageApi} from "@/api/contactMessages";
import {
    BudgetFlexibility,
    BudgetRange,
    CommunicationPreference, DataSensitivity,
    DesiredStartWindow, normalizeApiError, OfferLanguage, Priority,
    ProjectType,
    requestApi
} from "@/api";
import {premiumEase, premiumMotion} from "@/lib";
import {ContactForm, ContactSidebar} from "@/components";

export const Contact = () => {
    const { t } = useLocale();
    const { getBool, getString } = usePublicSettings();
    const { clearContactRequest, currentRequest } = useContactRequest();
    const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '', language: 'EN' });
    const [detailedRequest, setDetailedRequest] = useState<DetailedRequestFormState>(blankDetailedRequest);
    const [useDetailedRequest, setUseDetailedRequest] = useState(false);
    const [uiState, dispatch] = useReducer(uiReducer, initialUIState);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [optionNotice, setOptionNotice] = useState('');
    const submitTimerRef = useRef<number | null>(null);

    const { options: projectTypeOptions } = useSettingsOptions({
        groupKey: 'request.projectType',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: desiredStartWindowOptions } = useSettingsOptions({
        groupKey: 'request.desiredStartWindow',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: budgetRangeOptions } = useSettingsOptions({
        groupKey: 'request.budgetRange',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: budgetFlexibilityOptions } = useSettingsOptions({
        groupKey: 'request.budgetFlexibility',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: communicationPreferenceOptions } = useSettingsOptions({
        groupKey: 'request.communicationPreference',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: dataSensitivityOptions } = useSettingsOptions({
        groupKey: 'request.dataSensitivity',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: priorityOptions } = useSettingsOptions({
        groupKey: 'request.priority',
        scope: 'public',
        onlyEnabled: true,
    });
    const { options: languageOptions } = useSettingsOptions({
        groupKey: 'contact.language',
        scope: 'public',
        onlyEnabled: true,
    });

    const hasDetailedRequiredOptions = projectTypeOptions.length > 0 && desiredStartWindowOptions.length > 0 && budgetRangeOptions.length > 0;

    const detailedCopy = t.contact.detailed ?? en.contact.detailed!;
    const clearSubmitTimer = useCallback(() => {
        if (submitTimerRef.current !== null) {
            window.clearTimeout(submitTimerRef.current);
            submitTimerRef.current = null;
        }
    }, []);

    const resetMessages = useCallback(() => {
        clearSubmitTimer();
        dispatch({ type: 'RESET_MESSAGES' });
        setFieldErrors({});
    }, [clearSubmitTimer]);

    useEffect(() => () => clearSubmitTimer(), [clearSubmitTimer]);

    const ensureEnabledOption = useCallback((value: string, validValues: string[]) => {
        if (!value) {
            return value;
        }
        return validValues.includes(value) ? value : '';
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDetailedRequest((prev) => {
                const next: DetailedRequestFormState = {
                    ...prev,
                    projectType: ensureEnabledOption(
                        prev.projectType,
                        projectTypeOptions.map((item) => item.value)
                    ),
                    desiredStartWindow: ensureEnabledOption(
                        prev.desiredStartWindow,
                        desiredStartWindowOptions.map((item) => item.value)
                    ),
                    budgetRange: ensureEnabledOption(
                        prev.budgetRange,
                        budgetRangeOptions.map((item) => item.value)
                    ),
                    budgetFlexibility: ensureEnabledOption(
                        prev.budgetFlexibility,
                        budgetFlexibilityOptions.map((item) => item.value)
                    ),
                    communicationPreference: ensureEnabledOption(
                        prev.communicationPreference,
                        communicationPreferenceOptions.map((item) => item.value)
                    ),
                    dataSensitivity: ensureEnabledOption(
                        prev.dataSensitivity,
                        dataSensitivityOptions.map((item) => item.value)
                    ),
                    priority:
                        ensureEnabledOption(
                            prev.priority,
                            priorityOptions.map((item) => item.value)
                        ) || 'MEDIUM',
                };

                const changed =
                    next.projectType !== prev.projectType ||
                    next.desiredStartWindow !== prev.desiredStartWindow ||
                    next.budgetRange !== prev.budgetRange ||
                    next.budgetFlexibility !== prev.budgetFlexibility ||
                    next.communicationPreference !== prev.communicationPreference ||
                    next.dataSensitivity !== prev.dataSensitivity ||
                    next.priority !== prev.priority;

                if (changed) {
                    setOptionNotice('Some options changed recently, so we cleared unavailable selections for you.');
                }

                return changed ? next : prev;
            });
        }, 0);

        return () => window.clearTimeout(timer);
    }, [
        budgetFlexibilityOptions,
        budgetRangeOptions,
        communicationPreferenceOptions,
        dataSensitivityOptions,
        desiredStartWindowOptions,
        ensureEnabledOption,
        priorityOptions,
        projectTypeOptions,
    ]);

    useEffect(() => {
        if (!currentRequest) {
            return;
        }

        const timer = window.setTimeout(() => {
            setFormData({
                name: currentRequest.formData?.name ?? '',
                email: currentRequest.formData?.email ?? '',
                message: currentRequest.formData?.message ?? '',
                language: currentRequest.formData?.language ?? 'EN',
            });
            setDetailedRequest({
                ...blankDetailedRequest,
                ...(currentRequest.detailedRequest ?? {}),
            });
            setUseDetailedRequest(currentRequest.useDetailedRequest ?? false);
            dispatch({ type: 'SET_STEP', step: 0 });
            resetMessages();
            setOptionNotice('');
            clearContactRequest();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [clearContactRequest, currentRequest, resetMessages]);

    const validateDetailedRequest = useCallback(() => {
        const errors: Record<string, string> = {};

        if (!detailedRequest.title.trim()) errors.title = 'Project title is required.';
        else if (detailedRequest.title.trim().length > 255) errors.title = 'Project title must be 255 characters or fewer.';

        if (!formData.name.trim()) errors.requesterName = 'Your name is required.';
        else if (formData.name.trim().length > 255) errors.requesterName = 'Name must be 255 characters or fewer.';

        if (!formData.email.trim()) errors.requesterEmail = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.requesterEmail = 'Enter a valid email address.';
        else if (formData.email.trim().length > 255) errors.requesterEmail = 'Email must be 255 characters or fewer.';

        if (!detailedRequest.requesterPhone.trim()) errors.requesterPhone = 'Phone is required.';
        else if (detailedRequest.requesterPhone.trim().length > 50) errors.requesterPhone = 'Phone must be 50 characters or fewer.';

        if (!detailedRequest.projectType) errors.projectType = 'Project type is required.';
        if (!detailedRequest.businessGoal.trim()) errors.businessGoal = 'Business goal is required.';
        else if (detailedRequest.businessGoal.trim().length > 2000) errors.businessGoal = 'Business goal must be 2000 characters or fewer.';
        if (!detailedRequest.desiredStartWindow) errors.desiredStartWindow = 'Desired start window is required.';
        if (!detailedRequest.budgetRange) errors.budgetRange = 'Budget range is required.';

        if (formData.message.trim().length > 5000) errors.description = 'Description must be 5000 characters or fewer.';
        if (detailedRequest.organizationName.trim().length > 255) errors.organizationName = 'Organization name must be 255 characters or fewer.';
        if (detailedRequest.industry.trim().length > 100) errors.industry = 'Industry must be 100 characters or fewer.';
        if (detailedRequest.targetAudience.trim().length > 2000) errors.targetAudience = 'Target audience must be 2000 characters or fewer.';
        if (detailedRequest.targetLaunchWindow.trim().length > 100)
            errors.targetLaunchWindow = 'Target launch window must be 100 characters or fewer.';
        if (detailedRequest.legalOrBrandConstraints.trim().length > 2000)
            errors.legalOrBrandConstraints = 'Constraints must be 2000 characters or fewer.';

        return errors;
    }, [detailedRequest, formData.email, formData.message, formData.name]);

    const detailedSteps = useMemo(
        () => [detailedCopy.contactInfo, detailedCopy.projectEssentials, ...(!detailedRequest.enterpriseInquiry ? [detailedCopy.extraContext] : [])],
        [detailedCopy.contactInfo, detailedCopy.extraContext, detailedCopy.projectEssentials, detailedRequest.enterpriseInquiry]
    );

    const detailedStepFields = useMemo<ReadonlyArray<ReadonlyArray<string>>>(
        () => [
            ['requesterName', 'requesterEmail', 'title', 'requesterPhone'],
            ['projectType', 'businessGoal', 'desiredStartWindow', 'budgetRange'],
            ...(!detailedRequest.enterpriseInquiry
                ? [['description', 'organizationName', 'industry', 'targetAudience', 'targetLaunchWindow', 'legalOrBrandConstraints']]
                : []),
        ],
        [detailedRequest.enterpriseInquiry]
    );

    const hasErrorsInStep = useCallback(
        (errors: Record<string, string>, stepIndex: number) => {
            const fields = detailedStepFields[stepIndex] ?? [];
            return fields.some((field) => Boolean(errors[field]));
        },
        [detailedStepFields]
    );

    const firstErrorStep = useCallback(
        (errors: Record<string, string>) => {
            for (let index = 0; index < detailedStepFields.length; index += 1) {
                if (hasErrorsInStep(errors, index)) {
                    return index;
                }
            }
            return 0;
        },
        [detailedStepFields.length, hasErrorsInStep]
    );

    useEffect(() => {
        const maxStep = detailedSteps.length - 1;
        if (uiState.currentStep > maxStep) {
            dispatch({ type: 'SET_STEP', step: maxStep });
        }
    }, [detailedSteps.length, uiState.currentStep]);

    const handleNextStep = useCallback(() => {
        const validationErrors = validateDetailedRequest();
        if (hasErrorsInStep(validationErrors, uiState.currentStep)) {
            setFieldErrors(validationErrors);
            dispatch({
                type: 'SUBMIT_ERROR',
                errorText: 'Please complete the required fields in this step.',
            });
            return;
        }

        resetMessages();
        dispatch({ type: 'NEXT_STEP', maxSteps: detailedSteps.length });
    }, [detailedSteps.length, hasErrorsInStep, resetMessages, uiState.currentStep, validateDetailedRequest]);

    const handlePreviousStep = useCallback(() => {
        resetMessages();
        dispatch({ type: 'PREVIOUS_STEP' });
    }, [resetMessages]);

    const handleSubmit = useCallback(
        async (event: React.SubmitEvent) => {
            event.preventDefault();
            resetMessages();
            dispatch({ type: 'SUBMIT_START' });

            try {
                if (!useDetailedRequest) {
                    await contactMessageApi.submit({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        message: formData.message.trim(),
                        language: (formData.language || undefined) as OfferLanguage | undefined,
                    });
                } else {
                    if (!hasDetailedRequiredOptions) {
                        throw new Error('Request options are still loading. Please wait a moment and try again.');
                    }

                    const validationErrors = validateDetailedRequest();
                    if (Object.keys(validationErrors).length > 0) {
                        setFieldErrors(validationErrors);
                        dispatch({
                            type: 'SUBMIT_ERROR',
                            errorText: 'Please review the highlighted fields and try again.',
                        });
                        dispatch({ type: 'SET_STEP', step: firstErrorStep(validationErrors) });
                        return;
                    }

                    const response = await requestApi.submit({
                        title: detailedRequest.title.trim(),
                        description: formData.message.trim() || undefined,
                        requesterName: formData.name.trim(),
                        requesterEmail: formData.email.trim(),
                        requesterPhone: detailedRequest.requesterPhone.trim(),
                        projectType: detailedRequest.projectType as ProjectType,
                        businessGoal: detailedRequest.businessGoal.trim(),
                        organizationName: detailedRequest.organizationName.trim() || undefined,
                        industry: detailedRequest.industry.trim() || undefined,
                        targetAudience: detailedRequest.targetAudience.trim() || undefined,
                        desiredStartWindow: detailedRequest.desiredStartWindow as DesiredStartWindow,
                        targetLaunchWindow: detailedRequest.targetLaunchWindow.trim() || undefined,
                        budgetRange: detailedRequest.budgetRange as BudgetRange,
                        budgetFlexibility: (detailedRequest.budgetFlexibility || undefined) as BudgetFlexibility | undefined,
                        enterpriseInquiry: detailedRequest.enterpriseInquiry,
                        communicationPreference: (detailedRequest.communicationPreference || undefined) as CommunicationPreference | undefined,
                        legalOrBrandConstraints: detailedRequest.legalOrBrandConstraints.trim() || undefined,
                        dataSensitivity: (detailedRequest.dataSensitivity || undefined) as DataSensitivity | undefined,
                        priority: (detailedRequest.priority || undefined) as Priority | undefined,
                        language: (formData.language || undefined) as OfferLanguage | undefined,
                    });

                    dispatch({ type: 'SUBMIT_SUCCESS', requestId: response.id });
                }

                setFormData({ name: '', email: '', message: '', language: 'EN' });
                setDetailedRequest(blankDetailedRequest);
                dispatch({ type: 'SET_STEP', step: 0 });
                setOptionNotice('');
                clearSubmitTimer();
                submitTimerRef.current = window.setTimeout(() => dispatch({ type: 'RESET_MESSAGES' }), 6000);
            } catch (error) {
                const apiError = normalizeApiError(error);
                setFieldErrors(apiError.fieldErrors ?? {});
                dispatch({
                    type: 'SUBMIT_ERROR',
                    errorText: apiError.fieldErrors ? t.contact.errorFixFields : apiError.detail || t.contact.errorGeneric,
                });
            }
        },
        [
            clearSubmitTimer,
            detailedRequest,
            firstErrorStep,
            formData,
            hasDetailedRequiredOptions,
            resetMessages,
            t.contact.errorFixFields,
            t.contact.errorGeneric,
            useDetailedRequest,
            validateDetailedRequest,
        ]
    );

    const handleChange = useCallback(
        (field: keyof ContactFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
        },
        []
    );

    const handleDetailedRequestToggle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setUseDetailedRequest(event.target.checked);
            dispatch({ type: 'SET_STEP', step: 0 });
            resetMessages();
            setOptionNotice('');
        },
        [resetMessages]
    );

    const handleDetailedFieldChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const field = event.currentTarget.getAttribute('data-request-field') as keyof DetailedRequestFormState | null;
        if (!field) {
            return;
        }

        const value = event.currentTarget.value;
        setDetailedRequest((prev) => ({ ...prev, [field]: value }));
    }, []);

    // const handleEnterpriseInquiryToggle = useCallback(
    //   (event: ChangeEvent<HTMLInputElement>) => {
    //     const { checked } = event.target;
    //     setDetailedRequest((prev) => ({
    //       ...prev,
    //       enterpriseInquiry: checked,
    //       budgetFlexibility: checked ? '' : prev.budgetFlexibility,
    //       communicationPreference: checked ? '' : prev.communicationPreference,
    //       dataSensitivity: checked ? '' : prev.dataSensitivity,
    //       priority: checked ? 'MEDIUM' : prev.priority,
    //     }));
    //     resetMessages();
    //   },
    //   [resetMessages],
    // );

    const contactFormEnabled = getBool('availability.contactFormEnabled', true);
    const publicContactEmail = getString('marketing.contactEmail', 'info@codegetit.com');

    const formLabels = useMemo(
        () => ({
            nameLabel: t.contact.nameLabel,
            namePlaceholder: t.contact.namePlaceholder,
            emailLabel: t.contact.emailLabel,
            emailPlaceholder: t.contact.emailPlaceholder,
            messageLabel: t.contact.messageLabel,
            messagePlaceholder: t.contact.messagePlaceholder,
            languageLabel: t.contact.languageLabel,
            sendButtonLabel: t.contact.sendButton,
            sendingLabel: t.contact.sending,
            successText: t.contact.success,
        }),
        [
            t.contact.emailLabel,
            t.contact.emailPlaceholder,
            t.contact.languageLabel,
            t.contact.messageLabel,
            t.contact.messagePlaceholder,
            t.contact.nameLabel,
            t.contact.namePlaceholder,
            t.contact.sendButton,
            t.contact.sending,
            t.contact.success,
        ]
    );

    // Continuity with Act III: same paper field, no divider seam, tightened
    // top so Contact reads as the next paragraph after "You get it."
    return (
        <section id="contact" className="relative pt-10 pb-28 lg:pt-16 lg:pb-32">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: premiumMotion.normal, ease: premiumEase }}
                    className="mb-14 max-w-4xl"
                >
                    <p className="section-kicker">{t.contact.badge}</p>
                    <h2 className="section-title">{t.contact.title}</h2>
                    <p className="section-subtitle">{t.contact.subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                    {contactFormEnabled && (
                        <ContactForm
                            labels={formLabels}
                            detailedCopy={detailedCopy}
                            formData={formData}
                            detailedRequest={detailedRequest}
                            useDetailedRequest={useDetailedRequest}
                            currentStep={uiState.currentStep}
                            isSubmitting={uiState.isSubmitting}
                            submitState={uiState.submitState}
                            submittedRequestId={uiState.submittedRequestId}
                            errorText={uiState.errorText}
                            fieldErrors={fieldErrors}
                            optionNotice={optionNotice}
                            hasDetailedRequiredOptions={hasDetailedRequiredOptions}
                            stepTitles={detailedSteps}
                            projectTypeOptions={projectTypeOptions}
                            desiredStartWindowOptions={desiredStartWindowOptions}
                            budgetRangeOptions={budgetRangeOptions}
                            budgetFlexibilityOptions={budgetFlexibilityOptions}
                            communicationPreferenceOptions={communicationPreferenceOptions}
                            dataSensitivityOptions={dataSensitivityOptions}
                            priorityOptions={priorityOptions}
                            languageOptions={languageOptions}
                            onChange={handleChange}
                            onDetailedRequestToggle={handleDetailedRequestToggle}
                            onDetailedFieldChange={handleDetailedFieldChange}
                            // onEnterpriseInquiryToggle={handleEnterpriseInquiryToggle}
                            onNextStep={handleNextStep}
                            onPreviousStep={handlePreviousStep}
                            onSubmit={handleSubmit}
                        />
                    )}

                    <ContactSidebar
                        emailLabel={t.contact.email}
                        email={publicContactEmail}
                        locationLabel={t.contact.location}
                        locationValue={t.contact.locationValue}
                        responseTimeLabel={t.contact.responseTimeLabel}
                        responseTimeValue={t.contact.responseTimeValue}
                        trustNote={t.contact.trustNote}
                        className={contactFormEnabled ? 'lg:col-span-5' : 'lg:col-span-7'}
                    />
                </div>
            </div>
        </section>
    );
};
