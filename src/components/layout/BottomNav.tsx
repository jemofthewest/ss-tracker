import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const tabs = [
  { to: '/', label: 'Workout', icon: '🏋️' },
  { to: '/calculator', label: 'Plates', icon: '🔢' },
  { to: '/history', label: 'History', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-2 px-4 min-h-[56px] min-w-[64px] text-xs transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-500',
              )
            }
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
