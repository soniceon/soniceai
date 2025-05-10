import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { useTranslation } from 'next-i18next';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(t('invalid_email_or_password'));
    } else {
      setMessage(t('login_successful'));
      localStorage.setItem('userEmail', email);
      localStorage.setItem('username', email);
      setTimeout(() => { window.location.reload(); }, 1000);
    }
    setLoading(false);
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetEmail) {
      setResetMsg(t('please_enter_email'));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setResetMsg(error.message || t('reset_failed'));
    } else {
      setResetMsg(t('reset_email_sent'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181c2a]">
      <div className="w-full max-w-md p-8 bg-[#23283b] rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-8">{t('login')}</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder={t('email')}
            className="w-full px-4 py-2 bg-[#23283b] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('password')}
            className="w-full px-4 py-2 bg-[#23283b] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {message && (
            <div className="text-sm text-red-400 text-center">{message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition"
          >
            {loading ? t('logging_in') : t('login')}
          </button>
        </form>
        <div className="flex justify-between mt-4">
          <button
            className="text-purple-400 hover:underline text-sm"
            onClick={() => router.push('/register')}
          >
            {t('dont_have_account')}
          </button>
          <button
            className="text-purple-400 hover:underline text-sm"
            onClick={() => setShowReset(true)}
          >
            {t('forgot_password')}
          </button>
        </div>

        {/* Reset password modal */}
        {showReset && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <form onSubmit={handleResetPassword}>
              <div className="mb-2">
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  placeholder={t('enter_registered_email')}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  {t('send_reset_email')}
                </button>
                <button
                  type="button"
                  className="text-gray-500 ml-2"
                  onClick={() => {
                    setShowReset(false);
                    setResetMsg('');
                  }}
                >
                  {t('cancel')}
                </button>
              </div>
              {resetMsg && (
                <div className={`mt-2 text-sm ${resetMsg.includes(t('reset_email_sent')) ? 'text-green-600' : 'text-red-600'}`}>
                  {resetMsg}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 