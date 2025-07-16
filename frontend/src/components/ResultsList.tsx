import { PageResult } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface ResultsListProps {
    results: PageResult[];
}

const ResultsList = ({ results }: ResultsListProps) => {
    const getDomainFromUrl = (url: string): string => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    return (
        <div className="space-y-3">
            {results.map((result, index) => (
                <div
                    key={`${result.url}-${index}`}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                            <img
                                src={result.favicon}
                                alt="Favicon"
                                className="w-4 h-4 mt-1 flex-shrink-0"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900 truncate">
                                    {result.title}
                                </h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <Globe className="w-3 h-3 mr-1" />
                                    {getDomainFromUrl(result.url)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 break-all">
                                    {result.url}
                                </p>
                            </div>
                        </div>
                        <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Visit
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResultsList; 