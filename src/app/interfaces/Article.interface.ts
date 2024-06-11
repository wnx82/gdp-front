export interface Attachment {
    filename: string;
    url: string;
}

export interface Article {
    _id: number;
    title: string;
    category: string;
    date: string;
    content: string;
    severity: string;
    attachments: Attachment[] | null;
    author: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
