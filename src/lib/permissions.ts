import {UserSelect} from '@/features/auth/user-types'
import {UserRole} from '@/server/db/schema/schema-constants'
import type {User} from 'next-auth'
// import type {IncidentSelect} from '@/features/incident/incident-types'
// import {type AssetSelect} from '@/features/assets/asset-types'

export type Permissions = {
  users: {
    dataType: Partial<UserSelect>
    action: 'edit' | 'view' | 'delete' | 'block'
  }
  // incidents: {
  //   dataType: Partial<IncidentSelect>
  //   action: 'edit' | 'view' | 'delete' | 'archive'
  // }
  // assets: {
  //   dataType: Partial<AssetSelect>
  //   action: 'delete' | 'edit'
  // }
}

export type PermissionType = keyof Permissions

type PermissionCheck<Key extends PermissionType> =
  | boolean
  | ((user: User, data: Permissions[Key]['dataType']) => boolean)

type RolesWithPermissions = Record<
  UserRole,
  Partial<{
    [Key in keyof Permissions]: Partial<Record<Permissions[Key]['action'], PermissionCheck<Key>>>
  }>
>

const ROLES: RolesWithPermissions = {
  owner: {
    users: {
      view: true,
      edit: true,
      delete: true,
      block: true,
    },
    // incidents: {
    //   view: true,
    //   edit: true,
    //   delete: true,
    //   archive: true,
    // },
    // assets: {
    //   delete: true,
    //   edit: true,
    // },
  },
  admin: {
    users: {
      view: true,
      edit: true,
      block: true,
    },
    // incidents: {
    //   view: true,
    //   edit: true,
    //   delete: true,
    //   archive: true,
    // },
    // assets: {
    //   delete: true,
    //   edit: true,
    // },
  },
  investigator: {
    users: {
      view: true,
      block: true,
    },
    // incidents: {
    //   view: true,
    //   edit: true,
    //   delete: true,
    //   archive: true,
    // },
    // assets: {
    //   delete: true,
    //   edit: true,
    // },
  },
  staff: {
    users: {
      view: true,
    },
    // incidents: {
    //   view: true,
    // },
  },
  paid: {
    users: {
      edit: (user, data) => user.id === data.id,
      view: (user, data) => user.id === data.id,
      delete: (user, data) => user.id === data.id,
    },
    // incidents: {
    //   view: (user, data) => user.id === data.reporterId,
    // },
  },
  user: {
    users: {
      edit: (user, data) => user.id === data.id,
      view: (user, data) => user.id === data.id,
      delete: (user, data) => user.id === data.id,
    },
    // incidents: {
    //   view: (user, data) => user.id === data.reporterId,
    // },
    // assets: {
    //   delete: (user, data) => user.id === data.createdByUserId,
    //   edit: (user, data) => user.id === data.createdByUserId,
    // },
  },
  blocked: {},
}

export const hasPermission = <Resource extends PermissionType>(
  user: User | undefined,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) => {
  if (!user) return false
  return user.roles.some((role) => {
    const permission = ROLES[role][resource]?.[action]
    if (typeof permission === 'function') return !!data && permission(user, data)
    return !!permission
  })
}

export const hasRole = (user: User | undefined, role: UserRole | UserRole[], exactMatch = false) => {
  if (!user) return false
  if (exactMatch) return (Array.isArray(role) ? role : [role]).sort().toString() === user.roles.sort().toString()
  return (Array.isArray(role) ? role : [role]).some((r) => user.roles.includes(r))
}
