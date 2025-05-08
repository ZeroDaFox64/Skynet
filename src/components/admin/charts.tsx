/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { api } from "../../libs/api";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Registra los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export const Chart = () => {
  const [charts, setCharts] = useState<any>(null);
  const [dataSubs, setDataSubs] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const { theme } = useTheme();

  // Obtener datos de la API
  const getData = async () => {
    const res = await api.get("/charts");
    setCharts(res?.data);

    const newDataSubs = res?.data?.subscriptions?.labels?.map(
      (label: any, index: number) => ({
        label,
        total: res?.data?.subscriptions?.datasets?.[0]?.data?.[index],
        shared: res?.data?.subscriptions?.datasets?.[1]?.data?.[index],
        single: res?.data?.subscriptions?.datasets?.[2]?.data?.[index],
      })
    );

    let subTotal = 0;
    newDataSubs.map((data: any) => {
      if (data?.label === "Netflix") {
        subTotal += data.shared * 4 + data.single * 20;
      } else {
        subTotal += data.shared * 2 + data.single * 7;
      }
    });

    setAmount(subTotal);
    console.log(newDataSubs);
    setDataSubs(newDataSubs);
  };

  useEffect(() => {
    getData();
  }, []);

  // Opciones base
  const baseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Cantidad de suscripciones por servicio",
      },
    },
  };

  // Opciones para modo oscuro
  const darkOptions = {
    ...baseOptions,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
    },
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        labels: {
          color: "#FFFFFF",
        },
      },
      title: {
        ...baseOptions.plugins.title,
        color: "#FFFFFF",
      },
    },
  };

  return (
    <div className="grid sm:grid-cols-3 gap-3 grid-cols-1 w-full max-w-7xl">
      <div
        className={`col-span-2 w-full ${
          theme === "dark" ? "bg-[#18181b]" : "border-1"
        } p-[20px] rounded-xl`}
      >
        {charts && (
          <Bar
            data={{
              labels: charts?.subscriptions?.labels,
              datasets: charts?.subscriptions?.datasets.map((dataset: any) => ({
                ...dataset,
                borderWidth: theme === "dark" ? 1.5 : 2, // Ajusta el ancho del borde según el tema
              })),
            }}
            options={theme === "dark" ? darkOptions : baseOptions}
          />
        )}
      </div>
      <div
        className={`col-span-1 w-full ${
          theme === "dark" ? "bg-[#18181b]" : "border-1"
        } p-[20px] rounded-xl`}
      >
        {
          <Pie
            data={{
              labels: charts?.subscriptions?.labels,
              datasets: [
                {
                  label: "Ingresos mensuales en USD",
                  data: [
                    dataSubs?.[0]?.shared * 2 + dataSubs?.[0]?.single * 7, 
                    dataSubs?.[1]?.shared * 2 + dataSubs?.[1]?.single * 7,
                    dataSubs?.[2]?.shared * 2 + dataSubs?.[2]?.single * 7,
                    dataSubs?.[3]?.shared * 2 + dataSubs?.[3]?.single * 7,
                    dataSubs?.[4]?.shared * 4 + dataSubs?.[4]?.single * 20,
                  ],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={theme === "dark" ? darkOptions : baseOptions}
          />
        }
        <p className="text-sm mt-2">
          Ingreso total apróximado:{" "}
          <span className="text-green-400 font-semibold">${amount.toFixed(2)} USD</span>
        </p>
      </div>
    </div>
  );
};
