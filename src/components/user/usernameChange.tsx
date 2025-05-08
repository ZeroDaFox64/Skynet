/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizationStore } from "../../store/authenticationStore";
import { toast } from "sonner";
import { api } from "../../libs/api";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUsernameRule } from "../../rules/authRules";
import { ChangeUsernameInterface } from "../../interfaces/userInterface";

import { MdEdit } from "react-icons/md";
import { FaUserGear } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";

function App() {
  const { user, setUser, session } = authorizationStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeUsernameInterface>({
    resolver: zodResolver(changeUsernameRule),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.put(`/user/${user?.id}`, {
        username: data?.username,
      },
      {
        headers: { Authorization: session },
      });
      if (res.status === 200) {
        setUser(res?.data?.user);
        onClose();
        reset();
        toast.success("Nombre de usuario cambiado exitosamente");
      } else {
        toast.error(
          "No se pudo cambiar el nombre de usuario."
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement="center"
        scrollBehavior="inside"
        backdrop="blur"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold flex items-center gap-3">
                <FaUserGear size={25} /> Cambio de nombre de usuario
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <Input
                    size="sm"
                    fullWidth
                    {...register("username", { required: true })}
                    errorMessage={errors?.username?.message?.toString()}
                    isInvalid={!!errors?.username}
                    label="Nuevo nombre de usuario"
                    type="text"
                  ></Input>
                  <div className="flex justify-end gap-3 pb-2 items-center h-[70px]">
                    <Button
                      onPress={onClose}
                      className="font-semibold"
                      fullWidth
                    >
                      Cancelar <TiCancel size={20} />
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      className="font-semibold"
                      fullWidth
                    >
                      Confirmar <FaCheckCircle size={16} />
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="text-center text-white text-3xl font-semibold flex items-end justify-center gap-2">
        {"@" + user?.username}{" "}
        <MdEdit size={25} className="cursor-pointer" onClick={onOpen} />
      </div>
    </>
  );
}

export default App;
