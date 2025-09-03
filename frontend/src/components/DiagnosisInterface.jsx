import React, { useState } from 'react';
import { Search, Share, Plus, Home, Globe, Compass, MoreHorizontal, User, Paperclip, Mic, ArrowUp, ChevronRight } from 'lucide-react';

const PerplexityChatInterface = () => {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [followUpQuery, setFollowUpQuery] = useState('');

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyPress = (e, isFollowUp = false) => {
        if (e.key === 'Enter') {
            if (isFollowUp) {
                handleSearch(followUpQuery);
                setFollowUpQuery('');
            } else {
                handleSearch(query);
            }
        }
    };

    const sources = [
        {
            id: 1,
            name: 'NPR',
            title: 'Ancient Fish With Strong Jawline Could Rewrite...',
            icon: '📻'
        },
        {
            id: 2,
            name: 'Phys.org',
            title: 'Bite by bite: How jaw jaws drove fish evolution -...',
            icon: '🔬'
        },
        {
            id: 3,
            name: 'Nature',
            title: 'Ancient fish face shows roots of modern jaw -...',
            icon: 'n'
        },
        {
            id: 4,
            name: 'University of Chicago',
            title: 'Ancient fossil fish reveals key step before...',
            icon: '🎓'
        }
    ];

    if (!hasSearched) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex">
                {/* Sidebar */}
                <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
                    <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                            <div className="w-3 h-3 bg-white transform rotate-45"></div>
                        </div>
                    </div>

                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Plus size={20} className="text-gray-400" />
                    </button>

                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Home size={20} className="text-gray-400" />
                            </button>
                            <span className="text-xs text-gray-500">Home</span>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Compass size={20} className="text-gray-400" />
                            </button>
                            <span className="text-xs text-gray-500">Discover</span>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Globe size={20} className="text-gray-400" />
                            </button>
                            <span className="text-xs text-gray-500">Spaces</span>
                        </div>
                    </div>

                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <User size={20} className="text-cyan-400" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-light mb-2 tracking-wide">perplexity</h1>
                    </div>

                    <div className="w-full max-w-2xl relative">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-cyan-400 transition-all">
                            <input
                                type="text"
                                placeholder="Ask anything..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                            />

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Search size={20} className="text-cyan-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Paperclip size={20} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Globe size={20} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <MoreHorizontal size={20} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Globe size={20} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Paperclip size={20} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Mic size={20} className="text-gray-400" />
                                    </button>
                                    <button className="bg-cyan-400 p-2 rounded-lg hover:bg-cyan-500 transition-colors">
                                        <ArrowUp size={20} className="text-gray-900" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                        <div className="w-3 h-3 bg-white transform rotate-45"></div>
                    </div>
                </div>

                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Plus size={20} className="text-gray-400" />
                </button>

                <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Home size={20} className="text-gray-400" />
                        </button>
                        <span className="text-xs text-gray-500">Home</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Compass size={20} className="text-gray-400" />
                        </button>
                        <span className="text-xs text-gray-500">Discover</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Globe size={20} className="text-gray-400" />
                        </button>
                        <span className="text-xs text-gray-500">Spaces</span>
                    </div>
                </div>

                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <User size={20} className="text-cyan-400" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-light">{query || 'Ancient fish jaw evolution mystery'}</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <MoreHorizontal size={20} className="text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Share size={20} className="text-gray-400" />
                        </button>
                        <button className="bg-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-cyan-500 transition-colors flex items-center space-x-2">
                            <Share size={16} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    {/* Tabs */}
                    <div className="flex space-x-8 mb-6 border-b border-gray-800">
                        <button className="pb-4 border-b-2 border-cyan-400 text-cyan-400">Answer</button>
                        <button className="pb-4 text-gray-400 hover:text-white transition-colors">Images</button>
                        <button className="pb-4 text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                            <span>Sources</span>
                            <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">10</span>
                        </button>
                        <button className="pb-4 text-gray-400 hover:text-white transition-colors">Steps</button>
                    </div>

                    {/* Sources */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {sources.map((source) => (
                            <div key={source.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                                        {source.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-300">{source.name}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{source.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="aspect-square bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-green-800 to-blue-800 flex items-center justify-center">
                                    <div className="text-4xl">🐟</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Answer */}
                    <div className="max-w-4xl">
                        {isLoading ? (
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                                <span className="text-gray-400">Searching...</span>
                            </div>
                        ) : (
                            <div className="text-gray-300 leading-relaxed">
                                <p>
                                    The mystery of ancient fish jaw evolution is significantly illuminated by discoveries of fossils like
                                    Entelognathus primordialis, a 419-million-year-old armored fish from China. This fish is the
                                    earliest known creature with a modern bony jaw structure, resembling the jaws of humans and
                                    other bony vertebrates. This finding challenges the previously held belief that bony fish jaws
                                    evolved independently later and suggests that placoderms (armored fish) are the ancestors of
                                    modern bony fish and land vertebrates, including humans. The fossil shows a combination of
                                    features from placoderms and bony fish, indicating placoderms may not have gone extinct but
                                    evolved into a diverse range of species. <span className="text-cyan-400">npr ↗</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Follow-up Input */}
                    <div className="mt-8 max-w-4xl">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-cyan-400 transition-all">
                            <input
                                type="text"
                                placeholder="Ask a follow-up..."
                                value={followUpQuery}
                                onChange={(e) => setFollowUpQuery(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, true)}
                                className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                            />

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Search size={18} className="text-cyan-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Paperclip size={18} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Globe size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <MoreHorizontal size={18} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Paperclip size={18} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <Mic size={18} className="text-gray-400" />
                                    </button>
                                    <button className="bg-cyan-400 p-2 rounded-lg hover:bg-cyan-500 transition-colors">
                                        <ArrowUp size={18} className="text-gray-900" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerplexityChatInterface;