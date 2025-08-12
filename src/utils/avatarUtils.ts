import { nanoid } from 'nanoid';

export const AVATAR_STYLES = ['ins', 'dicebear', 'avataaars'] as const;
export type AvatarStyle = typeof AVATAR_STYLES[number];

// dicebear 卡通风格列表
export const DICEBEAR_STYLES = ['avataaars', 'bottts', 'micah', 'adventurer'] as const;
export type DicebearStyle = typeof DICEBEAR_STYLES[number];

// 生成 ins 风格渐变色
export function getAvatarColors(email: string) {
  const gradients = [
    ['#f9ce34', '#ee2a7b', '#6228d7'],
    ['#fd5c63', '#fcb045', '#fd1d1d'],
    ['#4f5bd5', '#962fbf', '#d62976'],
    ['#f58529', '#dd2a7b', '#8134af'],
    ['#43cea2', '#185a9d', '#f7971e'],
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  return gradients[idx];
}

// 扁平色块风格
export function getFlatColor(email: string) {
  const colors = ['#7c4dff', '#00bcd4', '#ff9800', '#4caf50', '#e91e63', '#607d8b'];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// dicebear svg url（支持多风格）
export function getDicebearUrl(seed: string, style: DicebearStyle = 'avataaars') {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

// 随机生成头像种子
export function randomSeed() {
  return nanoid(10);
}

// 新增 ins 风格头像生成函数
export function getInsAvatarSvg(seed: string) {
  // 生成渐变色
  const gradients = [
    ['#f9ce34', '#ee2a7b', '#6228d7'],
    ['#fd5c63', '#fcb045', '#fd1d1d'],
    ['#4f5bd5', '#962fbf', '#d62976'],
    ['#f58529', '#dd2a7b', '#8134af'],
    ['#43cea2', '#185a9d', '#f7971e'],
    ['#00c6ff', '#0072ff', '#f7971e'],
    ['#ff6a00', '#ee0979', '#ff6a00'],
    ['#11998e', '#38ef7d', '#43cea2'],
    ['#fc00ff', '#00dbde', '#43cea2'],
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  const [c1, c2, c3] = gradients[idx];
  // SVG 头像
  return `data:image/svg+xml;utf8,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='g' x1='0' y1='0' x2='80' y2='80' gradientUnits='userSpaceOnUse'><stop stop-color='${c1}'/><stop offset='0.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><circle cx='40' cy='40' r='38' fill='url(%23g)' stroke='white' stroke-width='4'/><text x='50%' y='54%' text-anchor='middle' font-size='36' font-family='Arial' fill='white' dy='.3em'>${seed[0].toUpperCase()}</text></svg>`;
} 