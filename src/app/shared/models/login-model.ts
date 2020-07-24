export class LoginModel {    
    username: string;
    password: string;
}

export class VerifyUserModel {    
    email: string;
    code: string;
    password: string;
}

export class ChangePasswordModel {    
    email: string;
    code: string;
    password: string;
    newPassword: string;
}
