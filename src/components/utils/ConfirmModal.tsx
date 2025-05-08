/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { toast } from "sonner";
import { api } from "../../libs/api";
import { useNavigate, useParams } from "react-router";
import { authorizationStore } from "../../store/authenticationStore";

import { PiWarningFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";

export default function ConfirmModal() {
  const { entity, id } = useParams();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { session } = authorizationStore();

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/${entity}/${id}`, {
        headers: { Authorization: session },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Eliminación exitosa");
        navigate(-1);
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
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

  const handleModal = () => {
    onOpen();
  };

  return (
    <>
      <Button
        className="text-danger-600 text-base w-fit flex items-center gap-2 bg-transparent"
        onPress={handleModal}
      >
        <MdDeleteOutline size={20} /> Eliminar
      </Button>
      <Modal backdrop={"blur"} size="lg" isOpen={isOpen} onClose={onClose} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 text-xl font-bold text-danger">
                <PiWarningFill size={30}/> ¡CUIDADO! Estás a punto de eliminar
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Quieres eliminar el registro <span className="text-gray-400 font-bold">ID:{id}</span> de la entidad <span className="text-gray-400 font-bold">{entity?.toUpperCase()}</span>? Esta
                  acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" className="font-semibold" endContent={<MdDeleteOutline size={20} />} onPress={handleDelete}>
                  Si, Eliminar 
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
