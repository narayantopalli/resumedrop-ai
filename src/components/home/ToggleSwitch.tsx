interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ 
  isOn, 
  onToggle, 
  disabled = false 
}: ToggleSwitchProps) {
  return (
    <>
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{isOn ? 'Open' : 'Private'}</span>
        <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
        </button>
    </>
  );
} 