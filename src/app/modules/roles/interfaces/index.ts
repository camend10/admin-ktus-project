export interface ResponseRoles {
    total: number;
    roles: Roles[];
}

export interface ResponseGestionRoles {
    message: number;
    message_text: string,
    role: RoleGestion;
}

export interface Roles {
    id: number;
    name: string;
    guard_name: GuardName;
    created_at: Date;
    updated_at: Date;
    permission_pluck: string[];
    created_format_at: string;
    permissions: Permission[];
}

export interface RoleGestion {
    permission_pluck: string[];
    created_format_at: string;
    id: number;
    name: string;
    permissions: Permission[];
}


enum GuardName {
    API = "api",
}

interface Permission {
    id: number;
    name: string;
    guard_name: GuardName;
    created_at: null;
    updated_at: null;
    pivot: Pivot;
}

interface Pivot {
    role_id: string;
    permission_id: string;
}