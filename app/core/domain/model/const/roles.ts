import type { IUserRole } from '../types/users';

export const ROLES: IUserRole[] = [
    {
        id: '1',
        rank: 1,
        name: 'Владелец',
    },
    {
        id: '2',
        rank: 2,
        name: 'Администратор',
    },
    {
        id: '3',
        rank: 3,
        name: 'Пользователь',
    },
];

export function RoleByID(id: string) {
    return ROLES.find((role) => role.id === id);
}
