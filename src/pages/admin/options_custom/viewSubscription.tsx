/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { api } from "../../../libs/api";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { authorizationStore } from "../../../store/authenticationStore";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

import moment from "moment";

export default function ViewAccount() {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [newAccount, setNewAccount] = useState<any>("");
  const [options, setOptions] = useState<any>([]);

  const navigate = useNavigate();
  const { session } = authorizationStore();

  const getData = useCallback(async () => {
    try {
      const res = await api.get(`/subscription/${id}`, {
        headers: { Authorization: session },
        params: {
          populate: true,
        },
      });

      if (res.status === 200) {
        setData({ ...res?.data?.subscription });
      }
    } catch (err: any) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." + err
      );
    }
  }, [id, session]);

  useEffect(() => {
    getData();
    getOptions();
  }, []);

  const getOptions = async () => {
    try {
      const res = await api.get("/account/all", {
        headers: { Authorization: session },
      });

      if (res.status === 200) {
        setOptions(
          res.data["accounts"].map((item: any) => ({
            value: item["_id"],
            label: item["email"],
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
            "Ocurrió un error recuperando las cuentas. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleMigrate = async () => {
    try {
      const res = await api.put(
        `/subscription/migrate/${id}`,
        {
          account: newAccount,
        },
        {
          headers: { Authorization: session },
        }
      );

      if (res.status === 200) {
        toast.success("Suscripción migrada correctamente.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." + err
      );
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-xl font-semibold">
              {data?.pay_status !== "canceled" ? "Migrar suscripción a otra cuenta" : "Reaperturar la suscripción"}
            </p>
            <p className="text-sm text-gray-500 font-normal">
              Opcionalmente puedes seleccionar la cuenta a la que quieres asignar
              la suscripción
            </p>
          </ModalHeader>
          <ModalBody>
            <Autocomplete
              label={"Seleccionar una cuenta de destino"}
              aria-label={"input para migrar a otra cuenta"}
              labelPlacement="outside"
              variant="underlined"
              selectedKey={newAccount}
              onSelectionChange={(key) => {
                // Actualiza el valor del campo en el formulario
                setNewAccount(key);
              }}
            >
              {options.map((option: any) => (
                <AutocompleteItem key={option.value} id={option.value}>
                  {option.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </ModalBody>
          <ModalFooter>
            <Button fullWidth variant="flat" color="primary" onPress={handleMigrate} className="font-semibold">
              {data?.pay_status !== "canceled" ? "Migrar" : "Reaperturar"} suscripción
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="w-full flex justify-center items-center my-10 px-3">
        <Card className="w-full max-w-xl p-2">
          <CardHeader className="flex items-center gap-3">
            <Avatar
              isBordered
              size="lg"
              src={data?.user?.avatar}
              radius="full"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl font-bold">
                {data?.nickname || data?.user?.username}
              </h3>
              <p className="text-sm text-gray-500">
                Suscripción de {data?.service?.name}
              </p>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Divider />

            <p className="text-sm">
              <span className="font-semibold">Cuenta asignada:</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Correo:</span> <span className="text-primary-500 cursor-pointer" onClick={() => navigate(`/view/account/${data?.account?._id}`)}>{data?.account?.email}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Contraseña:</span> <span>{data?.account?.password}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Nickname:</span> {data?.nickname || 'Sin establecer'}
            </p>
            {data.pin && (
              <p className="text-sm">Pin: {data?.pin}</p>
            )}
            <p className="text-sm">
              <span className="font-semibold">Estado de pago:</span>{" "}
              {(() => {
                switch (data?.pay_status) {
                  case "paid":
                    return "Pagado";
                  case "notified":
                    return "Notificado por pagar";
                  case "canceled":
                    return "Cancelado";
                  case "unrenewed":
                    return "No va a renovar";
                  default:
                    return "Desconocido";
                }
              })()}
            </p>
            <p className="text-sm">
            <span className="font-semibold">Tipo:</span> {data?.type === "shared" ? "Compartida" : "Individual"}
            </p>
            <p className="text-sm">
            <span className="font-semibold">Último pago:</span> {moment(data?.contract_date).format("DD/MM/YYYY")}
            </p>
            <p className="text-sm">
            <span className="font-semibold">Próximo cobro:</span> {moment(data?.cutoff_date).format("DD/MM/YYYY")}
            </p>
            {data?.observations === "" && (
              <p className="text-sm">
                <span className="font-semibold">Observaciones:</span> {data?.observations}
              </p>
            )}
          </CardBody>
          <CardFooter className="flex gap-3 justify-end">
            <Button onPress={() => navigate(-1)}>
              Regresar
            </Button>
            <Button color="danger" variant="flat" onPress={() => onOpen()}>{data?.pay_status !== "canceled" ? "Migrar" : "Reaperturar"}</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
