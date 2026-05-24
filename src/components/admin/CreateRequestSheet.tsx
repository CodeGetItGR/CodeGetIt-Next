import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    BudgetFlexibility,
    BudgetRange, CommunicationPreference, DataSensitivity,
    DesiredStartWindow,
    Priority,
    ProjectType,
    queryKeys,
    requestApi,
    SubmitRequestPayload
} from "@/api";
import {useApiErrorState, useSettingsOptions} from "@/hooks";
import {useLocale} from "@/i18n/UseLocale";
import {Input, SlideSheet, Textarea} from "@/components";

interface CreateRequestSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const blankForm: SubmitRequestPayload = {
    title: '',
    description: '',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    projectType: 'WEBSITE',
    businessGoal: '',
    organizationName: '',
    industry: '',
    targetAudience: '',
    desiredStartWindow: 'WITHIN_1_MONTH',
    targetLaunchWindow: '',
    budgetRange: 'UNKNOWN',
    budgetFlexibility: 'UNKNOWN',
    enterpriseInquiry: false,
    communicationPreference: 'EMAIL',
    legalOrBrandConstraints: '',
    dataSensitivity: 'NONE',
    priority: 'MEDIUM',
};

export const CreateRequestSheet = ({ isOpen, onClose, onCreated }: CreateRequestSheetProps) => {
    const [form, setForm] = useState<SubmitRequestPayload>(blankForm);
    const { errorMessage, setApiError, clearError } = useApiErrorState();
    const queryClient = useQueryClient();
    const { t } = useLocale();
    const text = t.admin.createRequestSheet;

    const createMutation = useMutation({
        mutationFn: () => requestApi.submit(form),
        onSuccess: async () => {
            clearError();
            setForm(blankForm);
            await queryClient.invalidateQueries({ queryKey: queryKeys.requests.root });
            onCreated?.();
            onClose();
        },
        onError: (error) => setApiError(error),
    });

    const setField = useCallback(<TKey extends keyof SubmitRequestPayload>(key: TKey, value: SubmitRequestPayload[TKey]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            createMutation.mutate();
        },
        [createMutation]
    );

    const handleClose = useCallback(() => {
        setForm(blankForm);
        clearError();
        onClose();
    }, [clearError, onClose]);

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('title', event.target.value);
        },
        [setField]
    );

    const handleRequesterNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('requesterName', event.target.value);
        },
        [setField]
    );

    const handleRequesterEmailChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('requesterEmail', event.target.value);
        },
        [setField]
    );

    const handleRequesterPhoneChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('requesterPhone', event.target.value);
        },
        [setField]
    );

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setField('description', event.target.value);
        },
        [setField]
    );

    const handlePriorityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('priority', event.target.value as Priority);
        },
        [setField]
    );

    const handleProjectTypeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('projectType', event.target.value as ProjectType);
        },
        [setField]
    );

    const handleBusinessGoalChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setField('businessGoal', event.target.value);
        },
        [setField]
    );

    const handleOrganizationNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('organizationName', event.target.value);
        },
        [setField]
    );

    const handleIndustryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('industry', event.target.value);
        },
        [setField]
    );

    const handleTargetAudienceChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('targetAudience', event.target.value);
        },
        [setField]
    );

    const handleDesiredStartWindowChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('desiredStartWindow', event.target.value as DesiredStartWindow);
        },
        [setField]
    );

    const handleTargetLaunchWindowChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('targetLaunchWindow', event.target.value);
        },
        [setField]
    );

    const handleBudgetRangeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('budgetRange', event.target.value as BudgetRange);
        },
        [setField]
    );

    const handleBudgetFlexibilityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('budgetFlexibility', event.target.value as BudgetFlexibility);
        },
        [setField]
    );

    const handleEnterpriseInquiryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('enterpriseInquiry', event.target.checked);
        },
        [setField]
    );

    const handleCommunicationPreferenceChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('communicationPreference', event.target.value as CommunicationPreference);
        },
        [setField]
    );

    const handleLegalConstraintsChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setField('legalOrBrandConstraints', event.target.value);
        },
        [setField]
    );

    const handleDataSensitivityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('dataSensitivity', event.target.value as DataSensitivity);
        },
        [setField]
    );

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

    return (
        <SlideSheet isOpen={isOpen} onClose={handleClose} title={text.title} description={text.description}>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input label={text.labels.title} value={form.title} onChange={handleTitleChange} placeholder={text.placeholders.title} required />

                <Input label={text.labels.requesterName} value={form.requesterName} onChange={handleRequesterNameChange} required />

                <Input label={text.labels.requesterEmail} type="email" value={form.requesterEmail} onChange={handleRequesterEmailChange} required />

                <Input label={text.labels.requesterPhone} type="tel" value={form.requesterPhone} onChange={handleRequesterPhoneChange} required />

                <Textarea
                    label={text.labels.description}
                    value={form.description ?? ''}
                    onChange={handleDescriptionChange}
                    rows={3}
                    placeholder={text.placeholders.description}
                />

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.projectType}</label>
                    <select
                        value={form.projectType}
                        onChange={handleProjectTypeChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        required
                    >
                        {projectTypeOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Textarea
                    label={text.labels.businessGoal}
                    value={form.businessGoal}
                    onChange={handleBusinessGoalChange}
                    rows={3}
                    placeholder={text.placeholders.businessGoal}
                    required
                />

                <label className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    <input type="checkbox" checked={Boolean(form.enterpriseInquiry)} onChange={handleEnterpriseInquiryChange} className="mt-0.5" />
                    <span>{text.enterpriseHint}</span>
                </label>

                {form.enterpriseInquiry && (
                    <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">{text.enterpriseEnabled}</p>
                )}

                <Input label={text.labels.organizationName} value={form.organizationName ?? ''} onChange={handleOrganizationNameChange} />
                <Input label={text.labels.industry} value={form.industry ?? ''} onChange={handleIndustryChange} />
                <Input label={text.labels.targetAudience} value={form.targetAudience ?? ''} onChange={handleTargetAudienceChange} />

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.desiredStartWindow}</label>
                    <select
                        value={form.desiredStartWindow}
                        onChange={handleDesiredStartWindowChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        required
                    >
                        {desiredStartWindowOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label={text.labels.targetLaunchWindow}
                    value={form.targetLaunchWindow ?? ''}
                    onChange={handleTargetLaunchWindowChange}
                    placeholder={text.placeholders.targetLaunchWindow}
                />

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.budgetRange}</label>
                    <select
                        value={form.budgetRange}
                        onChange={handleBudgetRangeChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        required
                    >
                        {budgetRangeOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.budgetFlexibility}</label>
                    <select
                        value={form.budgetFlexibility}
                        onChange={handleBudgetFlexibilityChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        {budgetFlexibilityOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.communicationPreference}</label>
                    <select
                        value={form.communicationPreference}
                        onChange={handleCommunicationPreferenceChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        {communicationPreferenceOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.dataSensitivity}</label>
                    <select
                        value={form.dataSensitivity}
                        onChange={handleDataSensitivityChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        {dataSensitivityOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Textarea
                    label={text.labels.legalOrBrandConstraints}
                    value={form.legalOrBrandConstraints ?? ''}
                    onChange={handleLegalConstraintsChange}
                    rows={3}
                    placeholder={text.placeholders.legalOrBrandConstraints}
                />

                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.labels.priority}</label>
                    <select
                        value={form.priority}
                        onChange={handlePriorityChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        {priorityOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>}

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        {createMutation.isPending ? text.submitting : text.submitButton}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        {text.cancel}
                    </button>
                </div>
            </form>
        </SlideSheet>
    );
};
