/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Chip,
  Image,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";

export default function ProductDetail({
  selectedItem,
}: {
  selectedItem: any;
  onClose: any;
}) {
  const [image, SetImage] = useState(selectedItem.front_image);

  const handleImageChange = (url: string) => {
    SetImage(url);
  };

  function calcOriginalPrice(finalPrice: number, discount: number): number {
    return finalPrice / (1 - discount / 100);
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <p className="text-gray-400 text-base">COD | {'00089878309897'}</p>
        <p className="text-2xl font-bold">{selectedItem.name}</p>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-5 mb-5">
          <div className="flex w-full justify-center items-center">
            <Image
              isBlurred
              className="object-cover max-w-[400px] w-full shadow-lg rounded-md"
              src={image}
            />
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 w-max">
              <Image
                src={selectedItem.front_image}
                onClick={() => handleImageChange(selectedItem.front_image)}
                className="w-20 h-20 cursor-pointer object-cover"
              />
              {selectedItem.images.map((url: string, index: number) => (
                <Image
                  key={index}
                  src={url}
                  onClick={() => handleImageChange(url)}
                  className="w-20 h-20 cursor-pointer object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          {selectedItem.discount > 0 && (
            <p className="text-xl font-bold mb-3 text-gray-400">
              Antes{" "}
              <span className="line-through">
                $
                {calcOriginalPrice(
                  selectedItem.price,
                  selectedItem.discount
                ).toFixed(2)}
              </span>
            </p>
          )}
          <p className="text-5xl text-green-400 font-bold mb-3">
            ${selectedItem.price.toFixed(2)}
          </p>
          {selectedItem.discount > 0 && (
            <p className="text-xl font-bold text-gray-400">
              Después{" "}
              <span className="text-green-400">
                $
                {calcOriginalPrice(
                  selectedItem.price,
                  selectedItem.discount
                ).toFixed(2)}
              </span>
            </p>
          )}

          <Chip size="lg" color="primary" className="mb-5">
            Categoria - {selectedItem?.product_category?.name}
          </Chip>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold">Descripción</p>
            <p className="mb-5">{selectedItem.description}</p>
            <p className="text-gray-400 text-base mb-5">
              <span className="font-bold">Géneros:</span> {selectedItem.genre}.
            </p>
          </div>
        </div>
        <Table
          hideHeader
          isStriped
          aria-label="table"
          className=""
          shadow="none"
        >
          <TableHeader>
            <TableColumn className="h-11 text-sm font-bold">Nombre</TableColumn>
            <TableColumn className="h-11 text-sm font-bold">
              Descripción
            </TableColumn>
          </TableHeader>
          <TableBody>
            {JSON.parse(selectedItem.features).map(
              (item: any, index: number) => (
                <TableRow key={index} className="h-11">
                  <TableCell className="font-bold">{item.title}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button
          className="bg-[#FFE600]"
          onPress={() =>
            window.open(selectedItem.link_mercadolibre, "_blank")
          }
        >
          <img src="/logo_ml.png" alt="logo" className="w-[100px] " />
        </Button>
      </ModalFooter>
    </>
  );
}
