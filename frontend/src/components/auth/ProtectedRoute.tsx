import { Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // const isAuthenticated = !!localStorage.getItem('sdc_token');
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
