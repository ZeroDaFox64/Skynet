/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { api } from "../../libs/api";
import { toast } from "sonner";
import { useParams } from "react-router";
import { authorizationStore } from "../../store/authenticationStore";

interface AsyncSelectInputProps {
  field: any;
  value: any;
  error: any;
  setValue: (name: string, value: any) => void;
  [key: string]: any;
}

const AsyncSelectInput = forwardRef<HTMLInputElement, AsyncSelectInputProps>(
  ({ field, value, error, setValue, ...rest }, ref) => {
    const [options, setOptions] = useState([]);
    const { endpoint, key, title, value: valueKey, backupTitle, required } = field;
    const { id } = useParams();

    const { session } = authorizationStore();

    const getData = async () => {
      try {
        const res = await api.get(endpoint, {
          headers: { Authorization: session },
        });

        if (res.status === 200) {
          setOptions(
            res.data[key].map((item: any) => ({
              value: item[valueKey],
              label: item[title] || item[backupTitle],
            }))
          );
        }
      } catch (err: any) {
        if (err.response) {
          const { status, data } = err.response;
          if (status === 400) {
            toast.error(data.message);
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
      getData();
    }, []);
    
    return (
      <Autocomplete
        ref={ref}
        label={field.label}
        aria-label={field.label}
        labelPlacement="outside"
        variant="underlined"
        size="sm"
        className={`${field.show === 'onlyCreate' && id ? 'hidden' : ''} ${field.show === 'onlyEdit' && !id ? 'hidden' : ''}`}
        isRequired={required}
        isInvalid={!!error}
        errorMessage={error?.message || ""}
        selectedKey={value?.[valueKey] || value}
        onSelectionChange={(key) => {
          setValue(field.name, key);
        }}
        {...rest}
      >
        {options.map((option: any) => (
          <AutocompleteItem key={option.value} id={option.value}>
            {option.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    );
  }
);

export default AsyncSelectInput;