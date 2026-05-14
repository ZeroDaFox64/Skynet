/* eslint-disable @typescript-eslint/no-explicit-any */
// Usuario
import { userTableConfig, userFormConfig } from "./user.config";
import { userRule } from "./rules/user.rule";
// Cuenta
import { accountTableConfig, accountFormConfig } from "./account.config";
import { accountRule } from "./rules/account.rule";
// Servicio
import { serviceTableConfig, serviceFormConfig } from "./service.config";
import { serviceRule } from "./rules/service.rule";
// Proveedor
import { providerTableConfig, providerFormConfig } from "./provider.config";
import { providerRule } from "./rules/provider.rule";
// Suscripcion
import { subscriptionTableConfig, subscriptionFormConfig } from "./subscription.config";
import { subscriptionRule } from "./rules/subscription.rule";
// Producto
import { productTableConfig, productFormConfig } from "./product.config";
import { productRule } from "./rules/product.rule";
// Categoría de producto
import { productCategoryTableConfig, productCategoryFormConfig } from "./productCategory.config";
import { productCategoryRule } from "./rules/productCategory.rule";
// Empresa
import { companyTableConfig, companyFormConfig } from "./company.config";
import { companyRule } from "./rules/company.rule";
// Interfaces
import {
  AdminRegisterFormInterface,
  AdminAccountFormInterface,
  AdminServiceFormInterface,
  AdminProviderFormInterface,
  AdminSubscriptionFormInterface,
  AdminProductFormInterface,
  AdminProductCategoryFormInterface,
  AdminCompanyFormInterface,
} from "../../../interfaces/adminInterface";

type EntityConfig<T> = {
  endpoint: string;
  singleKey: string;
  allKey: string;
  table: any;
  form: any;
  formSchema: any;
  formInterface?: T;
};

type Config = {
  user: EntityConfig<AdminRegisterFormInterface>;
  account: EntityConfig<AdminAccountFormInterface>;
  service: EntityConfig<AdminServiceFormInterface>;
  provider: EntityConfig<AdminProviderFormInterface>;
  subscription: EntityConfig<AdminSubscriptionFormInterface>;
  product: EntityConfig<AdminProductFormInterface>;
  productCategory: EntityConfig<AdminProductCategoryFormInterface>;
  company: EntityConfig<AdminCompanyFormInterface>;
};

export const config: Config = {
  user: {
    endpoint: "/user",
    singleKey: "user",
    allKey: "users",
    table: userTableConfig,
    form: userFormConfig,
    formSchema: userRule,
  },
  account: {
    endpoint: "/account",
    singleKey: "account",
    allKey: "accounts",
    table: accountTableConfig,
    form: accountFormConfig,
    formSchema: accountRule,
  },
  service: {
    endpoint: "/service",
    singleKey: "service",
    allKey: "services",
    table: serviceTableConfig,
    form: serviceFormConfig,
    formSchema: serviceRule,
  },
  provider: {
    endpoint: "/provider",
    singleKey: "provider",
    allKey: "providers",
    table: providerTableConfig,
    form: providerFormConfig,
    formSchema: providerRule,
  },
  subscription: {
    endpoint: "/subscription",
    singleKey: "subscription",
    allKey: "subscriptions",
    table: subscriptionTableConfig,
    form: subscriptionFormConfig,
    formSchema: subscriptionRule,
  },
  product: {
    endpoint: "/product",
    singleKey: "product",
    allKey: "products",
    table: productTableConfig,
    form: productFormConfig,
    formSchema: productRule,
  },
  productCategory: {
    endpoint: "/productCategory",
    singleKey: "productCategory",
    allKey: "productCategories",
    table: productCategoryTableConfig,
    form: productCategoryFormConfig,
    formSchema: productCategoryRule,
  },
  company: {
    endpoint: "/company",
    singleKey: "company",
    allKey: "companies",
    table: companyTableConfig,
    form: companyFormConfig,
    formSchema: companyRule,
  },
};
