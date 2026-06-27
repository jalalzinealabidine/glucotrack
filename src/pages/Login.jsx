import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const navigate = useNavigate();
  const { signIn, user, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      setLoading(true);
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <section className="card">
        <p className="eyebrow">Account</p>
        <h1>Login</h1>
        <p className="muted">
          Login works when Supabase is configured. Without Supabase, the app still works in local browser mode.
        </p>

        {!isSupabaseConfigured && (
          <div className="info-box">
            Supabase is not configured yet. Copy <strong>.env.example</strong> to <strong>.env</strong>, add your keys, then restart Vite.
          </div>
        )}

        {user && <div className="info-box">You are logged in as {user.email}.</div>}
        {message && <div className="error-box">{message}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
          </label>

          <button className="button primary full" type="submit" disabled={!isSupabaseConfigured || loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
