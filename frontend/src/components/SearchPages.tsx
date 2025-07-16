import { useState } from 'react';
import { semanticSearch, showResults } from '../api';
import { SearchQuery, PageResult } from '../types';
import { Search } from 'lucide-react';
import ResultsList from './ResultsList';

const SearchPages = () => {
    const [query, setQuery] = useState('');
    const [resultCount, setResultCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<PageResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const searchQuery: SearchQuery = {
                q: query.trim(),
                k: resultCount,
            };

            const searchResponse = await semanticSearch(searchQuery);
            const urls = searchResponse.results.map(result => result.url);

            if (urls.length > 0) {
                const resultsResponse = await showResults(urls);
                setResults(resultsResponse.results);
            } else {
                setResults([]);
            }
        } catch (err) {
            setError('Search failed. Please try again.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Search Your Pages</h2>

            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Query
                    </label>
                    <input
                        type="text"
                        id="search-query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., machine learning tutorials, cooking recipes..."
                    />
                </div>

                <div>
                    <label htmlFor="result-count" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Results
                    </label>
                    <select
                        id="result-count"
                        value={resultCount}
                        onChange={(e) => setResultCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={3}>3 results</option>
                        <option value={5}>5 results</option>
                        <option value={10}>10 results</option>
                        <option value={20}>20 results</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">
                        Found {results.length} result{results.length !== 1 ? 's' : ''}
                    </h3>
                    <ResultsList results={results} />
                </div>
            )}

            {!loading && results.length === 0 && query && !error && (
                <div className="text-center py-8 text-gray-500">
                    No results found for "{query}". Try a different search term.
                </div>
            )}
        </div>
    );
};

export default SearchPages; 