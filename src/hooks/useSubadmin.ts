import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

// TypeScript interfaces
interface Subadmin {
    id: number;
    name: string;
    email: string;
}

interface SubadminActivity {
    id: number;
    action: string;
    timestamp: string;
}

interface SubadminPermission {
    id: number;
    name: string;
    granted: boolean;
}

const API_URL = '/api/admin/subadmins';

// Custom Hook for fetching subadmins
export const useSubadmins = () => {
    return useQuery<Subadmin[], Error>('subadmins', async () => {
        const response = await axios.get(API_URL);
        return response.data;
    });
};

// Custom Hook for creating subadmin
export const useCreateSubadmin = () => {
    const queryClient = useQueryClient();
    return useMutation<Subadmin, Error, Partial<Subadmin>>(async (newSubadmin) => {
        const response = await axios.post(API_URL, newSubadmin);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('subadmins');
        }
    });
};

// Custom Hook for updating subadmin
export const useUpdateSubadmin = () => {
    const queryClient = useQueryClient();
    return useMutation<Subadmin, Error, Subadmin>(async (subadmin) => {
        const response = await axios.put(`${API_URL}/${subadmin.id}`, subadmin);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('subadmins');
        }
    });
};

// Custom Hook for deleting subadmin
export const useDeleteSubadmin = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>(async (subadminId) => {
        await axios.delete(`${API_URL}/${subadminId}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('subadmins');
        }
    });
};

// Custom Hook for fetching subadmin activities/audit log
export const useSubadminActivities = (subadminId: number) => {
    return useQuery<SubadminActivity[], Error>(['subadminActivities', subadminId], async () => {
        const response = await axios.get(`${API_URL}/${subadminId}/activities`);
        return response.data;
    });
};

// Custom Hook for fetching available permissions
export const useAvailablePermissions = () => {
    return useQuery<SubadminPermission[], Error>('availablePermissions', async () => {
        const response = await axios.get('/api/admin/permissions');
        return response.data;
    });
};

// Custom Hook for updating permissions
export const useUpdatePermissions = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { subadminId: number; permissions: SubadminPermission[] }>(async ({ subadminId, permissions }) => {
        await axios.put(`${API_URL}/${subadminId}/permissions`, { permissions });
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('subadmins');
            queryClient.invalidateQueries('availablePermissions');
        }
    });
};