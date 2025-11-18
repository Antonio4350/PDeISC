import { AuthProvider } from '../hooks/useAuth';
import AppNavigator from './navigation/AppNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
