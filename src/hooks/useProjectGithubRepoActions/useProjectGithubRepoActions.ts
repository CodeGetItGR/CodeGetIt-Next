'use client'

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, projectApi, normalizeApiError } from '@/api';

interface UseProjectGithubRepoActionsParams {
    projectId: string;
    projectDetailQueryKey: readonly [string, string];
    onSuccess?: () => void;
}

export function useProjectGithubRepoActions({ projectId, projectDetailQueryKey, onSuccess }: UseProjectGithubRepoActionsParams) {
    const queryClient = useQueryClient();
    const [showCreateRepoSheet, setShowCreateRepoSheet] = useState(false);
    const [showLinkRepoSheet, setShowLinkRepoSheet] = useState(false);
    const [createRepoName, setCreateRepoName] = useState('');
    const [createPrivateRepo, setCreatePrivateRepo] = useState(true);
    const [linkRepoUrl, setLinkRepoUrl] = useState('');
    const [linkRepoName, setLinkRepoName] = useState('');
    const [githubActionError, setGithubActionError] = useState<string | null>(null);
    const [githubActionSuccess, setGithubActionSuccess] = useState<string | null>(null);

    const resetForms = useCallback(() => {
        setCreateRepoName('');
        setCreatePrivateRepo(true);
        setLinkRepoUrl('');
        setLinkRepoName('');
    }, []);

    const githubRepoMutation = useMutation({
        mutationFn: (payload: Parameters<typeof projectApi.githubRepoAction>[1]) => projectApi.githubRepoAction(projectId, payload),
        onSuccess: async (updatedProject) => {
            setGithubActionError(null);
            setGithubActionSuccess('GitHub repository settings updated successfully.');
            setShowCreateRepoSheet(false);
            setShowLinkRepoSheet(false);
            resetForms();
            onSuccess?.();

            queryClient.setQueryData(projectDetailQueryKey, updatedProject);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.root }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.history.scoped('PROJECT', projectId),
                }),
            ]);
        },
        onError: (error) => {
            setGithubActionSuccess(null);
            setGithubActionError(normalizeApiError(error).detail);
        },
    });

    const openCreateRepoSheet = useCallback(() => {
        setGithubActionError(null);
        setGithubActionSuccess(null);
        setShowCreateRepoSheet(true);
    }, []);

    const openLinkRepoSheet = useCallback(() => {
        setGithubActionError(null);
        setGithubActionSuccess(null);
        setShowLinkRepoSheet(true);
    }, []);

    const closeCreateRepoSheet = useCallback(() => {
        setShowCreateRepoSheet(false);
        setGithubActionError(null);
    }, []);

    const closeLinkRepoSheet = useCallback(() => {
        setShowLinkRepoSheet(false);
        setGithubActionError(null);
    }, []);

    const handleCreateRepoNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCreateRepoName(event.target.value);
    }, []);

    const handleCreatePrivateRepoChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCreatePrivateRepo(event.target.checked);
    }, []);

    const handleLinkRepoUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLinkRepoUrl(event.target.value);
    }, []);

    const handleLinkRepoNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLinkRepoName(event.target.value);
    }, []);

    const submitCreateRepo = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setGithubActionError(null);
            setGithubActionSuccess(null);

            githubRepoMutation.mutate({
                mode: 'CREATE',
                repoName: createRepoName.trim() || undefined,
                privateRepo: createPrivateRepo,
            });
        },
        [createPrivateRepo, createRepoName, githubRepoMutation]
    );

    const submitLinkRepo = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setGithubActionError(null);
            setGithubActionSuccess(null);

            const normalizedUrl = linkRepoUrl.trim();
            const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/i;
            if (!githubUrlPattern.test(normalizedUrl)) {
                setGithubActionError('Please provide a valid GitHub URL in the format https://github.com/{owner}/{repo}.');
                return;
            }

            githubRepoMutation.mutate({
                mode: 'LINK',
                repoUrl: normalizedUrl,
                repoName: linkRepoName.trim() || undefined,
            });
        },
        [githubRepoMutation, linkRepoName, linkRepoUrl]
    );

    return {
        showCreateRepoSheet,
        showLinkRepoSheet,
        createRepoName,
        createPrivateRepo,
        linkRepoUrl,
        linkRepoName,
        githubActionError,
        githubActionSuccess,
        isGithubActionPending: githubRepoMutation.isPending,
        openCreateRepoSheet,
        openLinkRepoSheet,
        closeCreateRepoSheet,
        closeLinkRepoSheet,
        handleCreateRepoNameChange,
        handleCreatePrivateRepoChange,
        handleLinkRepoUrlChange,
        handleLinkRepoNameChange,
        submitCreateRepo,
        submitLinkRepo,
    };
}
