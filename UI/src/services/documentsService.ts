import apiClient from '@/lib/api';

export interface Document {
    id: number;
    user_id: number;
    name: string;
    repo_url: string;
    github_repo: string;
    status: 'processing' | 'completed' | 'failed';
    file_path: string | null;
    pages: number | null;
    size: string | null;
    created_at: string;
}

export interface GenerateDocumentData {
    repo_url: string;
    prompt?: string;
}

export interface DocumentStatus {
    id: number;
    status: string;
    progress: number;
    message?: string | null;
}

const documentsService = {
    async generate(data: GenerateDocumentData): Promise<Document> {
        const response = await apiClient.post<Document>('/api/documents/generate', data);
        return response.data;
    },

    async getAll(): Promise<Document[]> {
        const response = await apiClient.get<Document[]>('/api/documents');
        return response.data;
    },

    async getById(id: number): Promise<Document> {
        const response = await apiClient.get<Document>(`/api/documents/${id}`);
        return response.data;
    },

    async checkStatus(id: number): Promise<DocumentStatus> {
        const response = await apiClient.get<DocumentStatus>(`/api/documents/${id}/status`);
        return response.data;
    },

    async download(id: number): Promise<Blob> {
        const response = await apiClient.get(`/api/documents/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/documents/${id}`);
    },

    // Helper function to trigger download
    downloadFile(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },
};

export default documentsService;
