import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
    label: string;
    setLabel: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    isEditing?: boolean;
}

export const AddSectionModal = ({
    isOpen,
    onClose,
    onAdd,
    label,
    setLabel,
    description,
    setDescription,
    isEditing = false,
}: AddSectionModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {isEditing ? "Edit Section" : "Add Custom Section"}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Key
                        </label>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g., Goals"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Session goals and objectives"
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={onAdd}
                        className="flex-1 bg-primary-base hover:bg-primary-base/90 text-white"
                    >
                        {isEditing ? "Update Section" : "Add Section"}
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            setLabel("");
                            setDescription("");
                        }}
                        variant="outline"
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
