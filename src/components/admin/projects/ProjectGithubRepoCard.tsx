import { useMemo } from 'react';
import type { ProjectResponse } from '@/api';
import { StatusBadge } from '@/components';
import { useLocale } from '@/i18n/UseLocale';

interface GithubRepositoryItem {
    id?: string;
    owner?: string | null;
    name?: string | null;
    url?: string | null;
    provider?: string | null;
    status?: ProjectResponse['githubRepoStatus'];
    isPrimary?: boolean;
}

interface ProjectGithubRepoCardProps {
    project: ProjectResponse;
    onCreateRepo: () => void;
    onLinkRepo: () => void;
    isReadOnly: boolean;
}

export const ProjectGithubRepoCard = ({ project, onCreateRepo, onLinkRepo, isReadOnly }: ProjectGithubRepoCardProps) => {
    const { t } = useLocale();
    const text = t.admin.projectGithub.card;
    const repositories = useMemo<GithubRepositoryItem[]>(() => {
        const projectWithRepos = project as ProjectResponse & {
            githubRepositories?: GithubRepositoryItem[];
        };
        const candidate = projectWithRepos.githubRepositories;
        if (Array.isArray(candidate) && candidate.length > 0) {
            return candidate;
        }

        const hasLegacyRepo = Boolean(project.githubRepoUrl || (project.githubRepoOwner && project.githubRepoName));
        if (!hasLegacyRepo) {
            return [];
        }

        return [
            {
                id: 'legacy-primary',
                owner: project.githubRepoOwner ?? null,
                name: project.githubRepoName ?? null,
                url: project.githubRepoUrl ?? null,
                provider: (() => {
                    if (!project.githubRepoUrl) return null;
                    try {
                        return new URL(project.githubRepoUrl).hostname.replace(/^www\./, '');
                    } catch {
                        return null;
                    }
                })(),
                status: project.githubRepoStatus ?? undefined,
                isPrimary: true,
            },
        ];
    }, [project]);

    const hasRepo = repositories.length > 0;

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{text.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <StatusBadge value={project.githubRepoStatus ?? 'NOT_CREATED'} />
                        {project.githubRepoOwner && project.githubRepoName && (
                            <span className="rounded-lg bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                                {project.githubRepoOwner}/{project.githubRepoName}
                            </span>
                        )}
                    </div>
                </div>

                {!isReadOnly && (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={onCreateRepo}
                            className={
                                hasRepo
                                    ? 'inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
                                    : 'rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
                            }
                        >
                            {hasRepo ? '+' : null}
                            <span>{hasRepo ? text.addRepo : text.createRepo}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onLinkRepo}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {text.linkRepo}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 sm:grid-cols-3">
                <p>
                    <span className="font-medium text-gray-800">{text.linkedRepos}:</span> {repositories.length}
                </p>
                <p>
                    <span className="font-medium text-gray-800">{text.provider}:</span> {repositories[0]?.provider ?? text.noProvider}
                </p>
                <p>
                    <span className="font-medium text-gray-800">{text.primaryRepo}:</span>{' '}
                    {repositories[0]?.owner && repositories[0]?.name ? `${repositories[0].owner}/${repositories[0].name}` : '-'}
                </p>
            </div>

            {!hasRepo && <p className="mt-3 text-sm text-gray-500">{text.noRepo}</p>}

            {repositories.length > 0 && (
                <div className="mt-3 space-y-2">
                    {repositories.map((repo, index) => {
                        const key = repo.id ?? `${repo.owner ?? 'repo'}-${repo.name ?? index}`;
                        const repoDisplay = repo.owner && repo.name ? `${repo.owner}/${repo.name}` : (repo.url ?? '-');
                        return (
                            <div key={key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">{repoDisplay}</p>
                                    <p className="text-xs text-gray-500">
                                        {text.provider}: {repo.provider ?? text.noProvider}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {repo.status && <StatusBadge value={repo.status} />}
                                    {repo.url && (
                                        <a href={repo.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-gray-700 underline">
                                            {text.open}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {project.githubRepoStatus === 'FAILED' && project.githubLastError && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {text.lastError} {project.githubLastError}
                </p>
            )}
        </section>
    );
};
