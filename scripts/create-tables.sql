-- 删除现有表（如果存在）
DROP TABLE IF EXISTS ai_tool_categories CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS ai_tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    verification_token_expires TIMESTAMPTZ,
    token TEXT,
    token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 ai_tools 表
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID PRIMARY KEY,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    type TEXT NOT NULL,
    icon TEXT,
    rating DECIMAL(3,1),
    users TEXT,
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建 reviews 表
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY,
    tool_id UUID REFERENCES ai_tools(id),
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    name JSONB NOT NULL,
    type TEXT UNIQUE,
    icon TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建 ai_tool_categories 关联表
CREATE TABLE IF NOT EXISTS ai_tool_categories (
    tool_id UUID REFERENCES ai_tools(id),
    category_id UUID REFERENCES categories(id),
    PRIMARY KEY (tool_id, category_id)
); 