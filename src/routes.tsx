import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AuthGuard, PublicGuard } from '@ulabase/kit-react';
import { environment } from './environments/environment';

const Login = lazy(() => import('./pages/auth/login/Login'));
const Signup = lazy(() => import('./pages/auth/signup/Signup'));
const Verify = lazy(() => import('./pages/auth/verify/Verify'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/reset-password/ResetPassword'));
const Accept = lazy(() => import('./pages/invitations/accept/Accept'));
const Shell = lazy(() => import('./pages/shell/Shell'));
const Home = lazy(() => import('./pages/home/Home'));
const Welcome = lazy(() => import('./pages/welcome/Welcome'));
const Teams = lazy(() => import('./pages/teams/Teams'));
const NewTeam = lazy(() => import('./pages/teams/new/NewTeam'));
const TeamDetail = lazy(() => import('./pages/teams/detail/TeamDetail'));
const Account = lazy(() => import('./pages/account/Account'));

const { emailRegistration, passwordReset, oauthLogin, teamInvitations } = environment.features;

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const routes: RouteObject[] = [
  {
    path: 'auth/login',
    element: (
      <SuspenseWrapper>
        <PublicGuard>
          <Login />
        </PublicGuard>
      </SuspenseWrapper>
    ),
  },
  ...(emailRegistration || oauthLogin
    ? [
        {
          path: 'auth/signup',
          element: (
            <SuspenseWrapper>
              <PublicGuard>
                <Signup />
              </PublicGuard>
            </SuspenseWrapper>
          ),
        },
      ]
    : []),
  ...(emailRegistration
    ? [
        {
          path: 'auth/verify',
          element: (
            <SuspenseWrapper>
              <PublicGuard>
                <Verify />
              </PublicGuard>
            </SuspenseWrapper>
          ),
        },
      ]
    : []),
  ...(passwordReset
    ? [
        {
          path: 'auth/forgot-password',
          element: (
            <SuspenseWrapper>
              <PublicGuard>
                <ForgotPassword />
              </PublicGuard>
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth/reset-password',
          element: (
            <SuspenseWrapper>
              <PublicGuard>
                <ResetPassword />
              </PublicGuard>
            </SuspenseWrapper>
          ),
        },
      ]
    : []),
  ...(teamInvitations
    ? // One page, two paths: the service's invitation email links a new user
      // to /auth/activate and an existing one to /invitations/accept. No guard
      // on either: the invitee may be signed out or have no account yet.
      ['auth/activate', 'invitations/accept'].map(path => ({
        path,
        element: (
          <SuspenseWrapper>
            <Accept />
          </SuspenseWrapper>
        ),
      }))
    : []),
  // The public first page: what the app is and the service it runs on. A signed-in user who
  // lands here goes on to /home.
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <Welcome />
      </SuspenseWrapper>
    ),
  },
  // The app, inside the signed-in frame. No path of its own: its pages keep theirs.
  {
    element: (
      <SuspenseWrapper>
        <AuthGuard>
          <Shell />
        </AuthGuard>
      </SuspenseWrapper>
    ),
    children: [
      { path: 'home', element: <Home /> },
      { path: 'teams', element: <Teams /> },
      { path: 'teams/new', element: <NewTeam /> },
      { path: 'teams/:id', element: <TeamDetail /> },
      { path: 'account', element: <Account /> },
    ],
  },
  { path: '*', element: <Welcome /> },
];
