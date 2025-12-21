import {
  matchPath,
  useLocation,
  useNavigate,
} from 'react-router-dom';

export const useNavigateAway = (pattern: string, target: string): () => void => {
  const location = useLocation();
  const navigate = useNavigate();
  return () => {
    if (matchPath(pattern, location.pathname)) {
      navigate(target, { replace: true });
    }
  };
};
