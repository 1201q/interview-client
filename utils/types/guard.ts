import { RoleType, UserRoleType } from './types';

export const isRoleType = (value: any): value is RoleType => {
  return (
    value === 'fe' || value === 'be' || value === 'android' || value === 'ios'
  );
};

export const isUserRoleType = (value: any): value is UserRoleType => {
  return value === 'user' || value === 'ai' || value === 'bookmark';
};
