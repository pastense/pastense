export interface PageVisit {
    url: string;
    title: string;
    content: string;
    timestamp: string;
}

export interface SearchQuery {
    q: string;
    k: number;
}

export interface SearchResult {
    url: string;
}

export interface PageResult {
    url: string;
    title: string;
    favicon: string;
} 