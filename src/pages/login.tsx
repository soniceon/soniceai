import { useState } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';

const labels = {
  title: { zh: '登录', en: 'Login', ja: 'ログイン', ko: '로그인', de: 'Anmelden', fr: 'Connexion', es: 'Iniciar sesión', ru: 'Войти' },
  email: { zh: '邮箱', en: 'Email', ja: 'メール', ko: '이메일', de: 'E-Mail', fr: 'E-mail', es: 'Correo', ru: 'Почта' },
  password: { zh: '密码', en: 'Password', ja: 'パスワード', ko: '비밀번호', de: 'Passwort', fr: 'Mot de passe', es: 'Contraseña', ru: 'Пароль' },
  login: { zh: '登录', en: 'Login', ja: 'ログイン', ko: '로그인', de: 'Anmelden', fr: 'Connexion', es: 'Iniciar sesión', ru: 'Войти' },
  toRegister: { zh: '没有账号？注册', en: "Don't have an account? Register", ja: 'アカウントがありませんか？登録', ko: '계정이 없으신가요? 회원가입', de: 'Noch kein Konto? Registrieren', fr: 'Pas de compte ? Inscription', es: '¿No tienes cuenta? Regístrate', ru: 'Нет аккаунта? Зарегистрироваться' },
  errorEmpty: { zh: '请输入邮箱和密码', en: 'Please enter email and password', ja: 'メールとパスワードを入力してください', ko: '이메일과 비밀번호를 입력하세요', de: 'Bitte E-Mail und Passwort eingeben', fr: 'Veuillez entrer e-mail et mot de passe', es: 'Por favor, introduce correo y contraseña', ru: 'Введите почту и пароль' }
};

type LangKey = keyof typeof labels.title;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [pendingToken, setPendingToken] = useState('');
  const router = useRouter();
  const { lang } = useLanguage();
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as LangKey;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowResend(false);
    setPendingToken('');
    if (!email || !password) {
      setError(labels.errorEmpty[langKey] || '');
      return;
    }
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || '登录失败');
      if (data.message === 'Email not verified' && data.token) {
        setShowResend(true);
        setPendingToken(data.token);
      }
      return;
    }
    localStorage.setItem('userEmail', email);
    localStorage.setItem('username', data.nickname || email);
    router.push('/');
  };

  const handleResend = async () => {
    if (!email || !pendingToken) return;
    const res = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: pendingToken })
    });
    if (res.ok) {
      alert('验证邮件已重新发送，请查收邮箱');
    } else {
      alert('重发失败，请稍后再试');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">{labels.title[langKey]}</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={labels.email[langKey]}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-2 border rounded text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
          <input
            type="password"
            placeholder={labels.password[langKey]}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-2 border rounded text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {showResend && (
            <button
              type="button"
              className="text-blue-600 underline mt-2"
              onClick={handleResend}
            >
              重新发送验证邮件
            </button>
          )}
          <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">{labels.login[langKey]}</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/register" className="text-purple-600 hover:underline">{labels.toRegister[langKey]}</a>
        </div>
      </div>
    </div>
  );
} 