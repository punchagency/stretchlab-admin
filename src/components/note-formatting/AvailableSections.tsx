import { type NoteSection, type NoteTemplate } from "@/service/noteformat";

interface AvailableSectionsProps {
    defaultTemplate: NoteTemplate;
    currentSections: NoteSection[];
    onAddSection: (section: NoteSection) => void;
}

export const AvailableSections = ({
    defaultTemplate,
    currentSections,
    onAddSection,
}: AvailableSectionsProps) => {
    return (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Available Sections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {defaultTemplate.sections.map((section) => {
                    const isAdded = currentSections.some((s) => s.key === section.key);
                    return (
                        <div
                            key={section.key}
                            className={`bg-white border rounded-lg p-4 transition-all ${isAdded
                                ? "border-gray-200 opacity-50"
                                : "border-gray-300 hover:border-primary-base hover:shadow-md cursor-pointer"
                                }`}
                            onClick={() => !isAdded && onAddSection(section)}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{section.label}</h5>
                                {isAdded && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Added
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
