import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Register() {
  const navigate = useNavigate();
  const { signUp, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      setMessage('Account created. Check your email if Supabase asks for confirmation, then login.');
      setTimeout(() => navigate('/login'), 1200);
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
        <h1>Create account</h1>
        <p className="muted">Register to store your data in Supabase instead of only this browser.</p>

        {!isSupabaseConfigured && (
          <div className="info-box">
            Supabase is not configured yet. The register form is disabled until you add your environment keys.
          </div>
        )}

        {message && <div className={message.includes('created') ? 'info-box' : 'error-box'}>{message}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
          </label>

          <label>
            Confirm password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>

          <button className="button primary full" type="submit" disabled={!isSupabaseConfigured || loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
