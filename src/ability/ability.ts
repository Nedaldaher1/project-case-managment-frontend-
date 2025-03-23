import { Ability, AbilityBuilder, createMongoAbility } from '@casl/ability';
import { FrontendUser, UserRole } from '../types/user';

// تعريف الإجراءات والموضوعات
export type Actions = 
  | 'manage' 
  | 'view' 
  | 'renew' 
  | 'archive' 
  | 'update' 
  | 'delete' 
  | 'create';

export type Subjects = 
  | 'AjaPartialSystem' 
  | 'CaseSystem'  
  | 'ElectronicArchive' 
  | 'all';

// إنشاء نوع AppAbility باستخدام Ability مع تحديد الأنواع الدقيقة
export type AppAbility = Ability<[Actions, Subjects]>;

export const defineAbility = (user: FrontendUser): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!user) {
    throw new Error('User is null');
  }

  switch(user.role) {
    case UserRole.ADMIN:
      can('manage', 'all');
      break;
    case UserRole.PROSECUTION_HEAD:
        can('view', 'AjaPartialSystem');
        can('update', 'AjaPartialSystem');
        can('delete', 'AjaPartialSystem');
        can('create', 'AjaPartialSystem');      
      break;
    case UserRole.DEPUTY_PROSECUTOR:
        can('view', 'CaseSystem');
        can('update', 'CaseSystem');
        can('delete', 'CaseSystem');
        can('create', 'CaseSystem');

      break;
    case UserRole.ARCHIVAL_CLERK:
        can('view', 'ElectronicArchive');
        can('update', 'ElectronicArchive');
        can('delete', 'ElectronicArchive');
        can('create', 'ElectronicArchive');
        break;
  }

  return build();
};