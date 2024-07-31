import { Route, Routes } from 'react-router-dom';

import { RouteConfig } from '~/components/generic/NavLinks';

export interface AppRoutesProps {
  routes: RouteConfig[];
}

const renderRoute = ({ icon: _i, title: _t, subRoutes, ...props }: RouteConfig): JSX.Element => {
  if (subRoutes && subRoutes.length > 0) {
    return (
      <Route key={props.path} {...props}>
        {subRoutes.map(renderRoute)}
      </Route>
    );
  }
  return (
    <Route key={props.path} {...props} />
  );
};

export const AppRoutes = ({
  routes,
}: AppRoutesProps): JSX.Element => (
  <Routes>
    {routes.map(renderRoute)}
  </Routes>
);