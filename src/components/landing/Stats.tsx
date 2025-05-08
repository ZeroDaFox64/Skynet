import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { BsPersonHeart } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { LuPackageCheck } from "react-icons/lu";
import { LuPackageOpen } from "react-icons/lu";

export default function App({ ContainerStyles = "" }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [items, setItems] = useState([
    {
      icon: <LuPackageOpen size={80} />,
      title: "Productos",
      value: 0,
      symbolEnd: "+",
    },
    {
      icon: <LuPackageCheck size={80} />,
      title: "Ventas",
      value: 0,
      symbolEnd: "+",
    },
    {
      icon: <FaShippingFast size={80} />,
      title: "Envíos",
      value: 0,
      symbolEnd: "+",
    },
    {
      icon: <BsPersonHeart size={80} />,
      title: "Clientes",
      value: 0,
      symbolEnd: "+",
    },
  ]);

  useEffect(() => {
    if (!inView) return; // Solo se ejecuta cuando es visible

    const timer = setTimeout(() => {
      setItems([
        {
          icon: <LuPackageOpen size={80} />,
          title: "Productos",
          value: 252,
          symbolEnd: "+",
        },
        {
          icon: <LuPackageCheck size={80} />,
          title: "Ventas",
          value: 5131,
          symbolEnd: "+",
        },
        {
          icon: <FaShippingFast size={80} />,
          title: "Envíos",
          value: 782,
          symbolEnd: "+",
        },
        {
          icon: <BsPersonHeart size={80} />,
          title: "Clientes",
          value: 3783,
          symbolEnd: "+",
        },
      ]);
    }, 200);

    return () => clearTimeout(timer);
  }, [inView]); // Dependencia del efecto

  return (
    <section ref={ref} className={`flex px-3 justify-center ${ContainerStyles}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-[900px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="justify-center items-center gap-2 flex flex-col rounded-2xl w-full max-w-[220px] h-[200px]"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              {item.icon}
              <div className="flex text-5xl font-bold text-store">
                <NumberFlow
                  value={item.value}
                  format={{ notation: 'compact' }}
                  prefix="+"
                />
              </div>
              <h2 className="text-xl font-semibold max-w-[200px] text-center text-gray-400">
                {item.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}