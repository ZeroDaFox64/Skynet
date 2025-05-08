/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { ChangePasswordInterface } from "../../interfaces/authInterface";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordRule } from "../../rules/authRules";
import { api } from "../../libs/api";
import { authorizationStore } from "../../store/authenticationStore";

import { TiCancel } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";

export default function App() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user, session } = authorizationStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInterface>({
    resolver: zodResolver(changePasswordRule),
  });

  const onSubmit = async (data: ChangePasswordInterface) => {
    try {
      const res = await api.post("/authentication/change-password", {
        password: data?.password,
        new_password: data?.new_password,
        id: user?.id,
      },{
        headers: { Authorization: session },
      });

      if (res.status === 200) {
        onClose();
        reset();
        toast.success("Contraseña cambiada exitosamente");
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
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
                <FaUserShield size={25} /> Cambio de contraseña
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <Input
                    size="sm"
                    fullWidth
                    {...register("password", { required: true })}
                    errorMessage={errors?.password?.message?.toString()}
                    isInvalid={!!errors?.password}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaRegEye size={20} />
                        ) : (
                          <FaRegEyeSlash size={20} />
                        )}
                      </button>
                    }
                    label="Contraseña actual"
                    type={showPassword ? "text" : "password"}
                  ></Input>
                  <Input
                    size="sm"
                    fullWidth
                    {...register("new_password", { required: true })}
                    errorMessage={errors?.new_password?.message?.toString()}
                    isInvalid={!!errors?.new_password}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <FaRegEye size={20} />
                        ) : (
                          <FaRegEyeSlash size={20} />
                        )}
                      </button>
                    }
                    label="Contraseña nueva"
                    type={showNewPassword ? "text" : "password"}
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
      <div className="flex justify-end gap-3 w-full max-w-lg">
        <Button variant="bordered" color="danger" onPress={onOpen}>
          Cambiar contraseña <MdEdit />
        </Button>
      </div>
    </>
  );
}
