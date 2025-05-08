/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IoCameraSharp } from "react-icons/io5";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { api } from "../../libs/api-files";
import { authorizationStore } from "../../store/authenticationStore";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { LuCloudUpload } from "react-icons/lu";
import { MdFileDownloadDone } from "react-icons/md";
import { TiCancel } from "react-icons/ti";
import { IoMdImages } from "react-icons/io";

export default function UploadAvatar() {
  const [file, setFile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = authorizationStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    if (selectedFile.size > 5000000) {
      toast.error("El archivo es demasiado grande");
      setFile(null);
      return;
    }

    const options = {
      maxSizeMB: 2,
      maxIteration: 10,
      maxWidthOrHeight: 300,
      useWebWorker: true,
    };

    try {
      const compressionFile = await imageCompression(selectedFile, options);
      setFile(compressionFile);
    } catch (err: any) {
      setFile(null);
      return toast.error("Error al comprimir la imagen ", err);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) {
      toast.error("Por favor, selecciona una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsLoading(true);

    try {
      const res = await api.post(`user/avatar/${user?.id}`, formData, {
        headers: { Authorization: session }
      });

      if (res.status === 200) {
        toast.success("Avatar subido correctamente");
        window.location.replace("/");
      } else {
        toast.error("Error al subir el avatar");
      }
    } catch (err) {
      toast.error("" + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {user?.avatar !== null ? (
          <Image
            src={user?.avatar}
            className="w-36 h-36 rounded-full object-cover"
            radius="full"
          />
        ) : (
          <Image
            src="/avatar.jpg"
            className="w-36 h-36 rounded-full object-cover"
            radius="full"
          />
        )}
        <Button
          isIconOnly
          className="rounded-full bg-gray-800 hover:opacity-5 opacity-0 absolute z-20 w-36 h-36 top-0"
          onPress={onOpen}
        >
          <IoCameraSharp size={70} className="text-gray-100" />
        </Button>
      </div>
      <Modal
        backdrop={"blur"}
        size="lg"
        placement="center"
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 text-xl font-bold items-center">
                <IoMdImages size={25} /> Sube una imagen de perfil
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-[#202023] dark:bg-[#18181b] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    <input {...getInputProps()} />
                    {file !== null ? (
                      <p className="text-sm text-green-500 flex items-center gap-2 flex-col">
                        <MdFileDownloadDone size={50} />
                        <span className="font-semibold">
                          Imagen de perfil seleccionada
                        </span>
                      </p>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-2">
                        <LuCloudUpload
                          size={50}
                          className="text-gray-500 dark:text-gray-400"
                        />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click para subir</span>{" "}
                          o arrastrar y soltar
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG o JPG (MAX. 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end items-center gap-3 h-[70px]">
                    <Button
                      variant="flat"
                      onPress={onClose}
                      fullWidth
                      className="font-semibold"
                    >
                      Cancelar <TiCancel size={20} />
                    </Button>
                    <Button
                      color="primary"
                      className="font-semibold"
                      fullWidth
                      isLoading={isLoading}
                      type="submit"
                      endContent={<LuCloudUpload size={20} />}
                    >
                      Subir
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}