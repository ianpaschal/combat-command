import clsx from 'clsx';

import { RequireAuth } from '~/components/RequireAuth';

export const SettingsPage = (): JSX.Element => (
  <RequireAuth>
    <h2 className={clsx('text-2xl', 'font-bold', 'tracking-tight')}>Settings</h2>
    <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
  </RequireAuth>
);
