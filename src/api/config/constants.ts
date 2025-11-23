export const PUBLIC_ROUTES = [
  '/auth',
 
];

const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

export default isPublicRoute;