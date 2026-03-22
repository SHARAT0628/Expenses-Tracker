import { createBrowserRouter } from 'react-router';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import CategoryManagementScreen from './screens/CategoryManagementScreen';
import ReportsScreen from './screens/ReportsScreen';
import BudgetScreen from './screens/BudgetScreen';
import BudgetSettingsScreen from './screens/BudgetSettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginScreen,
  },
  {
    path: '/signup',
    Component: SignUpScreen,
  },
  {
    path: '/dashboard',
    Component: DashboardScreen,
  },
  {
    path: '/add',
    Component: AddTransactionScreen,
  },
  {
    path: '/categories',
    Component: CategoryManagementScreen,
  },
  {
    path: '/reports',
    Component: ReportsScreen,
  },
  {
    path: '/budget',
    Component: BudgetScreen,
  },
  {
    path: '/budget-settings',
    Component: BudgetSettingsScreen,
  },
  {
    path: '/profile',
    Component: ProfileScreen,
  },
  {
    path: '/settings',
    Component: SettingsScreen,
  },
]);
