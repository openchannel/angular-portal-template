export class AppListRequest {
    query: string;
    text: string;
    sort: string;
    pageNumber: number;
    limit: number;
    userId: string;
    isOwner: boolean;
}