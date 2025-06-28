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
      className="relative p-4 xl:p-5 2xl:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer flex flex-col h-full"
    >
      {isBestMatch && (
        <div className="absolute top-2 left-2 xl:top-3 xl:left-3">
          <span className="text-xs xl:text-sm font-bold text-white bg-orange-500 dark:bg-orange-600 px-2 py-1 xl:px-3 xl:py-1.5 rounded-full">
            Best Match
          </span>
        </div>
      )}
      <div className="absolute top-2 right-2 xl:top-3 xl:right-3">
        <span className="text-xs xl:text-sm font-bold text-white bg-blue-500 dark:bg-blue-600 px-2 py-1 xl:px-3 xl:py-1.5 rounded-full">
          {((Number(profile.similarity)+1) * 50).toFixed(0)}% Similar
        </span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mt-8 xl:mt-10 2xl:mt-12">
          <Avatar
            src={profile.avatar_url}
            name={profile.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1 xl:text-lg">
                {profile.name}
              </h3>
            </div>
          </div>
        </div>
        
        {profile.reason && (
          <div className="mt-4 xl:mt-5 2xl:mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-2 xl:p-3 bg-gray-50 dark:bg-gray-800">
            <p className="text-sm xl:text-base text-gray-700 dark:text-gray-200 font-serif italic">
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
        className="w-full mt-3 xl:mt-4 2xl:mt-5 px-3 py-2 xl:px-4 xl:py-2.5 bg-primary-500 text-white text-sm xl:text-base rounded-lg hover:bg-primary-600 transition-colors xl:font-medium"
      >
        View Contact
      </button>
    </div>
  );
} 