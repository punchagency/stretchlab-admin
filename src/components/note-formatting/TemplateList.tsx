import { type NoteTemplate } from "@/service/noteformat";
import { TemplateCard } from "./TemplateCard";

interface TemplateListProps {
    templates: NoteTemplate[];
    activatingId: number | string | null;
    onEdit: (template: NoteTemplate) => void;
    onActivate: (id: number) => void;
    onDelete: (template: NoteTemplate) => void;
}

export const TemplateList = ({
    templates,
    activatingId,
    onEdit,
    onActivate,
    onDelete,
}: TemplateListProps) => {
    return (
        <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Templates
            </h4>
            {templates.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">
                        No templates available.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => {
                        const hasActive = templates.some((t) => t.active);
                        const isActive = template.active || (!hasActive && !template.is_custom);

                        return (
                            <TemplateCard 
                                key={template.id || 'default'}
                                template={{ ...template, active: isActive }}
                                isActivating={activatingId === template.id}
                                onEdit={onEdit}
                                onActivate={onActivate}
                                onDelete={onDelete}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
