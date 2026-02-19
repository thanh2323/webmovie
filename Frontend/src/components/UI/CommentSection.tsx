import { useState } from 'react';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';


interface Comment {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    likes: number;
    timeAgo: string;
    replies?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: '1',
        user: {
            name: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
        },
        content: 'This movie was absolutely mind-blowing! The visual effects in the final sequence were unlike anything I\'ve ever seen before. Definitely a must-watch for sci-fi fans.',
        likes: 24,
        timeAgo: '2 hours ago',
        replies: [
            {
                id: '1-1',
                user: {
                    name: 'Mike Ross',
                    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80'
                },
                content: 'Totally agree! The sound design was also top-notch.',
                likes: 5,
                timeAgo: '1 hour ago'
            }
        ]
    },
    {
        id: '2',
        user: {
            name: 'David Chen',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
        },
        content: 'I felt the pacing was a bit slow in the second act, but the ending made up for it. The character development was really deep.',
        likes: 12,
        timeAgo: '5 hours ago'
    },
    {
        id: '3',
        user: {
            name: 'Emily Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
        },
        content: 'Can wait for the sequel! The post-credits scene gave me chills.',
        likes: 45,
        timeAgo: '1 day ago'
    }
];

export function CommentSection() {
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            user: {
                name: 'You',
                avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=100&q=80'
            },
            content: newComment,
            likes: 0,
            timeAgo: 'Just now'
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="bg-surface/50 border border-white/5 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                Comments <span className="text-gray-500 text-lg font-normal">({comments.length})</span>
            </h3>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mb-10 flex gap-4">
                <img
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=100&q=80"
                    alt="Current User"
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the discussion..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 min-h-[100px] resize-y transition-all"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Post Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="group">
                        <div className="flex gap-4">
                            <img
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white text-sm">{comment.user.name}</span>
                                    <span className="text-gray-500 text-xs">• {comment.timeAgo}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">{comment.content}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{comment.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Reply</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="pl-14 mt-4 space-y-4">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-4">
                                        <img
                                            src={reply.user.avatar}
                                            alt={reply.user.name}
                                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white text-sm">{reply.user.name}</span>
                                                <span className="text-gray-500 text-xs">• {reply.timeAgo}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-3">{reply.content}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <button className="flex items-center gap-1 hover:text-white transition-colors">
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                    <span>{reply.likes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
