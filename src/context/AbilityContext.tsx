import { createContext } from 'react';
import { 
  AppAbility, 
  defineAbility, 
  Actions, 
  Subjects 
} from '@/ability/ability';
import { useAuth } from './userContext';
import { useMemo } from 'react';
import { Ability } from '@casl/ability';
import { UserRole } from '@/types/user'; // تأكد من استيراد UserRole

export const AbilityContext = createContext<AppAbility>(null!);

interface AbilityProviderProps {
  children: React.ReactNode;
}

export const AbilityProvider = ({ children }: AbilityProviderProps) => {
  const { userData } = useAuth();
  
  const ability = useMemo(() => {
    if (!userData) return createEmptyAbility();
    
    // التحقق من صحة الدور
    const isValidRole = Object.values(UserRole).includes(userData.role as UserRole);
    
    if (!isValidRole) {
      console.error('Invalid user role:', userData.role);
      return createEmptyAbility();
    }

    // إنشاء القدرات مع تحويل نوع الدور
    return defineAbility({
      ...userData,
      role: userData.role as UserRole
    });
    
  }, [userData]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

const createEmptyAbility = (): AppAbility => {
  return new Ability<[Actions, Subjects]>([]);
};