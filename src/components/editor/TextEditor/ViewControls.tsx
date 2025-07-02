import { FiMinus, FiMaximize2, FiMinimize2 } from "react-icons/fi";

interface ViewControlsProps {
  isFullscreen: boolean;
  onToggleToolbar: () => void;
  onToggleFullscreen: () => void;
}

export default function ViewControls({ 
  isFullscreen, 
  onToggleToolbar, 
  onToggleFullscreen 
}: ViewControlsProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={onToggleToolbar}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-200"
        title="Hide Toolbar"
      >
        <FiMinus className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleFullscreen}
        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-200"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <FiMinimize2 className="w-4 h-4" />
        ) : (
          <FiMaximize2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
} 