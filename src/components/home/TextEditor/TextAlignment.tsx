import { 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight, 
  FiAlignJustify 
} from "react-icons/fi";

interface TextAlignmentProps {
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onJustify: () => void;
  isFullscreen: boolean;
}

export default function TextAlignment({ 
  onAlignLeft, 
  onAlignCenter, 
  onAlignRight, 
  onJustify, 
  isFullscreen 
}: TextAlignmentProps) {
  return (
    <div className={`${isFullscreen ? 'flex' : 'hidden sm:flex'} items-center gap-1 flex-shrink-0`}>
      <button
        onClick={onAlignLeft}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Align Left"
      >
        <FiAlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={onAlignCenter}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Align Center"
      >
        <FiAlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={onAlignRight}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Align Right"
      >
        <FiAlignRight className="w-4 h-4" />
      </button>
      <button
        onClick={onJustify}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        title="Justify"
      >
        <FiAlignJustify className="w-4 h-4" />
      </button>
    </div>
  );
} 