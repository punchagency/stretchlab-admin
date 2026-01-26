import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2, X, Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { type NoteSection } from "@/service/noteformat";

interface TemplateCanvasProps {
    sections: NoteSection[];
    templateName: string;
    setTemplateName: (name: string) => void;
    isCreating: boolean;
    isEditMode: boolean;
    isSaving: boolean;
    onDragEnd: (result: DropResult) => void;
    onRemoveSection: (key: string) => void;
    onToggleSection: (key: string) => void;
    onCreateNew: () => void;
    onSave: () => void;
    onCancel: () => void;
    onShowAddModal: () => void;
    onEditSection: (key: string) => void;
}

export const TemplateCanvas = ({
    sections,
    templateName,
    setTemplateName,
    isCreating,
    isEditMode,
    isSaving,
    onDragEnd,
    onRemoveSection,
    onToggleSection,
    onCreateNew,
    onSave,
    onCancel,
    onShowAddModal,
    onEditSection,
}: TemplateCanvasProps) => {
    return (
        <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 min-h-[400px]">
                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                    <h4 className="text-base md:text-lg font-semibold text-gray-800">
                        {isCreating
                            ? isEditMode
                                ? "Edit Template"
                                : "Create New Template"
                            : "Template Builder"}
                    </h4>
                    {!isCreating && (
                        <Button
                            onClick={onCreateNew}
                            className="bg-primary-base hover:bg-primary-base/90 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Template
                        </Button>
                    )}
                </div>

                {isCreating ? (
                    <div className="p-3 md:p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template Name
                            </label>
                            <Input
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Enter template name"
                                className="max-w-md"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Sections ({sections.length})
                                </label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={onShowAddModal}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Custom Section
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                <p className="text-xs text-orange-700 leading-relaxed">
                                    <span className="font-semibold mr-1">💡 Tip:</span>
                                    Ensure section descriptions are robust and descriptive. The more clarity you provide in the description, the better the AI can understand and give better result.
                                </p>
                            </div>

                            {/* Drag and Drop Area */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="sections">
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`min-h-[200px] border-2 border-dashed rounded-lg p-2 md:p-4 transition-colors ${snapshot.isDraggingOver
                                                ? "border-primary-base bg-primary-light"
                                                : "border-gray-300 bg-gray-50"
                                                }`}
                                        >
                                            {sections.length === 0 ? (
                                                <div className="text-center py-12 text-gray-500">
                                                    <p className="mb-2">No sections added yet</p>
                                                    <p className="text-sm">
                                                        Add sections from the default template below or create custom ones
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sections.map((section, index) => (
                                                        <Draggable
                                                            key={section.key}
                                                            draggableId={section.key}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`bg-white border rounded-lg p-4 transition-all ${snapshot.isDragging
                                                                        ? "shadow-lg ring-2 ring-primary-base border-primary-base"
                                                                        : section.enabled
                                                                            ? "border-gray-200 hover:shadow-md hover:border-gray-300"
                                                                            : "border-gray-200 bg-gray-50 opacity-60"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-start gap-3 flex-col md:flex-row">
                                                                        <div
                                                                            {...provided.dragHandleProps}
                                                                            className="cursor-grab active:cursor-grabbing pt-1"
                                                                        >
                                                                            <GripVertical className="w-5 h-5 text-gray-400" />
                                                                        </div>

                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <h6 className="font-semibold text-gray-900">
                                                                                            {section.label}
                                                                                        </h6>
                                                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                                                                            Order: {section.order}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                                        {section.description}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-3 text-xs">
                                                                                        <span className="text-gray-500">
                                                                                            <span className="font-medium">Key:</span> {section.key}
                                                                                        </span>
                                                                                        <span className={`flex items-center gap-1 ${section.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                                                                            <span className={`w-2 h-2 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                                                            {section.enabled ? 'Enabled' : 'Disabled'}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 pt-1 justify-between md:justify-start w-full md:w-auto">
                                                                            <div className="flex flex-row md:flex-col items-center gap-1">
                                                                                <Switch
                                                                                    checked={section.enabled}
                                                                                    onCheckedChange={() => onToggleSection(section.key)}
                                                                                    className="data-[state=checked]:bg-primary-base"
                                                                                />
                                                                                <span className="text-xs text-gray-500">
                                                                                    {section.enabled ? 'On' : 'Off'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex flex-row md:flex-col gap-1">
                                                                                <Button
                                                                                    onClick={() => onEditSection(section.key)}
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() =>
                                                                                        onRemoveSection(section.key)
                                                                                    }
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </div>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                                onClick={onSave}
                                disabled={isSaving}
                                className="bg-primary-base hover:bg-primary-base/90 text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Template"}
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                disabled={isSaving}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="text-center py-12 text-gray-500">
                            <p className="mb-4">
                                Click "Create Template" to start building a new note template
                            </p>
                            <p className="text-sm">
                                Or select an existing template below to edit
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
