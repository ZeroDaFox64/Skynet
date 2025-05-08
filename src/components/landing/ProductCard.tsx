import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";

import "swiper/swiper-bundle.css";
import "swiper/modules";

import { Pagination } from "@heroui/react";
import { useEffect, useState } from "react";

import useFilterStore from "../../store/filterStore";
import ProductDetail from "./ProductDetail";
import { authorizationStore } from "../../store/authenticationStore";
import { api } from "../../libs/api-files";

export default function App() {
  const [list, SetList] = useState([]);
  const [currentList, SetCurrentList] = useState([]);
  const [imageLoader, SetImageLoader] = useState(true);
  const [selectedItem, setSelectedItem] = useState({
    code: "",
    name: "",
    price: 1.11,
    discount: 1,
    description: "",
    image: "",
    images: [""],
    category: "",
    features: [{}],
    genre: "",
  });

  const { session } = authorizationStore();

  const getData = async () => {
    const res = await api.get("/product", {
      headers: { Authorization: session },
    });

    SetList(res.data.products);
    SetCurrentList(res.data.products);
  };

  useEffect(() => {
    getData();
  }, []);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(currentList.length / 16);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = currentList.slice(
    (currentPage - 1) * 16,
    currentPage * 16
  );

  interface Item {
    code: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    image: string;
    front_image: string;
    images: string[];
    category: string;
    features: object[];
    genre: string;
  }

  const handleSelectItem = (item: Item) => {
    onOpen();
    setSelectedItem(item);
  };

  const { nameFilter, categoryFilter, priceRangeFilter } = useFilterStore();

  useEffect(() => {
    SetCurrentList(
      list.filter((item : Item) => {
        if (!item.name.toLowerCase().includes(nameFilter.toLowerCase())) {
          return false;
        }

        if (!categoryFilter.includes(item.category)) {
          return false;
        }

        if (
          item.price < priceRangeFilter.min ||
          item.price > priceRangeFilter.max
        ) {
          return false;
        }

        return true;
      })
    );
  }, [nameFilter, categoryFilter, priceRangeFilter]);

  useEffect(() => {
    SetCurrentList(list)
    setTimeout(() => {
      SetImageLoader(false);
    }, 3000);
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        placement="bottom-center"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <ProductDetail selectedItem={selectedItem} onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        {currentItems.map((item : Item, index : number) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => handleSelectItem(item)}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                isLoading={imageLoader}
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.name}
                className="w-[200px] object-cover h-[200px]"
                src={item.front_image}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>
                {item.name.substring(0, 12)}
                {item.name.length > 12 && "..."}
              </b>
              <p className="font-normal text-green-400">
                ${item.price.toFixed(2)}
              </p>
            </CardFooter>
          </Card>
        ))}
        {currentItems.length === 0 && (
          <div className="col-span-full">
            <p className="text-gray-400 text-3xl font-bold text-center p-5">
              No hay productos que coincidan con tu busqueda
            </p>
          </div>
        )}
      </div>
      <Pagination
        total={totalPages}
        initialPage={1}
        page={currentPage}
        color="danger"
        loop
        showControls
        variant="light"
        onChange={handlePageChange}
      />
    </>
  );
}
