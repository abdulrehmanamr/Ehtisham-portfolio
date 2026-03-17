import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Check if user is admin in 'admins' collection or has admin role in 'users' collection
          // We check by UID and by Email (since we might add admins by email before they first login)
          const [adminDocByUid, adminDocByEmail, userDoc] = await Promise.all([
            getDoc(doc(db, 'admins', user.uid)),
            user.email ? getDoc(doc(db, 'admins', user.email)) : Promise.resolve({ exists: () => false } as any),
            getDoc(doc(db, 'users', user.uid))
          ]);
          
          const isBootstrapAdmin = user.email === 'abdulrehmanamr06@gmail.com' || user.email === 'ehtishamarshad@gmail.com';
          const hasAdminRole = userDoc.exists() && userDoc.data()?.role === 'admin';
          const isAdminInAdmins = adminDocByUid.exists() || (adminDocByEmail && adminDocByEmail.exists());
          
          setIsAdmin(isAdminInAdmins || isBootstrapAdmin || hasAdminRole);
        } catch (error: any) {
          if (error?.message?.includes('permission')) {
            handleFirestoreError(error, OperationType.GET, 'admins/users');
          }
          console.error("Error checking admin status:", error);
          setIsAdmin(user.email === 'abdulrehmanamr06@gmail.com' || user.email === 'ehtishamarshad@gmail.com');
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
