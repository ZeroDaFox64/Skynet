export interface UserInterface {
    username: string;
    email: string;
    password: string;
    rol: string;
    name?: string;
    lastname?: string;
    phone?: string;
    shipping_address?: object;
    shipping_service?: object;
}

export interface UserStoreInterface {
    id: string;
    avatar: string;
    username: string;
    email: string;
    rol: string;
    name?: string;
    lastname?: string;
    phone?: string;
    shipping_address?: object;
    shipping_service?: object;
}

export interface ChangeUsernameInterface {
    username: string;
  }