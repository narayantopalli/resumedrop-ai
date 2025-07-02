import { FiBold, FiItalic } from "react-icons/fi";

interface TextFormattingProps {
  onBold: () => void;
  onItalic: () => void;
}

export default function TextFormatting({ onBold, onItalic }: TextFormattingProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={onBold}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-200"
        title="Bold"
      >
        <FiBold className="w-4 h-4" />
      </button>
      <button
        onClick={onItalic}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-200"
        title="Italic"
      >
        <FiItalic className="w-4 h-4" />
      </button>
    </div>
  );
} 