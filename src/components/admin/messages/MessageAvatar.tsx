interface MessageAvatarProps {
    name: string;
}

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return '?';
    }

    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
};

export const MessageAvatar = ({ name }: MessageAvatarProps) => {
    return (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
            {getInitials(name)}
        </span>
    );
};
