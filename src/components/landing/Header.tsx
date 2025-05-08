import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";

export default function App() {
  const [image, setImage] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModal = (selectedImage: string) => {
    setImage(selectedImage);
    onOpen();
  };

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        classNames={{
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody>
            <img
              src={image}
              alt="Imagen del header"
              className="w-full h-full object-cover"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="w-full relative flex justify-center ">
        {/* <video
          src={`${db_store.header.bg}`}
          autoPlay
          loop
          muted
          className="absolute top-0 w-[95vw] h-full object-cover rounded-b-3xl overflow-hidden"
        /> */}
        <img
          src="/header.webp"
          alt="Imagen del header"
          className="absolute top-0 w-[95vw] h-full object-cover rounded-b-3xl overflow-hidden"
        />

        <div className="flex flex-col justify-center items-center min-h-[600px] w-full p-8 relative">
          <div className="max-w-5xl w-full ">
            <p className="text-xl font-medium text-gray-300">
              En Nitto te ofrecemos las mejores ofertas de temporada
            </p>
            <p className="text-4xl font-bold mb-2 text-storesecondary">
              En todos los mangas y figuras
            </p>
            <p className="text-xl font-medium text-gray-300">
              Y ahora con envíos gratis
            </p>
            <div className="flex gap-3 mt-5">
              <Button
                onPress={() => handleModal("/freeshiping.webp")}
                variant="bordered"
                className="rounded-full border-storesecondary font-semibold text-storesecondary"
              >
                Obtén tu envío gratis
              </Button>
              <Button
                onPress={() => handleModal("/promoflash.webp")}
                variant="solid"
                className="rounded-full bg-storesecondary font-semibold text-store"
              >
                Ofertas flash
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
