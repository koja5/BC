export interface UserConfiguration {
    _id: Id;
    user_id: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    language: string;
    theme: string;
    selectedStore?: (SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId)[] | null;
    usersFor?: (UsersForEntity)[] | null;
    storeSettings?: (StoreSettingsEntity)[] | null;
}
export interface Id {
    $oid: string;
}
export interface SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId {
    $numberInt: string;
}
export interface UsersForEntity {
    key: string;
    value?: (ValueEntity)[] | null;
}
export interface ValueEntity {
    id: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    password: string;
    firstname: string;
    lastname: string;
    shortname: string;
    street: string;
    zipcode: string;
    place: string;
    email: string;
    telephone: string;
    mobile: string;
    birthday: string;
    incompanysince: string;
    type: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    storeId: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    superadmin: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    active: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    img: Img;
    alias_name?: null;
    allowed_online?: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId1 | null;
}
export interface Img {
    type: string;
    data?: (null)[] | null;
}
export interface SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId1 {
    $numberInt: string;
}
export interface StoreSettingsEntity {
    id: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId;
    dayStart: string;
    dayEnd?: string | null;
    timeDuration?: SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId2 | null;
}
export interface SelectedStoreEntityOrIdOrTypeOrStoreIdOrSuperadminOrActiveOrAllowedOnlineOrTimeDurationOrUserId2 {
    $numberInt: string;
}
