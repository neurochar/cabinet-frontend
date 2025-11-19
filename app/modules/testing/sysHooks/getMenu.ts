import type { IMenu } from '~/core/domain/model/types/menu';
import { module } from '../const';

export function getMenu(): IMenu[] {
    return [
        {
            name: module.title,
            icon: module.icon,
            menuSel: module.urlName,
            defaultOpen: true,
            kids: [
                {
                    name: 'Профили',
                    to: `/${module.urlName}/profiles`,
                    subMenuSel: 'profiles',
                },
                {
                    name: 'Комнаты',
                    to: `/${module.urlName}/rooms`,
                    subMenuSel: 'rooms',
                },
            ],
        },
    ];
}
