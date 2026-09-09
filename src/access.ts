import type { Access } from 'payload'

/** Anyone logged into the admin. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Public can read published docs; logged-in users can read everything (drafts included). */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Public read for collections without drafts (taxonomies, media). */
export const anyone: Access = () => true

/** Admin-only: create / update / delete restricted to the admin role. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
