import { FiMaximize2 } from "react-icons/fi";

interface HiddenToolbarProps {
  onShowToolbar: () => void;
}

export default function HiddenToolbar({ onShowToolbar }: HiddenToolbarProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-1 flex items-center justify-end flex-shrink-0">
      <button
        onClick={onShowToolbar}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Show Toolbar"
      >
        <FiMaximize2 className="w-4 h-4" />
      </button>
    </div>
  );
} 