/* ─────────────────────────────────────────────────────────────────────────
   The public first page: what this app is, the Ulabase service it runs on,
   how to connect a coding agent to the Ulabase docs, and how to make the app
   yours. Signed-in users never see it: "/" sends them to the app.
   Replace it with your own first page.
   ───────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@ulabase/kit-react';
import { environment } from '../../environments/environment';
// the steps, the code block and the pitch come from the home, the logo from the frame
import '../home/Home.css';
import '../shell/Shell.css';
import './Welcome.css';

const DOCS_MCP = 'https://d0c5a1.ulabase.app/mcp';

/** How each agent adds the docs MCP server. */
const AGENTS = [
  {
    id: 'claude',
    name: 'Claude Code',
    where: 'In the folder of the app:',
    code: `claude mcp add --transport http ulabase-docs ${DOCS_MCP}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    where: 'In .cursor/mcp.json:',
    code: `{\n  "mcpServers": {\n    "ulabase-docs": { "url": "${DOCS_MCP}" }\n  }\n}`,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    where: 'In .vscode/mcp.json:',
    code: `{\n  "servers": {\n    "ulabase-docs": { "type": "http", "url": "${DOCS_MCP}" }\n  }\n}`,
  },
  {
    id: 'other',
    name: 'Other agents',
    where: 'An MCP server over HTTP, at the address:',
    code: DOCS_MCP,
  },
];

/** The service id is the first label of its address: https://c0ffee.ulabase.app. */
const serviceId = (() => {
  try {
    return new URL(environment.apiUrl).hostname.split('.')[0];
  } catch {
    return '';
  }
})();

type Status = 'checking' | 'answering' | 'not answering';

export default function Welcome() {
  const { isAuthenticated, initializing } = useAuth();
  const [agent, setAgent] = useState(AGENTS[0].id);
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    // the service answers /ping to anyone: a plain way to show the connection is live
    fetch(`${environment.apiUrl}/ping`).then(
      res => setStatus(res.ok ? 'answering' : 'not answering'),
      () => setStatus('not answering'),
    );
  }, []);

  if (initializing) return null;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  const { emailRegistration, oauthLogin } = environment.features;
  const shown = AGENTS.find(a => a.id === agent) ?? AGENTS[0];

  return (
    <div className="welcome">
      <header className="welcome-header">
        <span className="logo">My app</span>
        <nav className="welcome-nav">
          <Link to="/auth/login" className="btn-secondary">Sign in</Link>
          {(emailRegistration || oauthLogin) && <Link to="/auth/signup" className="btn-primary">Sign up</Link>}
        </nav>
      </header>

      <main className="welcome-main">
        <section className="welcome-hero">
          <div className="welcome-intro">
            <p className="eyebrow">Ulabase starter · React</p>
            <h1>A base app, running on your Ulabase service.</h1>
            <p className="hero-pitch">
              Sign-up, login, email verification, password reset, teams and invitations already work.
              The service behind them is yours, on Ulabase.
            </p>
            <div className="welcome-actions">
              {(emailRegistration || oauthLogin) && <Link to="/auth/signup" className="btn-primary">Sign up</Link>}
              <Link to="/auth/login" className="btn-secondary">Sign in</Link>
            </div>
          </div>

          <aside className="connection" aria-label="The Ulabase service of this app">
            <div className="connection-head">
              <span className="eyebrow">Connected to Ulabase</span>
              <span className={`connection-status status-${status.replace(' ', '-')}`}>
                {status === 'checking' ? 'Checking…' : status === 'answering' ? 'Answering' : 'Not answering'}
              </span>
            </div>
            <dl className="connection-facts">
              <dt>Service</dt>
              <dd><code>{serviceId}</code></dd>
              <dt>Address</dt>
              <dd><code>{environment.apiUrl}</code></dd>
              <dt>Set in</dt>
              <dd><code>.env.development</code></dd>
            </dl>
            <p className="connection-note">
              This app has no backend code. Accounts, teams and data are on the service, and the app
              calls its API with the Ulabase Kit.
            </p>
            <a href="https://ulabase.com/orgs" target="_blank" rel="noopener">Open the Ulabase console →</a>
          </aside>
        </section>

        <section className="card">
          <h2>What already works</h2>
          <ul className="welcome-grid">
            <li><strong>Email sign-up</strong><span className="muted">Registration with an email verification link.</span></li>
            <li><strong>Google sign-in</strong><span className="muted">When the service has your Google credentials.</span></li>
            <li><strong>Password reset</strong><span className="muted">Forgot-password email and a reset form.</span></li>
            <li><strong>Teams and invitations</strong><span className="muted">Members, roles, switching team, invitations by email.</span></li>
            <li><strong>Account</strong><span className="muted">Name and password.</span></li>
            <li><strong>Your data</strong><span className="muted">Collections and permissions on the service, called with <code>auth.api()</code>.</span></li>
          </ul>
        </section>

        <section className="card">
          <h2>Connect your coding agent to the Ulabase docs</h2>
          <p className="muted">
            Add the docs MCP server to your agent. The agent reads the Ulabase documentation while it
            changes this app. It needs no account and no key.
          </p>
          <div className="agent-tabs" role="tablist" aria-label="Coding agent">
            {AGENTS.map(a => (
              <button key={a.id} type="button" role="tab" aria-selected={a.id === agent}
                className={a.id === agent ? 'active' : ''} onClick={() => setAgent(a.id)}>
                {a.name}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            <p className="agent-where">{shown.where}</p>
            <pre className="code-block">{shown.code}</pre>
          </div>
        </section>

        <section className="card">
          <h2>Make it yours</h2>
          <ol className="steps">
            <li className="step step-done">
              <span className="step-mark" aria-hidden="true">&#10003;</span>
              <div className="step-body">
                <span className="step-title">Point the app at your Ulabase service</span>
                <p className="muted">Done: <code>ulabase app new</code> wrote the address in <code>.env.development</code>.</p>
              </div>
            </li>
            <li className="step">
              <span className="step-mark" aria-hidden="true">2</span>
              <div className="step-body">
                <span className="step-title">Connect your coding agent to the Ulabase docs</span>
                <p className="muted">The section above.</p>
              </div>
            </li>
            <li className="step">
              <span className="step-mark" aria-hidden="true">3</span>
              <div className="step-body">
                <span className="step-title">Change the look</span>
                <p className="muted">
                  Tweak the tokens in <code>src/styles.css</code>, or remove that skin and use Tailwind,
                  Material or your own, following the map in <code>NOTES.md</code>.
                </p>
              </div>
            </li>
            <li className="step">
              <span className="step-mark" aria-hidden="true">4</span>
              <div className="step-body">
                <span className="step-title">Design your navigation and menu</span>
                <p className="muted">The app frame is in <code>src/pages/shell/</code>: the header has a marked place for your links.</p>
              </div>
            </li>
            <li className="step">
              <span className="step-mark" aria-hidden="true">5</span>
              <div className="step-body">
                <span className="step-title">Replace this page</span>
                <p className="muted">It is <code>src/pages/welcome/</code>: put your app's own first page there.</p>
              </div>
            </li>
            <li className="step">
              <span className="step-mark" aria-hidden="true">6</span>
              <div className="step-body">
                <span className="step-title">Build your first screen</span>
                <p className="muted">Add it under <code>src/pages/</code>, and its route inside the signed-in frame in <code>src/routes.tsx</code>.</p>
              </div>
            </li>
          </ol>
        </section>
      </main>

      <footer className="welcome-footer">
        <span>Built with the Ulabase React starter.</span>
        <span>
          <a href="https://ulabase.com" target="_blank" rel="noopener">ulabase.com</a> ·{' '}
          <a href="https://ulabase.com/docs" target="_blank" rel="noopener">Docs</a> ·{' '}
          <a href="https://ulabase.com/orgs" target="_blank" rel="noopener">Console</a>
        </span>
      </footer>
    </div>
  );
}
