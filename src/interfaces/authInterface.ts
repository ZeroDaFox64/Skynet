export interface LoginFormInterface {
    email: string;
    password: string;
  }
  
  export interface ForgotPasswordInterface {
    email: string;
  }
  
  export interface ResetPasswordInterface {
    password: string;
    confirm_password: string;
  }

  export interface ChangePasswordInterface {
    password: string;
    new_password: string;
  }
  
  export interface RegisterFormInterface {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
  }
  