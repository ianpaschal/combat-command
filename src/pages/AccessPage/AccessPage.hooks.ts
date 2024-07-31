import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Uses URL (e.g. router state) instead of useState to control tabs component
 * @param tabNames 
 * @returns 
 */
export const useRoutedTabs = (tabNames: string[]): [string, (tab: string) => void] => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const pathTab = tabNames.find((tabName) => (
    tabName === pathname.split('/').pop()
  )) || tabNames[0];

  const setPathTab = (value: string) => {
    navigate(`/${value}`);
  };

  return [
    pathTab,
    setPathTab,
  ];
};