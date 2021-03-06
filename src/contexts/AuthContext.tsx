import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { auth, firebase } from "../services/firebase";

type UserType = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: UserType | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProps) {
    const [user, setUser] = useState<UserType>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
            const {displayName, photoURL, uid} = user;

            if (!displayName || !photoURL) {
                toast.error("Informação imcompleta da conta Google.")
            }

            setUser({
                id: uid,
                name: displayName as string,
                avatar: photoURL as string,
            });
            }
        })

        return () => {unsubscribe()}
    }, []);

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);
        if (result.user) {
            const {displayName, photoURL, uid} = result.user;

            if (!displayName || !photoURL) {
            throw new Error("Missing information from Google Account.");
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            });
        }
    }

    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}