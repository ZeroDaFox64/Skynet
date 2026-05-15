/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Textarea,
} from "@heroui/react";
import ConfirmModal from "../utils/ConfirmModal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../libs/api-files";
import { useNavigate, useParams } from "react-router";
import { config } from "../../pages/admin/configs/index.config";
import { FaRegFileLines } from "react-icons/fa6";
import AsyncSelectInput from "../utils/AsyncSelect";
import { authorizationStore } from "../../store/authenticationStore";
import ImageUploadInput from "../utils/ImageUpload";
import FeaturesInput from "../utils/Features";

export default function App({ formType = "add" }: { formType: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const { session, logout } = authorizationStore();
  const { entity, id } = useParams();
  const { form, endpoint, singleKey } = config[entity as keyof typeof config];
  const entityConfig = config[entity as keyof typeof config];
  type EntityFormInterface = typeof entityConfig & {
    front_image?: File;
    images?: File | File[] | FileList; // Add the 'images' property
  };

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    // formState: { errors },
    setValue,
  } = useForm<EntityFormInterface>({
    resolver: zodResolver(entityConfig.formSchema),
  });

  const getData = async () => {
    try {
      const res = await api.get(`${endpoint}/${id}`, {
        headers: { Authorization: session },
      });
      if (res.status === 200 || res.status === 201) {
        reset(res.data[singleKey]);
      }

      if (res.status === 401) {
        navigate('/authentication/login');
        logout();
        toast.warning(
          "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
        );
      }
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data?.message);
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  useEffect(() => {
    if (formType === "update") {
      getData();
      return;
    }
    reset();
  }, [formType, id]);

  const handleUpdateData = async (data: EntityFormInterface) => {
    setIsLoading(true);

    try {
      const res = await api.put(`${endpoint}/${id}`, data, {
        headers: {
          Authorization: session,
        },
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Actualización exitosa");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data?.message);
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterData = async (data: EntityFormInterface) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // 1. Agregar campos simples
      Object.entries(data).forEach(([key, value]) => {
        if (!['features', 'images', 'front_image'].includes(key) && value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // 2. Agregar features
      if ('features' in data && Array.isArray(data.features)) {
        formData.append('features', JSON.stringify(data.features));
      }

      // 3. Agregar front_image
      if (data.front_image) {
        // Convertir a array si es FileList
        const imagesArray = data.front_image instanceof FileList
          ? Array.from(data.front_image)
          : Array.isArray(data.front_image)
            ? data.front_image
            : [data.front_image];

        // Cambia esta parte:
        imagesArray.forEach((file) => {
          formData.append('front_image', file); // ¡Clave sin índices!
        });
      }

      // 4. Agregar imágenes múltiples
      if (data.images) {
        // Convertir a array si es FileList
        const imagesArray = data.images instanceof FileList
          ? Array.from(data.images)
          : Array.isArray(data.images)
            ? data.images
            : [data.images];

        // Cambia esta parte:
        imagesArray.forEach((file) => {
          formData.append('images', file); // ¡Clave sin índices!
        });
      }

      const res = await api.post(`${endpoint}/register`, formData, {
        headers: {
          Authorization: session,
        },
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Registro exitoso");
        if (form?.onRegisterSuccess) {
          form?.onRegisterSuccess();
        }
        if (form?.successModal) {
          setSuccessData(res?.data[form?.successDataKey]);
          setShowSuccessModal(true);
        }
        reset();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data?.message);
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeRecords = () => {
    if (formType === "update") {
      navigate(-1);
    } else {
      navigate(`/view/${entity}`);
    }
  };

  // console.log(errors)
  return (
    <>
      <title>{form.name} | Panel de control</title>
      {showSuccessModal && form?.successModal(successData)}
      <div className="w-full flex flex-col justify-start items-center mt-5 mb-20 px-3">
        <div className="grid gap-5 w-full max-w-lg">
          <div className="place-content-start w-full flex flex-col gap-2">
            <h3 className="text-3xl font-bold">{form?.name}</h3>
            <p className="text-gray-400 text-base font-semibold">
              {form?.description}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(
              formType === "update" ? handleUpdateData : handleRegisterData
            )}
          >
            <div className="flex flex-col flex-wrap gap-5 relative">
              {form.fields.map((field: any, index: number) => {
                if (field.component === "TEXT") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <Input
                          type="text"
                          label={field.label}
                          aria-label={field.label}
                          className={`${field.show === "onlyCreate" && id ? "hidden" : ""
                            } ${field.show === "onlyEdit" && !id ? "hidden" : ""
                            }`}
                          variant="underlined"
                          isRequired={field.required}
                          labelPlacement="outside"
                          isDisabled={
                            field.disable && formType === "update"
                              ? true
                              : false
                          }
                          placeholder={field.placeholder}
                          size="sm"
                          startContent={
                            field.name === "phone" ? (
                              <span className="font-bold text-gray-400">+</span>
                            ) : null
                          }
                          errorMessage={error?.message || ""}
                          isInvalid={!!error}
                          value={value || ""}
                          {...rest}
                        />
                      )}
                    />
                  );
                }

                if (field.component === "NUMBER") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <Input
                          type="number"
                          label={field.label}
                          aria-label={field.label}
                          className={`${field.show === "onlyCreate" && id ? "hidden" : ""
                            } ${field.show === "onlyEdit" && !id ? "hidden" : ""
                            }`}
                          variant="underlined"
                          isRequired={field.required}
                          labelPlacement="outside"
                          startContent={<p className="text-gray-500 font-bold">{field.startContent}</p>}
                          min={field.minValue ?? 0}
                          max={field.maxValue ?? 9999999}
                          step={field.step ?? "any"}
                          isDisabled={
                            field.disable && formType === "update"
                              ? true
                              : false
                          }
                          placeholder={field.placeholder}
                          size="sm"
                          errorMessage={error?.message || ""}
                          isInvalid={!!error}
                          value={value ?? ""}
                          {...rest}
                        />
                      )}
                    />
                  );
                }

                if (field.component === "SELECT") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          label={field.label}
                          aria-label={field.label}
                          className={`${field.show === "onlyCreate" && id ? "hidden" : ""
                            } ${field.show === "onlyEdit" && !id ? "hidden" : ""
                            }`}
                          labelPlacement="outside"
                          variant="underlined"
                          isRequired={field.required}
                          size="sm"
                          isInvalid={!!error}
                          errorMessage={error?.message || ""}
                          selectedKey={value}
                          disabledKeys={field?.options
                            .filter((option: any) => option.disabled)
                            .map((option: any) => option.value)}
                          onSelectionChange={(key) => {
                            // Actualiza el valor del campo en el formulario
                            setValue(field.name, key);
                          }}
                          {...rest}
                        >
                          {field.options.map((option: any) => (
                            <AutocompleteItem
                              key={option.value}
                              id={option.value}
                            >
                              {option.label}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      )}
                    />
                  );
                }

                if (field.component === "DATE") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <Input
                          type="date"
                          label={field.label}
                          aria-label={field.label}
                          className={`${field.show === "onlyCreate" && id ? "hidden" : ""
                            } ${field.show === "onlyEdit" && !id ? "hidden" : ""
                            }`}
                          isRequired={field.required}
                          variant="underlined"
                          labelPlacement="outside"
                          isDisabled={
                            field.disable && formType === "update"
                              ? true
                              : false
                          }
                          placeholder={field.placeholder}
                          size="sm"
                          errorMessage={error?.message || ""}
                          isInvalid={!!error}
                          value={value || ""} // Asegura que el valor no sea undefined
                          {...rest}
                        />
                      )}
                    />
                  );
                }

                if (field.component === "ASYNC_SELECT") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <AsyncSelectInput
                          field={field}
                          formType={formType}
                          value={value}
                          error={error}
                          show={field.show}
                          setValue={setValue}
                          control={control}
                          index={index}
                          {...rest}
                        />
                      )}
                    />
                  );
                }

                if (field.component === "TEXTAREA") {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      aria-label={field.label}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <Textarea
                          key="underlined"
                          size="sm"
                          label={field.label}
                          className={`${field.show === "onlyCreate" && id ? "hidden" : ""
                            } ${field.show === "onlyEdit" && !id ? "hidden" : ""
                            } col-span-12 md:col-span-6 mb-6 md:mb-0`}
                          isRequired={field.required}
                          isInvalid={!!error}
                          errorMessage={error?.message || ""}
                          value={value || ""} // Asegura que el valor no sea undefined
                          {...rest}
                          labelPlacement="outside"
                          variant="underlined"
                        />
                      )}
                    />
                  );
                }

                if (field.component === 'IMAGE') {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <ImageUploadInput
                          field={field}
                          formType={formType}
                          value={value}
                          error={error}
                          show={field.show}
                          setValue={setValue}
                          control={control}
                          index={index}
                          {...rest}
                        />
                      )}
                    />
                  );
                }

                if (field.component === 'FEATURES') {
                  return (
                    <Controller
                      key={index}
                      name={field.name}
                      control={control}
                      defaultValue={field.default}
                      render={({
                        field: { value, ...rest },
                        fieldState: { error },
                      }) => (
                        <FeaturesInput
                          field={field}
                          formType={formType}
                          value={value}
                          error={error}
                          show={field.show}
                          setValue={setValue}
                          control={control}
                          index={index}
                          {...rest}
                        />
                      )}
                    />
                  );
                }
                return null;
              })}
              <div>
                <Button
                  className="text-white font-medium bg-store"
                  fullWidth
                  isLoading={isLoading}
                  type="submit"
                >
                  {formType === "update" ? "Actualizar" : "Registrar"}
                </Button>
              </div>
            </div>
          </form>
          <div className="flex justify-between">
            <Button
              onPress={handleSeeRecords}
              className="w-fit flex items-center gap-2 text-base bg-transparent"
            >
              <FaRegFileLines /> Ver registros
            </Button>
            {formType === "update" && <ConfirmModal />}
          </div>
        </div>
      </div>
    </>
  );
}
