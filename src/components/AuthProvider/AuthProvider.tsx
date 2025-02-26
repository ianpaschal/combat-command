import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'convex/react';
import { LoaderCircle } from 'lucide-react';

import { api } from '~/api';
import { ChangePasswordDialog } from '~/components/ChangePasswordDialog';
import { AuthContext } from './AuthProvider.context';

import styles from './AuthProvider.module.scss';

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const user = useQuery(api.users.fetchCurrentUser.fetchCurrentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user !== undefined) {
      console.log(user);
      setLoading(false);
      console.log(user ? 'Signed in!' : 'No user signed in!');
    }
  }, [user]);

  if (loading) {
    return (
      <div className={styles.LoadingOverlay}>
        <LoaderCircle className={styles.LoadingIcon} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
      <ChangePasswordDialog
        open={updatePasswordDialogOpen}
        onOpenChange={setUpdatePasswordDialogOpen}
        preventCancel
      />
    </AuthContext.Provider>
  );
};
