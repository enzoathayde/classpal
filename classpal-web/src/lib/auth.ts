import Cookies from 'js-cookie'

export const ACCESS_COOKIE = 'classpal_access'

export function getAccessUuid(): string | undefined {
  return Cookies.get(ACCESS_COOKIE)
}

export function setAccessUuid(uuid: string): void {
  Cookies.set(ACCESS_COOKIE, uuid, {
    path: '/',
    sameSite: 'Lax',
    expires: 365,
  })
}

export function clearAccessUuid(): void {
  Cookies.remove(ACCESS_COOKIE, { path: '/' })
}
