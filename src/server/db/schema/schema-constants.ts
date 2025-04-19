export const AssetTypes = ['image', 'video', 'website', 'social-media', 'email', 'profile', 'app', 'other'] as const
export type AssetType = (typeof AssetTypes)[number]

export const UserLanguages = ['en', 'fr'] as const
export type UserLanguage = (typeof UserLanguages)[number]

export const UserRoles = ['admin', 'owner', 'user', 'investigator', 'staff', 'paid', 'blocked'] as const
export type UserRole = (typeof UserRoles)[number]
