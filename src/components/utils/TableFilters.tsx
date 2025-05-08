/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select, SelectItem } from "@heroui/react";
import { useSearchParams, useParams } from "react-router";

import { MdRefresh } from "react-icons/md";

export function ParamsFilters() {
  const { entity } = useParams();
  const [searchParams, setSearchParams] = useSearchParams(); // Para leer y actualizar la URL

  const handleSelectChange = (paramName: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(paramName, value);
    } else {
      newSearchParams.delete(paramName);
    }
    setSearchParams(newSearchParams); // Actualizar la URL
  };

  const handleDelete = () => {
    const newSearchParams = new URLSearchParams();

    let paramName
    if (entity === 'subscription') paramName = 'status'

    // Conservar el parámetro si existe
    if (paramName) {
      const value = searchParams.get(paramName);
      const page = searchParams.get('page') || '1'
      const limit = searchParams.get('limit') || '8'
      
      if (value) newSearchParams.set(paramName, value);
      if (page) newSearchParams.set('page', page);
      if (limit) newSearchParams.set('limit', limit);
    }

    setSearchParams(newSearchParams); // Actualizar la URL sin recargar la página
  };

  let options = [] as any;
  if (entity === 'subscription') options = subscription
  else if (entity === 'account') options = account
  else if (entity === 'user') options = user
  else if (entity === 'product') options = product

  return (
    <div className="flex gap-3">
      {options.map((option: any) => (
        <Select
          key={option.label}
          aria-label="select-param-filter"
          className="w-[150px]"
          radius="full"
          size="sm"
          variant="bordered"
          selectedKeys={[
            searchParams.get(option.paramName) || option.defaultValue,
          ]}
          onChange={(e) => handleSelectChange(option.paramName, e.target.value)}
        >
          <SelectItem key="" id="">
            {option.label}
          </SelectItem>
          {option.options.map((item: any) => (
            <SelectItem key={item.value} id={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      ))}
      <div>
      <Button
        onPress={() => handleDelete()}
        color="danger"
        size="sm"
        isIconOnly
        radius="full"
      >
        <MdRefresh size={20} />
      </Button>
      </div>
    </div>
  );
}

const user = [
  {
    label: "Rol",
    paramName: "rol",
    defaultValue: "",
    options: [
      { label: "Usuario", value: "user" },
      { label: "Verificado", value: "verified user" },
      { label: "Admin", value: "admin" },
      { label: "Super Admin", value: "superadmin" },
    ],
  }
]

const product = [
  {
    label: "Categoría",
    paramName: "category",
    defaultValue: "",
    options: [
      { label: "Manga", value: "manga" },
      { label: "Figuras", value: "figures" },
      { label: "Posters", value: "posters" },
      { label: "Ropa", value: "clothing" },
      { label: "Otros", value: "others" },
    ],
  }
]

const subscription = [
  {
    label: "Estado de pago",
    paramName: "pay_status",
    defaultValue: "",
    options: [
      { label: "Por pagar", value: "notified" },
      { label: "Pagado", value: "paid" },
      { label: "No va a renovar", value: "unrenewed" },
      { label: "Cancelado", value: "canceled" },
    ],
  },
  {
    label: "Servicios",
    paramName: "service",
    defaultValue: "",
    options: [
      { label: "Crunchyroll", value: "Crunchyroll" },
      { label: "Prime Video", value: "Prime Video" },
      { label: "HBO max", value: "HBO max" },
      { label: "Disney", value: "Disney" },
      { label: "Netflix", value: "Netflix" },
    ],
  },
  {
    label: "Tipos",
    paramName: "type",
    defaultValue: "",
    options: [
      { label: "Compartida", value: "shared" },
      { label: "Completa", value: "single" },
    ],
  },
];
const account = [
  {
    label: "Servicios",
    paramName: "service",
    defaultValue: "",
    options: [
      { label: "Crunchyroll", value: "Crunchyroll" },
      { label: "Prime Video", value: "Prime Video" },
      { label: "HBO max", value: "HBO max" },
      { label: "Disney", value: "Disney" },
      { label: "Netflix", value: "Netflix" },
    ],
  },
  {
    label: "Tipos",
    paramName: "type",
    defaultValue: "",
    options: [
      { label: "Compartida", value: "shared" },
      { label: "Completa", value: "single" },
    ],
  },
  {
    label: "Estado",
    paramName: "status",
    defaultValue: "",
    options: [
      { label: "Disponible", value: "available" },
      { label: "En revisión", value: "under_review" },
      { label: "Vencida", value: "expired" },
    ],
  },
  {
    label: "Disponibilidad",
    paramName: "availability",
    defaultValue: "",
    options: [
      { label: "Vacía", value: "empty" },
      { label: "Parcial", value: "partial" },
      { label: "Llena", value: "full" },
    ],
  },
  {
    label: "Mantenimiento",
    paramName: "maintenance",
    defaultValue: "",
    options: [
      { label: "Listo", value: "false" },
      { label: "En espera", value: "true" },
    ],
  },
];
