import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DropResult } from "@hello-pangea/dnd";
import {
    getAllNoteFormats,
    createOrUpdateNoteFormat,
    deleteNoteFormat,
    activateNoteFormat,
    type NoteTemplate,
    type NoteSection,
    type CreateNoteFormatPayload,
} from "@/service/noteformat";
import { ContainLoader, ConfirmModal } from "@/components/shared";
import { ErrorHandle } from "@/components/app";
import {
    renderErrorToast,
    renderSuccessToast,
    renderWarningToast,
} from "@/components/utils";
import { type ApiError } from "@/types";
import { AddSectionModal } from "@/components/note-formatting/AddSectionModal";
// import { AvailableSections } from "@/components/note-formatting/AvailableSections";
import { TemplateCanvas } from "@/components/note-formatting/TemplateCanvas";
import { TemplateList } from "@/components/note-formatting/TemplateList";

export const NoteFormatting = () => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ["note-formats"],
        queryFn: getAllNoteFormats,
    });

    const [canvasSections, setCanvasSections] = useState<NoteSection[]>([]);
    const [templateName, setTemplateName] = useState("");
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [newSectionLabel, setNewSectionLabel] = useState("");
    const [newSectionDescription, setNewSectionDescription] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<NoteTemplate | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState<number | string | null>(null);

    const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);

    const defaultTemplate = data?.data?.template?.find((t) => !t.is_custom);
    const allTemplates = data?.data?.template || [];
    const sortedTemplates = [
        ...allTemplates.filter(t => !t.is_custom),
        ...allTemplates.filter(t => t.is_custom),
    ];

    const handleEditTemplate = (template: NoteTemplate) => {
        setCanvasSections([...template.sections]);
        setTemplateName(template.name);
        setEditingTemplateId(template.id);
        setIsCreatingTemplate(true);
        setIsEditMode(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCreateNewTemplate = () => {
        if (!defaultTemplate) {
            renderWarningToast("Default template not found");
            return;
        }
        setCanvasSections([...defaultTemplate.sections]);
        setTemplateName("");
        setEditingTemplateId(null);
        setIsCreatingTemplate(true);
        setIsEditMode(false);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(canvasSections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order property
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index + 1,
        }));

        setCanvasSections(updatedItems);
    };

    const handleRemoveSection = (key: string) => {
        const remainingSections = canvasSections.filter((section) => section.key !== key);
        // Re-index the order
        const reorderedSections = remainingSections.map((section, index) => ({
            ...section,
            order: index + 1
        }));
        setCanvasSections(reorderedSections);
    };

    const handleToggleSection = (key: string) => {
        setCanvasSections(canvasSections.map((section) =>
            section.key === key ? { ...section, enabled: !section.enabled } : section
        ));
    };

    const handleEditSection = (key: string) => {
        const section = canvasSections.find((s) => s.key === key);
        if (section) {
            setNewSectionLabel(section.label);
            setNewSectionDescription(section.description);
            setEditingSectionKey(key);
            setShowAddSectionModal(true);
        }
    };

    const handleAddNewSection = () => {
        if (!newSectionLabel.trim() || !newSectionDescription.trim()) {
            renderWarningToast("Please fill in all fields");
            return;
        }

        // Check if section already exists (exclude current key if editing)
        const sectionExists = canvasSections.some(
            (s) => s.key.toLowerCase() === newSectionLabel.toLowerCase() && s.key !== editingSectionKey
        );
        if (sectionExists) {
            renderWarningToast("A section with this key/label already exists");
            return;
        }

        if (editingSectionKey) {
            // Update existing section
            setCanvasSections(canvasSections.map(section => {
                if (section.key === editingSectionKey) {
                    return {
                        ...section,
                        key: newSectionLabel, // Update key
                        label: newSectionLabel, // Update label
                        description: newSectionDescription
                    };
                }
                return section;
            }));
            setEditingSectionKey(null);
        } else {
            // Add new section
            const newSection: NoteSection = {
                key: newSectionLabel,
                label: newSectionLabel,
                description: newSectionDescription,
                order: canvasSections.length + 1,
                enabled: true,
            };
            setCanvasSections([...canvasSections, newSection]);
        }

        setNewSectionLabel("");
        setNewSectionDescription("");
        setShowAddSectionModal(false);
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            renderWarningToast("Please enter a template name");
            return;
        }

        if (canvasSections.length === 0) {
            renderWarningToast("Please add at least one section");
            return;
        }

        let isCustom = true;
        if (editingTemplateId) {
            const existing = allTemplates.find((t) => t.id === editingTemplateId);
            if (existing) {
                isCustom = existing.is_custom;
            }
        }

        const payload: CreateNoteFormatPayload = {
            name: templateName,
            sections: canvasSections,
            is_custom: isCustom,
        };

        if (editingTemplateId) {
            payload.id = editingTemplateId;
        }

        setIsSaving(true);
        try {
            const response = await createOrUpdateNoteFormat(payload);
            if (response.status === 200 || response.status === 201) {
                renderSuccessToast(
                    editingTemplateId
                        ? "Template updated successfully"
                        : "Template created successfully"
                );
                refetch();
                handleCancelEdit();
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(
                apiError.response?.data?.message || "Failed to save template"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (template: NoteTemplate) => {
        setTemplateToDelete(template);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!templateToDelete || !templateToDelete.id) return;

        setIsDeleting(true);
        try {
            await deleteNoteFormat(templateToDelete.id);
            renderSuccessToast("Template deleted successfully");
            refetch();
            setShowDeleteModal(false);
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(apiError.response?.data?.message || "Failed to delete template");
        } finally {
            setIsDeleting(false);
            setTemplateToDelete(null);
        }
    };

    const handleActivateTemplate = async (templateId: number) => {
        setIsActivating(templateId);
        try {
            await activateNoteFormat(templateId);
            renderSuccessToast("Template activated successfully");
            refetch();
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(apiError.response?.data?.message || "Failed to activate template");
        } finally {
            setIsActivating(null);
        }
    };

    const handleCancelEdit = () => {
        setCanvasSections([]);
        setTemplateName("");
        setEditingTemplateId(null);
        setIsCreatingTemplate(false);
        setIsEditMode(false);
    };

    if (isPending) {
        return (
            <div className="w-full h-[90%]">
                <ContainLoader text="Fetching note formats..." />
            </div>
        );
    }

    if (error) {
        return <ErrorHandle retry={refetch} />;
    }

    return (
        <div className="px-7 py-6">
            <div className="mb-8">
                <h3 className="md:text-2xl text-lg font-semibold mb-2">
                    Note Formatting
                </h3>
                <p className="text-gray-600 text-sm">
                    Create and manage note templates with customizable sections
                </p>
            </div>

            <TemplateCanvas
                sections={canvasSections}
                templateName={templateName}
                setTemplateName={setTemplateName}
                isCreating={isCreatingTemplate}
                isEditMode={isEditMode}
                isSaving={isSaving}
                onDragEnd={handleDragEnd}
                onRemoveSection={handleRemoveSection}
                onToggleSection={handleToggleSection}
                onCreateNew={handleCreateNewTemplate}
                onSave={handleSaveTemplate}
                onCancel={handleCancelEdit}
                onShowAddModal={() => {
                    setEditingSectionKey(null);
                    setNewSectionLabel("");
                    setNewSectionDescription("");
                    setShowAddSectionModal(true);
                }}
                onEditSection={handleEditSection}
            />

            {/* {isCreatingTemplate && defaultTemplate && (
                <AvailableSections
                    defaultTemplate={defaultTemplate}
                    currentSections={canvasSections}
                    onAddSection={handleAddFromDefault}
                />
            )} */}

            <TemplateList
                templates={sortedTemplates}
                activatingId={isActivating}
                onEdit={handleEditTemplate}
                onActivate={handleActivateTemplate}
                onDelete={handleDeleteClick}
            />

            <AddSectionModal
                isOpen={showAddSectionModal}
                onClose={() => {
                    setShowAddSectionModal(false);
                    setEditingSectionKey(null);
                    setNewSectionLabel("");
                    setNewSectionDescription("");
                }}
                onAdd={handleAddNewSection}
                label={newSectionLabel}
                setLabel={setNewSectionLabel}
                description={newSectionDescription}
                setDescription={setNewSectionDescription}
                isEditing={!!editingSectionKey}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setTemplateToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Template"
                message={`Are you sure you want to delete the template "${templateToDelete?.name}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                confirmButtonClassName="bg-red-600 hover:bg-red-700"
                loading={isDeleting}
                error={false}
            />
        </div>
    );
};
