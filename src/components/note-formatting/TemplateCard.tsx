import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NoteTemplate } from "@/service/noteformat";

interface TemplateCardProps {
    template: NoteTemplate;
    isActivating: boolean;
    onEdit: (template: NoteTemplate) => void;
    onActivate: (id: number) => void;
    onDelete: (template: NoteTemplate) => void;
}

export const TemplateCard = ({
    template,
    isActivating,
    onEdit,
    onActivate,
    onDelete,
}: TemplateCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Template Header */}
            <div className="bg-gradient-to-r from-primary-base to-primary-tertiary p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-bold text-white text-xl">
                                {template.name}
                            </h5>
                            {!template.is_custom && (
                                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                                    Default
                                </span>
                            )}
                            {template.active && (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                                    Active
                                </span>
                            )}
                        </div>
                        <p className="text-white/90 text-sm">
                            {template.sections.length} section{template.sections.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {template.id && (
                            <>
                                {!template.active && (
                                    <Button
                                        onClick={() => onActivate(template.id!)}
                                        variant="ghost"
                                        size="sm"
                                        disabled={isActivating}
                                        className="text-white hover:text-white hover:bg-white/20 bg-orange-500"
                                    >
                                        {isActivating ? (
                                            <>
                                                Activating...
                                            </>
                                        ) : (
                                            <>
                                                Activate
                                            </>
                                        )}
                                    </Button>
                                )}
                                {template.is_custom && (
                                    <Button
                                        onClick={() => onDelete(template)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-white/20 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </>
                        )}
                        {template.id && <Button
                            onClick={() => onEdit(template)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-white/20"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>}
                    </div>
                </div>
            </div>

            {/* Sections List */}
            <div className="p-5">
                <div className="space-y-3">
                    {template.sections.map((section) => (
                        <div
                            key={section.key}
                            className={`border rounded-lg p-4 transition-all ${section.enabled
                                ? 'border-gray-200 bg-white hover:shadow-sm'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                                    <span className="text-primary-base font-semibold text-sm">
                                        {section.order}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h6 className="font-semibold text-gray-900">
                                            {section.label}
                                        </h6>
                                        <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${section.enabled
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-gray-400'
                                                }`} />
                                            {section.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>

                                    {/* <p className="text-sm text-gray-600 mb-2">
                                        {section.description}
                                    </p> */}

                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                            <span className="font-medium">Key:</span>
                                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                                                {section.key}
                                            </code>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
