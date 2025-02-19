export const AssetTypes = ['image', 'video', 'website', 'social-media', 'email', 'profile', 'app', 'other'] as const
export type AssetType = (typeof AssetTypes)[number]

// TODO should incident types be an enum or a table?
// export const OffenseTypes = [
//   'politicalOpinion',
//   'misinformation',
//   'conspiracyTheory',
//   'disinformation',
//   'hateSpeech',
//   'threats',
//   'actsCommitted',
// ] as const
// export type OffenseType = (typeof OffenseTypes)[number]

// export const IncidentTypes = ['online', 'offline'] as const
// export type IncidentType = (typeof IncidentTypes)[number]

// export const IncidentStatuses = [
//   'new',
//   'in-review',
//   'closed',
//   'accepted',
//   'rejected',
//   'project-open',
//   'project-closed',
// ] as const
// export type IncidentStatus = (typeof IncidentStatuses)[number]

// export const IncidentSeverities = ['low', 'medium', 'high', 'critical'] as const
// export type IncidentSeverity = (typeof IncidentSeverities)[number]

// export const IncidentReporterOfflineRoles = ['witness', 'target', 'family/friend', 'other'] as const
// export type IncidentReporterOfflineRole = (typeof IncidentReporterOfflineRoles)[number]

// export const IncidentReporterOnlineRoles = ['witness', 'target'] as const
// export type IncidentReporterOnlineRole = (typeof IncidentReporterOnlineRoles)[number]

// export const IncidentSubjectRoles = ['perpetrator', 'victim'] as const
// export type IncidentSubjectRole = (typeof IncidentSubjectRoles)[number]

// export const OffenseLevels = ['spam', 'none', '0', '1', '2', '3', '4', '5', '6'] as const
// export type OffenseLevel = (typeof OffenseLevels)[number]

// export const OffenderOrgTypes = ['employer', 'offender', 'school', 'affiliate'] as const
// export type OffenderOrgType = (typeof OffenderOrgTypes)[number]

// export const OffenderTypes = [
//   'individual',
//   'social-media-account',
//   'influencer',
//   'organization', // Remove from v1 of form
//   'religious-leader',
//   'government-official',
//   'political-figure',
//   'entertainer-performer',
// ] as const
// export type OffenderType = (typeof OffenderTypes)[number]

export const UserLanguages = ['en', 'fr'] as const
export type UserLanguage = (typeof UserLanguages)[number]

export const UserRoles = ['admin', 'owner', 'user', 'investigator', 'staff', 'paid', 'blocked'] as const
export type UserRole = (typeof UserRoles)[number]
