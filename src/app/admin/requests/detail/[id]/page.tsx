'use client'

import {useCallback, useMemo, useState, type ChangeEvent, type FormEvent, type MouseEvent, use} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, requestApi} from '@/api';
import { requestTransitions } from '@/config';
import {useEntityDraftState, useSettingsOptions, useApiErrorState} from '@/hooks';
import type {
    BudgetFlexibility,
    BudgetRange,
    CommunicationPreference,
    DataSensitivity,
    DesiredStartWindow,
    Priority,
    ProjectType,
    RequestStatus,
} from '@/api';
import { Input, Textarea, RequestAnalysisReport, StatusBadge, EntityAuxPanels, CreateOfferSheet} from '@/components';
import Link from "next/link";

interface RequestFormState {
    title: string;
    description: string;
    requesterName: string;
    projectType: ProjectType;
    businessGoal: string;
    organizationName: string;
    industry: string;
    targetAudience: string;
    desiredStartWindow: DesiredStartWindow;
    targetLaunchWindow: string;
    budgetRange: BudgetRange;
    budgetFlexibility: BudgetFlexibility;
    enterpriseInquiry: boolean;
    communicationPreference: CommunicationPreference;
    legalOrBrandConstraints: string;
    dataSensitivity: DataSensitivity;
    priority: Priority;
}

const defaultFormState: RequestFormState = {
    title: '',
    description: '',
    requesterName: '',
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

type Params = {
    id:string
}

type Props = {
    params : Params
}

export default function RequestDetailPage({params} : Props){
    const queryClient = useQueryClient();
    const { errorMessage, setApiError, clearError } = useApiErrorState();
    const [showCreateOffer, setShowCreateOffer] = useState(false);
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
    // @ts-expect-error - Next.js 13 app router params typing is weird
    const {id} = use<Params>(params)

    const requestQuery = useQuery({
        queryKey: queryKeys.requests.detail(id),
        queryFn: () => requestApi.getById(id),
        enabled: Boolean(id),
    });

    const baseFormState = useMemo<RequestFormState>(() => {
        const request = requestQuery.data;
        return {
            ...defaultFormState,
            title: request?.title ?? '',
            description: request?.description || '',
            requesterName: request?.requesterName ?? '',
            projectType: request?.projectType ?? 'WEBSITE',
            businessGoal: request?.businessGoal ?? '',
            organizationName: request?.organizationName ?? '',
            industry: request?.industry ?? '',
            targetAudience: request?.targetAudience ?? '',
            desiredStartWindow: request?.desiredStartWindow ?? 'WITHIN_1_MONTH',
            targetLaunchWindow: request?.targetLaunchWindow ?? '',
            budgetRange: request?.budgetRange ?? 'UNKNOWN',
            budgetFlexibility: request?.budgetFlexibility ?? 'UNKNOWN',
            enterpriseInquiry: request?.enterpriseInquiry ?? false,
            communicationPreference: request?.communicationPreference ?? 'EMAIL',
            legalOrBrandConstraints: request?.legalOrBrandConstraints ?? '',
            dataSensitivity: request?.dataSensitivity ?? 'NONE',
            priority: request?.priority ?? 'MEDIUM',
        };
    }, [requestQuery.data]);

    const { state: formState, setField: handleFieldChange, resetDraft: resetFormDraft } = useEntityDraftState<RequestFormState>(id, baseFormState);

    const refreshRequestData = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.requests.root }),
        ]);
    }, [id, queryClient]);

    const updateMutation = useMutation({
        mutationFn: (payload: RequestFormState) => requestApi.update(id, payload),
        onSuccess: async () => {
            clearError();
            resetFormDraft();
            await refreshRequestData();
        },
        onError: (error) => setApiError(error),
    });

    const statusMutation = useMutation({
        mutationFn: ({ targetStatus, reason }: { targetStatus: RequestStatus; reason?: string }) =>
            requestApi.changeStatus(id, { targetStatus, reason }),
        onSuccess: async () => {
            clearError();
            await refreshRequestData();
        },
        onError: (error) => setApiError(error),
    });

    const availableTransitions = useMemo(() => {
        const current = requestQuery.data?.status;
        if (!current) {
            return [] as RequestStatus[];
        }
        return requestTransitions[current];
    }, [requestQuery.data?.status]);

    const handleUpdate = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await updateMutation.mutateAsync(formState);
        },
        [formState, updateMutation]
    );

    const handleOpenCreateOffer = useCallback(() => {
        setShowCreateOffer(true);
    }, []);

    const handleCloseCreateOffer = useCallback(() => {
        setShowCreateOffer(false);
    }, []);

    const handleOfferCreated = useCallback(() => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.offers.root });
    }, [queryClient]);

    const handleCopyRequestId = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(id);
            } else {
                const input = document.createElement('input');
                input.value = id;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }

            setCopyState('copied');
            window.setTimeout(() => setCopyState('idle'), 1800);
        } catch {
            setCopyState('error');
            window.setTimeout(() => setCopyState('idle'), 2200);
        }
    }, [id]);

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('title', event.target.value);
        },
        [handleFieldChange]
    );

    const handleRequesterNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('requesterName', event.target.value);
        },
        [handleFieldChange]
    );

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            handleFieldChange('description', event.target.value);
        },
        [handleFieldChange]
    );

    const handlePriorityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('priority', event.target.value as Priority);
        },
        [handleFieldChange]
    );

    const handleProjectTypeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('projectType', event.target.value as ProjectType);
        },
        [handleFieldChange]
    );

    const handleBusinessGoalChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            handleFieldChange('businessGoal', event.target.value);
        },
        [handleFieldChange]
    );

    const handleOrganizationNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('organizationName', event.target.value);
        },
        [handleFieldChange]
    );

    const handleIndustryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('industry', event.target.value);
        },
        [handleFieldChange]
    );

    const handleTargetAudienceChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('targetAudience', event.target.value);
        },
        [handleFieldChange]
    );

    const handleDesiredStartWindowChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('desiredStartWindow', event.target.value as DesiredStartWindow);
        },
        [handleFieldChange]
    );

    const handleTargetLaunchWindowChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('targetLaunchWindow', event.target.value);
        },
        [handleFieldChange]
    );

    const handleBudgetRangeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('budgetRange', event.target.value as BudgetRange);
        },
        [handleFieldChange]
    );

    const handleBudgetFlexibilityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('budgetFlexibility', event.target.value as BudgetFlexibility);
        },
        [handleFieldChange]
    );

    const handleEnterpriseInquiryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('enterpriseInquiry', event.target.checked);
        },
        [handleFieldChange]
    );

    const handleCommunicationPreferenceChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('communicationPreference', event.target.value as CommunicationPreference);
        },
        [handleFieldChange]
    );

    const handleLegalConstraintsChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            handleFieldChange('legalOrBrandConstraints', event.target.value);
        },
        [handleFieldChange]
    );

    const handleDataSensitivityChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFieldChange('dataSensitivity', event.target.value as DataSensitivity);
        },
        [handleFieldChange]
    );

    const handleStatusTransition = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const targetStatus = event.currentTarget.dataset.targetStatus as RequestStatus | undefined;
            if (!targetStatus) {
                return;
            }
            statusMutation.mutate({ targetStatus });
        },
        [statusMutation]
    );

    const { options: projectTypeOptions } = useSettingsOptions({
        groupKey: 'request.projectType',
        scope: 'admin',
    });
    const { options: desiredStartWindowOptions } = useSettingsOptions({
        groupKey: 'request.desiredStartWindow',
        scope: 'admin',
    });
    const { options: budgetRangeOptions } = useSettingsOptions({
        groupKey: 'request.budgetRange',
        scope: 'admin',
    });
    const { options: budgetFlexibilityOptions } = useSettingsOptions({
        groupKey: 'request.budgetFlexibility',
        scope: 'admin',
    });
    const { options: communicationPreferenceOptions } = useSettingsOptions({
        groupKey: 'request.communicationPreference',
        scope: 'admin',
    });
    const { options: dataSensitivityOptions } = useSettingsOptions({
        groupKey: 'request.dataSensitivity',
        scope: 'admin',
    });
    const { options: priorityOptions } = useSettingsOptions({
        groupKey: 'request.priority',
        scope: 'admin',
    });

    if (requestQuery.isLoading) {
        return <p className="text-sm text-gray-500">Loading request...</p>;
    }

    if (!requestQuery.data) {
        return <p className="text-sm text-gray-500">Request not found.</p>;
    }

    const request = requestQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Request detail</p>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{request.title}</h2>
                    <div className="mt-2 flex items-center gap-2">
                        <StatusBadge value={request.status} />
                        <StatusBadge value={request.priority} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">{request.id}</span>
                        <button
                            type="button"
                            onClick={handleCopyRequestId}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Copy ID
                        </button>
                        {copyState === 'copied' && <span className="text-xs text-emerald-700">Copied</span>}
                        {copyState === 'error' && <span className="text-xs text-rose-700">Copy failed</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleOpenCreateOffer}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        + Create offer
                    </button>
                    <Link href="/admin/requests" className="text-sm font-medium text-gray-700 underline">
                        Back to requests
                    </Link>
                </div>
            </div>

            {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>}

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Status actions</h3>
                <p className="mt-1 text-sm text-gray-600">Only valid transitions are shown.</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {availableTransitions.length === 0 && <p className="text-sm text-gray-500">No further transitions available.</p>}
                    {availableTransitions.map((target) => (
                        <button
                            key={target}
                            type="button"
                            data-target-status={target}
                            onClick={handleStatusTransition}
                            disabled={statusMutation.isPending}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Move to {target}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <RequestAnalysisReport requestId={request.id} requestTitle={request.title} />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Editable details</h3>
                <p className="mt-1 text-sm text-gray-600">Contact email and phone are immutable by backend contract.</p>

                <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
                    <Input label="Title" value={formState.title} onChange={handleTitleChange} className="rounded-xl px-3 py-2" required />

                    <Input
                        label="Requester name"
                        value={formState.requesterName}
                        onChange={handleRequesterNameChange}
                        className="rounded-xl px-3 py-2"
                    />

                    <div className="md:col-span-2">
                        <Textarea
                            label="Description"
                            value={formState.description}
                            onChange={handleDescriptionChange}
                            rows={4}
                            className="rounded-xl px-3 py-2"
                        />
                    </div>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Project type</span>
                        <select
                            value={formState.projectType}
                            onChange={handleProjectTypeChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {projectTypeOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="md:col-span-2">
                        <Textarea
                            label="Business goal"
                            value={formState.businessGoal}
                            onChange={handleBusinessGoalChange}
                            rows={3}
                            className="rounded-xl px-3 py-2"
                        />
                    </div>

                    <Input
                        label="Organization name"
                        value={formState.organizationName}
                        onChange={handleOrganizationNameChange}
                        className="rounded-xl px-3 py-2"
                    />
                    <Input label="Industry" value={formState.industry} onChange={handleIndustryChange} className="rounded-xl px-3 py-2" />
                    <Input
                        label="Target audience"
                        value={formState.targetAudience}
                        onChange={handleTargetAudienceChange}
                        className="rounded-xl px-3 py-2"
                    />
                    <Input
                        label="Target launch window"
                        value={formState.targetLaunchWindow}
                        onChange={handleTargetLaunchWindowChange}
                        className="rounded-xl px-3 py-2"
                    />

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Desired start window</span>
                        <select
                            value={formState.desiredStartWindow}
                            onChange={handleDesiredStartWindowChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {desiredStartWindowOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Budget range</span>
                        <select
                            value={formState.budgetRange}
                            onChange={handleBudgetRangeChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {budgetRangeOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Budget flexibility</span>
                        <select
                            value={formState.budgetFlexibility}
                            onChange={handleBudgetFlexibilityChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {budgetFlexibilityOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 md:col-span-2">
                        <input type="checkbox" checked={formState.enterpriseInquiry} onChange={handleEnterpriseInquiryChange} className="mt-0.5" />
                        <span>Enterprise inquiry (prefer direct communication and staged discovery)</span>
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Communication preference</span>
                        <select
                            value={formState.communicationPreference}
                            onChange={handleCommunicationPreferenceChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {communicationPreferenceOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Data sensitivity</span>
                        <select
                            value={formState.dataSensitivity}
                            onChange={handleDataSensitivityChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {dataSensitivityOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="md:col-span-2">
                        <Textarea
                            label="Legal or brand constraints"
                            value={formState.legalOrBrandConstraints}
                            onChange={handleLegalConstraintsChange}
                            rows={3}
                            className="rounded-xl px-3 py-2"
                        />
                    </div>

                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Priority</span>
                        <select
                            value={formState.priority}
                            onChange={handlePriorityChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        >
                            {priorityOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Input
                        label="Requester email (read only)"
                        value={request.requesterEmail}
                        disabled
                        className="rounded-xl border-gray-200 bg-gray-100 px-3 py-2"
                    />

                    <Input
                        label="Requester phone (read only)"
                        value={request.requesterPhone}
                        disabled
                        className="rounded-xl border-gray-200 bg-gray-100 px-3 py-2"
                    />

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </section>

            <section>
                <EntityAuxPanels entityType="REQUEST" entityId={request.id} />
            </section>

            <CreateOfferSheet
                isOpen={showCreateOffer}
                onClose={handleCloseCreateOffer}
                defaultRequestId={request.id}
                defaultLanguage={request.language}
                pricingContext={{
                    budgetRange: request.budgetRange,
                    budgetFlexibility: request.budgetFlexibility,
                }}
                onCreated={handleOfferCreated}
            />
        </div>
    );
};
