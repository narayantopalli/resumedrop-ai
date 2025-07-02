import FormatDropdown from './FormatDropdown';
import TextFormatting from './TextFormatting';
import ListFormatting from './ListFormatting';
import TextAlignment from './TextAlignment';
import ViewControls from './ViewControls';

interface ToolbarProps {
  currentFormat: string;
  formatOptions: Array<{ value: string; label: string }>;
  onFormatChange: (tagName: string) => void;
  formatDropdownOpen: boolean;
  onFormatDropdownToggle: (e: React.MouseEvent) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnorderedList: () => void;
  onOrderedList: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onJustify: () => void;
  isFullscreen: boolean;
  onToggleToolbar: () => void;
  onToggleFullscreen: () => void;
}

export default function Toolbar({
  currentFormat,
  formatOptions,
  onFormatChange,
  formatDropdownOpen,
  onFormatDropdownToggle,
  onBold,
  onItalic,
  onUnorderedList,
  onOrderedList,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onJustify,
  isFullscreen,
  onToggleToolbar,
  onToggleFullscreen
}: ToolbarProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-2 flex-shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto overflow-y-visible scrollbar-hide flex-1">
          <FormatDropdown
            currentFormat={currentFormat}
            formatOptions={formatOptions}
            onFormatChange={onFormatChange}
            isOpen={formatDropdownOpen}
            onToggle={onFormatDropdownToggle}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 flex-shrink-0"></div>

          <TextFormatting onBold={onBold} onItalic={onItalic} />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 flex-shrink-0"></div>

          <ListFormatting onUnorderedList={onUnorderedList} onOrderedList={onOrderedList} />

          <div className={`w-px h-6 bg-gray-300 dark:bg-gray-500 flex-shrink-0 ${isFullscreen ? 'block' : 'hidden sm:block'}`}></div>

          <TextAlignment
            onAlignLeft={onAlignLeft}
            onAlignCenter={onAlignCenter}
            onAlignRight={onAlignRight}
            onJustify={onJustify}
            isFullscreen={isFullscreen}
          />
        </div>

        <ViewControls
          isFullscreen={isFullscreen}
          onToggleToolbar={onToggleToolbar}
          onToggleFullscreen={onToggleFullscreen}
        />
      </div>
    </div>
  );
} 