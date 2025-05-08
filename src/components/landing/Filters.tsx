import { Card, CardHeader, CardBody, Button, Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import db_store from "../../db_store";

import useFilterStore from "../../store/filterStore";
import { FaRegCheckCircle } from "react-icons/fa";


export default function Filter() {
  const { setPriceRangeFilter, setCategoryFilter} = useFilterStore();
  const [priceRange, setPriceRange] = useState(db_store.filter_price);
  const [categories, setCategories] = useState<string[]>(db_store.filter_categories);

  function handleCategory(selectedCategory: string) {
    if (categories.includes(selectedCategory)) {
      setCategories(categories.filter((item) => item !== selectedCategory));
    } else {
      setCategories([...categories, selectedCategory]);
    }
  }

   useEffect(() => {
     setPriceRangeFilter(priceRange[0], priceRange[1]);
     setCategoryFilter(categories);
  }, [priceRange, categories, setPriceRangeFilter, setCategoryFilter]);

  const categoryOptions = db_store.filter_categories;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[84vw]">
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-bold">Precio</h3>
          </CardHeader>
          <CardBody>
            <Slider
              className="w-full"
              defaultValue={db_store.filter_price}
              formatOptions={{ style: "currency", currency: "USD" }}
              label="Rango de precios"
              color="danger"
              onChange={(value: number[] | number) => {
                if (Array.isArray(value)) {
                  setPriceRange([value[0], value[1]]);
                }
              }}
              maxValue={100}
              minValue={0}
              step={1}
            />
          </CardBody>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-bold">Categorías</h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-3 justify-around">
              {categoryOptions.map((item, index) => (
                <Button
                  key={index}
                  onPress={() => handleCategory(item)}
                  className={`${
                    categories.includes(item)
                      ? "bg-danger text-white rounded-full w-full"
                      : "rounded-full w-full"
                  } `}
                  variant={categories.includes(item) ? "solid" : "bordered"}
                  color="danger"
                >
                  {item} {categories.includes(item) && <FaRegCheckCircle/>}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
