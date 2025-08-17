import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { AvatarStyle, DicebearStyle, getDicebearUrl, getInsAvatarSvg, randomSeed } from '@/utils/avatarUtils';

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<{ email: string; username: string; createdAt?: number } | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile_info');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('avataaars');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [randomAvatars, setRandomAvatars] = useState<{style: AvatarStyle, seed: string}[]>([]);
  const [formattedReviews, setFormattedReviews] = useState<Array<{
    id: string;
    username: string;
    rating: number;
    comment: string;
    toolName: string;
    createdAt: string;
    formattedDate: string;
  }>>([]);

  // 确保只在客户端获取localStorage数据
  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');
    if (email) setName(email);
    if (username) setName(username);
    
    // 设置头像样式和种子
    const savedAvatarStyle = localStorage.getItem('avatarStyle') as AvatarStyle;
    const savedAvatarSeed = localStorage.getItem('avatarSeed');
    if (savedAvatarStyle) setAvatarStyle(savedAvatarStyle);
    if (savedAvatarSeed) setAvatarSeed(savedAvatarSeed);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');
    if (!email) {
      router.replace('/login');
      return;
    }
    fetch('/api/auth/user?email=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(data => {
        setUser({ email, username: username || email, createdAt: data.createdAt });
        setName(data.name || username || email);
      });
    fetch('/api/reviews?userEmail=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(setReviews);
  }, [router, isClient]);

  useEffect(() => {
    if (showAvatarModal && isClient) {
      // 生成9个ins 风格头像
      const arr: {style: AvatarStyle, seed: string}[] = Array.from({ length: 9 }).map((_, i) => {
        const seed = randomSeed();
        return { style: 'ins' as AvatarStyle, seed };
      });
      setRandomAvatars(arr);
    }
  }, [showAvatarModal, isClient]);

  // 格式化评论时间
  useEffect(() => {
    if (reviews.length > 0 && isClient) {
      const formatted = reviews.map(review => ({
        ...review,
        formattedDate: new Date(review.createdAt).toLocaleDateString()
      }));
      setFormattedReviews(formatted);
    }
  }, [reviews, isClient]);

  const handleNameUpdate = async () => {
    setMessage('');
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, name })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(t('profile_name_updated'));
      localStorage.setItem('username', name);
    } else {
      setMessage(data.message || t('profile_update_failed'));
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage('');
    if (!password) return setMessage(t('profile_enter_new_password'));
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(t('profile_password_updated'));
      setPassword('');
    } else {
      setMessage(data.message || t('profile_update_failed'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    router.replace('/login');
  };

  if (!user) return null;
  const avatarChar = (user.username || user.email)[0]?.toUpperCase() || '?';
  const showSeed = avatarSeed || user.email || user.username || 'user';
  let avatarNode = null;
  if (avatarStyle === 'ins') {
    avatarNode = (
      <img
        src={getInsAvatarSvg(showSeed)}
        alt="avatar"
        className="w-16 h-16 rounded-full bg-white shadow-lg"
      />
    );
  } else {
    avatarNode = (
      <img
        src={getDicebearUrl(showSeed, avatarStyle === 'dicebear' ? 'avataaars' : avatarStyle as DicebearStyle)}
        alt="avatar"
        className="w-16 h-16 rounded-full bg-white shadow-lg"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#181825] text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#232136] rounded-2xl shadow-xl border border-purple-900 p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {avatarNode}
            <div>
              <h1 className="text-2xl font-bold text-gray-100 mb-2">{t('profile_title')}</h1>
              <div className="text-gray-400">{user.email}</div>
              <div className="text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</div>
            </div>
            <button className="ml-auto text-xs text-purple-400 hover:underline" onClick={()=>setShowAvatarModal(true)}>
              {t('profile_change_avatar')}
            </button>
          </div>
          
          {showAvatarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-[#232136] rounded-2xl p-6 shadow-xl w-[380px]">
                <div className="font-bold text-lg mb-4 text-center">{t('profile_select_avatar')}</div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {randomAvatars.map((item, idx) => (
                    <button
                      key={item.style + item.seed + idx}
                      className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${avatarStyle === item.style && avatarSeed === item.seed ? 'border-purple-500' : 'border-transparent hover:border-gray-300'}`}
                      onClick={() => {
                        setAvatarStyle(item.style);
                        setAvatarSeed(item.seed);
                        localStorage.setItem('avatarStyle', item.style);
                        localStorage.setItem('avatarSeed', item.seed);
                      }}
                    >
                      <img src={getDicebearUrl(item.seed, item.style as DicebearStyle)} alt="avatar" className="w-14 h-14 rounded-full mb-1 bg-white" />
                    </button>
                  ))}
                </div>
                <button className="w-full mt-2 py-2 bg-purple-600 text-white rounded" onClick={() => setShowAvatarModal(false)}>{t('profile_done')}</button>
              </div>
            </div>
          )}
        </div>

        {/* 标签页导�?*/}
        <div className="bg-[#232136] rounded-2xl shadow-xl border border-purple-900 p-6 mb-6">
          <div className="flex border-b border-gray-700 mb-6">
            {[
              { key: 'profile_info', label: 'profile_info' },
              { key: 'reviews', label: 'my_reviews' },
              { key: 'settings', label: 'settings' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          {/* 个人信息标签页 */}
          {activeTab === 'profile_info' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span>{t('profile_name')}</span>
                <input value={name} onChange={e => setName(e.target.value)} className="border rounded px-2 py-1 dark:bg-[#181825] dark:text-white" />
                <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handleNameUpdate}>{t('profile_update_name')}</button>
              </div>
              
              <div className="flex items-center gap-4">
                <span>{t('profile_new_password')}</span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="border rounded px-2 py-1 dark:bg-[#181825] dark:text-white" 
                />
                <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handlePasswordUpdate}>{t('profile_update_password')}</button>
              </div>

              {message && (
                <div className={`p-3 rounded ${message.includes('失败') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}
            </div>
          )}

          {/* 我的评论标签页 */}
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('my_reviews')}</h3>
              {formattedReviews.length === 0 ? (
                <div className="text-gray-400 text-center py-8">{t('no_reviews')}</div>
              ) : (
                <div className="space-y-4">
                  {formattedReviews.map((review, index) => (
                    <div key={index} className="bg-[#181825] rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                        <span className="text-gray-400 text-sm">{review.toolName}</span>
                        <span className="text-gray-500 text-xs ml-auto">{review.formattedDate}</span>
                      </div>
                      <div className="text-gray-300">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 设置标签页 */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t('profile_change_avatar')}</span>
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={() => setShowAvatarModal(true)}
                >
                  {t('profile_select_avatar')}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span>{t('logout')}</span>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleLogout}
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 
