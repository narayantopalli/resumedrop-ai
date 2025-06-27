import Avatar from '../Avatar';
import { Profile } from './types';

interface ProfileCardProps {
  profile: Profile;
  isBestMatch: boolean;
  onViewContact: () => void;
}

export default function ProfileCard({ 
  profile, 
  isBestMatch, 
  onViewContact 
}: ProfileCardProps) {
  return (
    <div
      onClick={onViewContact}
      className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer flex flex-col h-full"
    >
      {isBestMatch && (
        <div className="absolute top-2 left-2">
          <span className="text-xs font-bold text-white bg-orange-500 dark:bg-orange-600 px-2 py-1 rounded-full">
            Best Match
          </span>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className="text-xs font-bold text-white bg-blue-500 dark:bg-blue-600 px-2 py-1 rounded-full">
          {((Number(profile.similarity)+1) * 50).toFixed(0)}% Similar
        </span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mt-8">
          <Avatar
            src={profile.avatar_url}
            name={profile.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                {profile.name}
              </h3>
            </div>
          </div>
        </div>
        
        {profile.reason && (
          <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-200 font-serif italic">
              {profile.reason}
            </p>
          </div>
        )}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onViewContact();
        }}
        className="w-full mt-3 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
      >
        View Contact
      </button>
    </div>
  );
} 