// Type definitions for Subadmin, SubadminPermission, SubadminActivity, and PermissionMatrix

export type Subadmin = {
    id: string;
    name: string;
    email: string;
    permissions: SubadminPermission[];
};

export type SubadminPermission = {
    action: string;
    resource: string;
};

export type SubadminActivity = {
    timestamp: Date;
    action: string;
    subadminId: string;
};

export type PermissionMatrix = {
    [key: string]: SubadminPermission[];
};
