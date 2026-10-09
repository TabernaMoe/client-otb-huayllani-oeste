export function getHomeRoute(user) {
  if (!user) return '/login';

  if (user.tipo_usuario === 'SOCIO') {
    return user.debe_cambiar_password
      ? '/socio/cambiar-contrasena'
      : '/socio/inicio';
  }

  if (user.tipo_usuario === 'ADMIN') {
    return '/admin/dashboard';
  }

  return '/login';
}
