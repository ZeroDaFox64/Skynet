import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/modules";
import { EffectCards, Autoplay } from "swiper/modules";
import ProductDetail from "./ProductDetail";

import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaRegHandshake } from "react-icons/fa6";

import db_store from "../../db_store";
import { useEffect, useState } from "react";
import { api } from "../../libs/api-files";
import { authorizationStore } from "../../store/authenticationStore";

export default function App({ ContainerStyles = "" }) {
  const [list, SetList] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState({
    code: "",
    name: "",
    price: 1.11,
    discount: 1,
    description: "",
    image: "",
    images: [""],
    category: "",
  });

  const { session } = authorizationStore();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  interface Item {
    code: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    image: string;
    images: string[];
    category: string;
    front_image: string;
  }

  const getData = async () => {
    const res = await api.get("/product", {
      headers: { Authorization: session },
    });

    SetList(res.data.products.slice(0, 9));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSelectItem = (item: Item) => {
    onOpen();
    setSelectedItem(item);
  };

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
      <div className={`w-full flex justify-center ${ContainerStyles}`}>
        <div className="grid grid-cols-1 w-[800px] sm:grid-cols-2 gap-5 p-2 sm:p-0">
          <div className="flex flex-col gap-5 px-4">
            <p className="text-3xl font-bold">{db_store.body_trend.title}</p>
            <p className="text-sm text-gray-500">
              {db_store.body_trend.description}
            </p>
            <footer className="flex items-center sm:gap-5 gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <Button
                  className="text-white"
                  color="warning"
                  isIconOnly
                  disableAnimation
                >
                  <BsFillLightningChargeFill size={20} />
                </Button>
                Rápido
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Button
                  className="text-white"
                  color="success"
                  isIconOnly
                  disableAnimation
                >
                  <IoShieldCheckmark size={20} />
                </Button>
                Seguro
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Button
                  className="text-white"
                  color="primary"
                  isIconOnly
                  disableAnimation
                >
                  <FaRegHandshake size={20} />
                </Button>
                Sencillo
              </div>
            </footer>
          </div>

          <div className="overflow-hidden px-8 py-5">
            <Swiper
              modules={[EffectCards, Autoplay]}
              effect={"cards"}
              autoplay={true}
            >
              {list.map((item, index) => (
                <SwiperSlide
                  key={index + item.name}
                  className="w-[300px] h-[300px] rounded-3xl"
                >
                  <img
                    src={item.front_image}
                    className="h-[300px] w-full object-cover relative"
                  />
                  <div className="flex flex-col items-center justify-between p-5 absolute top-0 left-0 w-full h-full">
                    <div className="w-full">
                      <p className="text-xl font-bold text-white">
                        {item.name}
                      </p>
                      <p className="text-sm  text-gray-200">
                        ${item.price.toFixed(2)} USD
                      </p>
                    </div>
                    <div className="w-full">
                      <Button
                        endContent={<FaRegEye size={20} />}
                        color="danger"
                        className="rounded-full font-semibold w-full"
                        onPress={() => handleSelectItem(item)}
                      >
                        Ver producto
                      </Button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
