import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Uses URL (e.g. router state) instead of useState to control tabs component
 * @param tabNames 
 * @returns 
 */
export const useRoutedTabs = (tabNames: string[]): [string, (tab: string) => void] => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const splitPath = pathname.split('/').slice(1);
  const basePath = splitPath.slice(0, splitPath.length - 1).join('/');

  const pathTab = tabNames.find((tabName) => (
    tabName === splitPath.at(-1)
  )) || tabNames[0];

  const setPathTab = (value: string) => {
    navigate(`/${basePath}/${value}`);
  };

  return [
    pathTab,
    setPathTab,
  ];
};