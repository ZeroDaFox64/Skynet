import {
  Drawer,
  DrawerContent,
  DrawerBody,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

import Filter from "./Filters";
import useFilterStore from "../../store/filterStore";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { setNameFilter } = useFilterStore();

  function handleNameFilter(name: string) {
    setNameFilter(name);
  }

  return (
    <>
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Input
          className=""
          placeholder="Busca tus productos"
          radius="full"
          onChange={(e) => handleNameFilter(e.target.value)}
          endContent={
            <button>
              <FaSearch size={18} className="text-default-400" />
            </button>
          }
        />
        <Button
          radius="full"
          variant="flat"
          color="danger"
          className="font-normal"
          onPress={onOpen}
        >
          <FaFilter size={20} className="text-danger-800 sm:flex hidden" />
          Filtrar
        </Button>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom" size="xl" className="rounded-none">
        <DrawerContent>
            <>
              <DrawerBody className="p-5">
                <div className="w-full h-full gap-5 flex flex-col justify-center items-center">
                  <div className="w-full max-w-[80vw]">
                    <p className="text-store text-3xl font-bold w-full">
                      Filtros
                    </p>
                    <p className="text-default-500">
                      Filtra tus productos por categoría y precio
                    </p>
                  </div>
                  <Filter />
                </div>
              </DrawerBody>
            </>
        </DrawerContent>
      </Drawer>
    </>
  );
}
