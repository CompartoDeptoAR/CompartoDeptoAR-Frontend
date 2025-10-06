export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/',
];

const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

export default isPublicRoute;