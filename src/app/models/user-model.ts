export class UserModel {
    id?: number;
    sid?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstname?: string;
    lastname?: string;
    type?: number;
    active?: number;
    image?: string;
    birthday?: Date;
    location?: string;
    organization?: string;
    website?: string;
    phoneNumber?: string;
    aboutMe?: string;
}