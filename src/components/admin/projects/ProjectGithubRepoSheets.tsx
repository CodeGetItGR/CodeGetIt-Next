import type { ChangeEvent, FormEvent } from 'react';
import { SlideSheet } from '@/components/admin/SlideSheet';
import { Input } from '@/components/ui';

interface ProjectGithubRepoSheetsProps {
    showCreateRepoSheet: boolean;
    showLinkRepoSheet: boolean;
    createRepoName: string;
    createPrivateRepo: boolean;
    linkRepoUrl: string;
    linkRepoName: string;
    githubActionError: string | null;
    isPending: boolean;
    onCloseCreateRepoSheet: () => void;
    onCloseLinkRepoSheet: () => void;
    onCreateRepoNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onCreatePrivateRepoChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onLinkRepoUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onLinkRepoNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onCreateRepoSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onLinkRepoSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const ProjectGithubRepoSheets = ({
    showCreateRepoSheet,
    showLinkRepoSheet,
    createRepoName,
    createPrivateRepo,
    linkRepoUrl,
    linkRepoName,
    githubActionError,
    isPending,
    onCloseCreateRepoSheet,
    onCloseLinkRepoSheet,
    onCreateRepoNameChange,
    onCreatePrivateRepoChange,
    onLinkRepoUrlChange,
    onLinkRepoNameChange,
    onCreateRepoSubmit,
    onLinkRepoSubmit,
}: ProjectGithubRepoSheetsProps) => {
    return (
        <>
            <SlideSheet
                isOpen={showCreateRepoSheet}
                onClose={onCloseCreateRepoSheet}
                title="Create GitHub Repository"
                description="Create a new repository in your configured GitHub owner and attach it to this project."
            >
                <form className="space-y-4" onSubmit={onCreateRepoSubmit}>
                    <Input
                        label="Repository name (optional)"
                        value={createRepoName}
                        onChange={onCreateRepoNameChange}
                        placeholder="e.g. acme-client-portal"
                    />

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={createPrivateRepo} onChange={onCreatePrivateRepoChange} />
                        <span>Private repository</span>
                    </label>

                    {githubActionError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{githubActionError}</p>}

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {isPending ? 'Creating...' : 'Create repo'}
                        </button>
                        <button
                            type="button"
                            onClick={onCloseCreateRepoSheet}
                            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </SlideSheet>

            <SlideSheet
                isOpen={showLinkRepoSheet}
                onClose={onCloseLinkRepoSheet}
                title="Link Existing GitHub Repository"
                description="Attach an existing github.com repository URL to this project."
            >
                <form className="space-y-4" onSubmit={onLinkRepoSubmit}>
                    <Input
                        label="Repository URL"
                        value={linkRepoUrl}
                        onChange={onLinkRepoUrlChange}
                        placeholder="https://github.com/org/repo"
                        required
                    />

                    <Input label="Repository name override (optional)" value={linkRepoName} onChange={onLinkRepoNameChange} placeholder="repo-name" />

                    {githubActionError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{githubActionError}</p>}

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {isPending ? 'Linking...' : 'Link repository'}
                        </button>
                        <button
                            type="button"
                            onClick={onCloseLinkRepoSheet}
                            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </SlideSheet>
        </>
    );
};
