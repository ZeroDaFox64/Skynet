import { Button, Drawer, DrawerContent } from "@heroui/react";
import { useEffect, useState } from "react";

import { MdOutlineCookie, MdCookie } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies", "true");
    setIsOpen(false);
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        size="xl"
        isDismissable={false}
        hideCloseButton
        className="rounded-none z-10"
      >
        <DrawerContent className="p-5 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <div>
            <img src="/miku_cookies.webp" alt="cookies" className="w-[250px]" />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <p className="text-4xl font-bold mb-1 flex items-center gap-2">
              <MdOutlineCookie /> Cookies
            </p>
            <p className="text-default-400 max-w-md">
              Utilizamos cookies para mejorar tu experiencia en nuestro sitio
              web. Al utilizar nuestro sitio web, aceptas el uso de cookies.
            </p>
            <a
              href="https://www.kaspersky.es/resource-center/definitions/cookies"
              target="_blank"
              className="text-blue-500 mb-5 w-fit flex items-center gap-2"
            >
              Más información <FiExternalLink size={15} />
            </a>

            <div className="flex gap-3">
              <Button
                color="primary"
                variant="flat"
                fullWidth
                onPress={handleAccept}
              >
                Aceptar cookies <MdCookie size={20} />
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
