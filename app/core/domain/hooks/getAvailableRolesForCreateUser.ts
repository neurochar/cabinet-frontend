import { ROLES } from '../model/const/roles';
import type { IUserRole } from '../model/types/users';

export function getAvailableRolesForCreateUser(currentRoleID: number): IUserRole[] {
    const currentRole = ROLES.find((role) => role.id === currentRoleID);
    if (!currentRole) {
        return [];
    }

    return ROLES.filter((role) => role.rank > currentRole.rank);
}
