import { FiList } from "react-icons/fi";

interface ListFormattingProps {
  onUnorderedList: () => void;
  onOrderedList: () => void;
}

export default function ListFormatting({ onUnorderedList, onOrderedList }: ListFormattingProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={onUnorderedList}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Bullet List"
      >
        <FiList className="w-4 h-4" />
      </button>
      <button
        onClick={onOrderedList}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Numbered List"
      >
        <FiList className="w-4 h-4" />
      </button>
    </div>
  );
} 