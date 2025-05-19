export const handleError = (error: any) => {
  console.error(error);
  alert(error.response?.data?.message || '操作失败，请重试');
}; 