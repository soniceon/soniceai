import { useState } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';

const labels = {
  title: { zh: '注册', en: 'Register', ja: '登録', ko: '회원가입', de: 'Registrieren', fr: 'Inscription', es: 'Registrarse', ru: 'Регистрация' },
  email: { zh: '邮箱', en: 'Email', ja: 'メール', ko: '이메일', de: 'E-Mail', fr: 'E-mail', es: 'Correo', ru: 'Почта' },
  password: { zh: '密码', en: 'Password', ja: 'パスワード', ko: '비밀번호', de: 'Passwort', fr: 'Mot de passe', es: 'Contraseña', ru: 'Пароль' },
  confirmPassword: { zh: '确认密码', en: 'Confirm Password', ja: 'パスワード確認', ko: '비밀번호 확인', de: 'Passwort bestätigen', fr: 'Confirmer le mot de passe', es: 'Confirmar contraseña', ru: 'Подтвердите пароль' },
  register: { zh: '注册', en: 'Register', ja: '登録', ko: '회원가입', de: 'Registrieren', fr: 'Inscription', es: 'Registrarse', ru: 'Регистрация' },
  toLogin: { zh: '已有账号？登录', en: 'Already have an account? Login', ja: 'すでにアカウントをお持ちですか？ログイン', ko: '이미 계정이 있으신가요? 로그인', de: 'Schon ein Konto? Anmelden', fr: 'Déjà un compte ? Connexion', es: '¿Ya tienes cuenta? Inicia sesión', ru: 'Уже есть аккаунт? Войти' },
  errorEmpty: { zh: '请填写所有字段', en: 'Please fill all fields', ja: 'すべての項目を入力してください', ko: '모든 항목을 입력하세요', de: 'Bitte alle Felder ausfüllen', fr: 'Veuillez remplir tous les champs', es: 'Por favor, rellena todos los campos', ru: 'Пожалуйста, заполните все поля' },
  errorMismatch: { zh: '两次输入的密码不一致', en: 'Passwords do not match', ja: 'パスワードが一致しません', ko: '비밀번호가 일치하지 않습니다', de: 'Passwörter stimmen nicht überein', fr: 'Les mots de passe ne correspondent pas', es: 'Las contraseñas no coinciden', ru: 'Пароли не совпадают' }
};

type LangKey = keyof typeof labels.title;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { lang } = useLanguage();
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as LangKey;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError(labels.errorEmpty[langKey] || '');
      return;
    }
    if (password !== confirmPassword) {
      setError(labels.errorMismatch[langKey] || '');
      return;
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || '注册失败');
      return;
    }
    alert('注册成功，请前往邮箱完成验证');
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">{labels.title[langKey]}</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
          <input
            type="password"
            placeholder={labels.confirmPassword[langKey]}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="p-2 border rounded text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">{labels.register[langKey]}</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-purple-600 hover:underline">{labels.toLogin[langKey]}</a>
        </div>
      </div>
    </div>
  );
} 