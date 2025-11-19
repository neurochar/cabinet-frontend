import type { IFile } from '~/shared/types/files';

export enum IEquipmentItemType {
    'internet_pon' = 1,
    'internet_wifi' = 2,
    'internet_extra' = 3,
    'smart_tv' = 4,
    'vision_parking' = 5,
    'vision_home' = 6,
    'intercome' = 7,
}

export const IEquipmentItemTypeConfig: Record<IEquipmentItemType, { label: string }> = {
    [IEquipmentItemType.internet_pon]: { label: 'PON-модем' },
    [IEquipmentItemType.internet_wifi]: { label: 'Wi-Fi-роутер' },
    [IEquipmentItemType.internet_extra]: { label: 'Дополнительно для интернета' },
    [IEquipmentItemType.smart_tv]: { label: 'Смарт-ТВ' },
    [IEquipmentItemType.vision_parking]: { label: 'Видеонаблюдение на парковке' },
    [IEquipmentItemType.vision_home]: { label: 'Видеонаблюдение в доме' },
    [IEquipmentItemType.intercome]: { label: 'Домофония' },
};

export interface IEquipmentItem {
    _version?: number;

    id: number;
    type: IEquipmentItemType;
    isPublished: boolean;
    title: string;
    description: any;
    imageFile: IFile | null;
    price: number;
    monthPrice: number;
    installPrice: number;
    connectionTypeLinks: {
        connectionType: {
            id: number;
            title: string;
        };
        price: number | null;
        monthPrice: number | null;
        installPrice: number | null;
    }[];
}

export type IEquipmentListItem = Omit<IEquipmentItem, 'connectionTypeLinks'>;

export interface IEquipmentItemStateLink {
    connectionTypeID: number;
    price: number | null;
    monthPrice: number | null;
    installPrice: number | null;
}

export interface IEquipmentItemState {
    type: IEquipmentItemType;
    isPublished: boolean;
    title: string;
    description: any;
    imageFileID: string | null;
    price: number;
    monthPrice: number;
    installPrice: number;
    connectionTypeLinks: IEquipmentItemStateLink[];
}
