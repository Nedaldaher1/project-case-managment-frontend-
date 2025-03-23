// src/types/user.ts
export enum UserRole {
    ADMIN = 'admin',
    PROSECUTION_HEAD = 'prosecution_head',
    DEPUTY_PROSECUTOR = 'deputy_prosecutor',
    ARCHIVAL_CLERK = 'archival_clerk'
  }
  
  export interface FrontendUser {
    id: string;
    role: UserRole;
    username: string;
  }