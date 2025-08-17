// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 通用查询参数
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// 错误响应类型
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// 成功响应类型
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
}

// 过滤参数
export interface FilterParams {
  [key: string]: string | number | boolean | string[];
}

// 组合查询参数
export interface CombinedQueryParams extends Omit<QueryParams, 'sort' | 'search'> {
  filters?: FilterParams;
  search?: SearchParams;
  sort?: SortParams;
} 
