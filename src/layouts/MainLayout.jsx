import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = () => {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : 'min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'}>
      <Outlet />
    </div>
  );
};

export default MainLayout;

