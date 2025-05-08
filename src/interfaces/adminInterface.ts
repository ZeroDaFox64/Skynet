/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AdminRegisterFormInterface {
  email: string;
  username: string;
  name: string;
  lastname: string;
  phone: string;
}

export interface AdminAccountFormInterface {
  email: string;
  password: string;
  service: string;
  contract_date: string;
  cutoff_date: string;
  type: string;
  status: string;
  maintenance: string;
  observations: string;
}

export interface AdminServiceFormInterface {
  name: string;
  description: string;
  category: string;
}

export interface AdminProviderFormInterface {
  name: string;
  contact: string;
  description: string;
}

export interface AdminSubscriptionFormInterface {
  user: string;
  account: string;
  nickname: string;
  status: string;
  pay_status: string;
  contract_date: string;
  cutoff_date: string;
  type: string;
  service: string;
  observations: string;
}

export interface AdminProductFormInterface {
  name: string;
  description: string;
  category: string;
  features: any;
  front_image: any;
  images: any;
  price: number;
  discount: number;
  genre: string;
  product_category: string;
}

export interface AdminProductCategoryFormInterface {
  name: string;
  description: string;
}

