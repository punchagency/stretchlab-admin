import { api } from "./api";

export interface NoteSection {
    key: string;
    label: string;
    description: string;
    order: number;
    enabled: boolean;
}

export interface NoteTemplate {
    id: number | null;
    is_custom: boolean;
    name: string;
    sections: NoteSection[];
    active: boolean;
}

export interface NoteFormatResponse {
    status: string;
    template: NoteTemplate[];
}

export interface CreateNoteFormatPayload {
    id?: number;
    name: string;
    sections: NoteSection[];
    is_custom?: boolean;
}

export const getAllNoteFormats = async () => {
    const response = await api.get<NoteFormatResponse>("/admin/settings/note-format");
    return response;
};

export const createOrUpdateNoteFormat = async (payload: CreateNoteFormatPayload) => {
    const response = await api.post("/admin/settings/note-format/create", payload);
    return response;
};

export const deleteNoteFormat = async (templateId: number) => {
    return api.delete(`/admin/settings/note-format/remove?template_id=${templateId}`);
};

export const activateNoteFormat = async (templateId: number) => {
    return api.post("/admin/settings/note-format/activate", { template_id: templateId });
};
