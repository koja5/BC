export class UserModel {
    id?: number;
    sid?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    salutation?: string;
    titleBefore?: string;
    firstname?: string;
    lastname?: string;
    titleAfter?: string;
    type?: number;
    active?: number;
    activeDate?: Date;
    activePremiumDate?: Date;
    image?: string;
    birthday?: Date;
    location?: string;
    street?: string;
    zip?: string;
    organization?: string;
    website?: string;
    phoneNumber?: string;
    mobile1?: string;
    mobile2?: string;
    aboutMe?: string;
    cover?: string;
}