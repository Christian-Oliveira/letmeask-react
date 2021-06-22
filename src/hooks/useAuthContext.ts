import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';

export function useAuthContext() {
    return useContext(AuthContext);
}