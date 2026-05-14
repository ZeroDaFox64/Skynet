/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParamsFilters } from "../../../components/utils/TableFilters";
import { useDebounce } from "use-debounce";
import { config } from "../configs/index.config";
import { Link, useNavigate, useParams, useSearchParams } from "react-router"; // Importar useSearchParams
import { useEffect, useState } from "react";
import { api } from "../../../libs/api";
import AdminHeader from "../../../components/admin/adminHeader";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardFooter,
  CircularProgress,
  Image,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { toast } from "sonner";
import { authorizationStore } from "../../../store/authenticationStore";

import { FaSearch } from "react-icons/fa";
import { LuCircleFadingPlus } from "react-icons/lu";
import { PiWarningFill } from "react-icons/pi";

export default function App() {
  const { entity } = useParams();
  const { endpoint, allKey, table } = config[entity as keyof typeof config];

  const [searchParams, setSearchParams] = useSearchParams(); // Para leer y actualizar la URL
  const { session } = authorizationStore();

  // Obtener los parámetros de la URL (page y limit)
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const service = searchParams.get("service") || "";
  const status = searchParams.get("status") || "";
  const pay_status = searchParams.get("pay_status") || "";
  const type = searchParams.get("type") || "";
  const maintenance = searchParams.get("maintenance") || "";
  const availability = searchParams.get("availability") || "";
  const rol = searchParams.get("rol") || "";
  const filters = searchParams.get("filters") || "";

  const [urlParams, setUrlParams] = useState({
    page,
    limit,
    totalPages: 1,
    service,
    pay_status,
    type,
    maintenance,
    availability,
    status,
    rol,
    filters,
  });

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlParamsValue] = useDebounce(urlParams, 500);

  const { logout } = authorizationStore();

  const navigate = useNavigate();

  // Obtener los datos de la entidad
  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, {
        headers: { Authorization: session },
        params: {
          page: urlParams.page,
          limit: urlParams.limit,
          service: urlParams.service,
          pay_status: urlParams.pay_status,
          status: urlParams.status,
          type: urlParams.type,
          maintenance: urlParams.maintenance,
          availability: urlParams.availability,
          rol: urlParams.rol,
          filters: urlParams.filters,
        },
      });

      if (res.status === 200) {
        setData(res.data[allKey]);
        setUrlParams({
          ...urlParams,
          totalPages: res?.data?.pagination?.totalPages,
        });

        if (res?.data?.pagination?.totalPages < urlParams.page) {
          handlePageChange(res?.data?.pagination?.totalPages);
        }
      }

      if (res.status === 401) {
        navigate("/authentication/login");
        logout();
        toast.warning(
          "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
        );
      }
    } catch (err) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." + err
      );
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar urlParams con searchParams
  useEffect(() => {
    const newParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      service: searchParams.get("service") || "",
      status: searchParams.get("status") || "",
      pay_status: searchParams.get("pay_status") || "",
      type: searchParams.get("type") || "",
      maintenance: searchParams.get("maintenance") || "",
      availability: searchParams.get("availability") || "",
      rol: searchParams.get("rol") || "",
      filters: searchParams.get("filters") || "",
    };

    setUrlParams((prev) => ({
      ...prev,
      page: parseInt(newParams.page, 10),
      limit: parseInt(newParams.limit, 10),
      service: newParams.service,
      status: newParams.status,
      pay_status: newParams.pay_status,
      type: newParams.type,
      maintenance: newParams.maintenance,
      availability: newParams.availability,
      rol: newParams.rol,
      filters: newParams.filters,
    }));

    setSearchParams({
      page: newParams.page,
      limit: newParams.limit,
      service: newParams.service,
      status: newParams.status,
      pay_status: newParams.pay_status,
      type: newParams.type,
      maintenance: newParams.maintenance,
      availability: newParams.availability,
      rol: newParams.rol,
      filters: newParams.filters,
    });
  }, [searchParams]);

  // Obtener datos cuando cambien los filtros o los parámetros de la URL
  useEffect(() => {
    getData();
  }, [
    urlParamsValue.page,
    urlParamsValue.limit,
    urlParamsValue.service,
    urlParamsValue.status,
    urlParamsValue.pay_status,
    urlParamsValue.type,
    urlParamsValue.maintenance,
    urlParamsValue.availability,
    urlParamsValue.rol,
    urlParamsValue.filters,
    entity,
  ]);

  const handlePageChange = (newPage: any) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage);
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (e: any) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("filters", e.target.value);
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans transition-colors duration-300">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <title>{table.name} | Panel de control</title>
        <div className="w-full flex flex-col justify-start items-center gap-5">
          <div className="w-full max-w-7xl flex justify-start items-center px-3 gap-3">
          <Input
            placeholder="Buscar registro"
            className="max-w-xl"
            radius="full"
            name="name"
            endContent={<FaSearch size={20} className="text-default-400" />}
            onChange={handleFilterChange}
          />
          <Button
            color="success"
            isIconOnly
            radius="full"
            as={Link}
            to={`/add/${entity}`}
          >
            <LuCircleFadingPlus className="text-white" size={25} />
          </Button>
        </div>
        <div className="w-full max-w-7xl flex justify-between items-center px-3 gap-3 overflow-x-auto scrollbar-hide">
          <Breadcrumbs
            variant="solid"
            radius="full"
            size="md"
            className="min-w-[200px] w-full"
          >
            <BreadcrumbItem>Registros</BreadcrumbItem>
            <BreadcrumbItem>{table.name}</BreadcrumbItem>
          </Breadcrumbs>
          <ParamsFilters />
        </div>
        {loading ? (
          <div className="flex flex-col gap-3 justify-center items-center h-[65vh]">
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              color="danger"
            />
            <p className="text-gray-400 text-base font-semibold">
              Cargando registros...
            </p>
          </div>
        ) : (
          <>
            {entity && ["product"].includes(entity) ? (
              // componente customizado para productos
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-7xl px-3">
                  {data.map((item: any, index: number) => (
                    <Card
                      className="hover:cursor-pointer"
                      key={index}
                      shadow="sm"
                    >
                      <CardBody className="p-0">
                        <Image
                          shadow="sm"
                          onClick={() => navigate(`/edit/${entity}/${item?.id}`)}
                          radius="lg"
                          width="100%"
                          alt={item?.name}
                          className="w-[200px] object-cover h-[200px]"
                          src={item?.front_image}
                        />
                      </CardBody>
                      <CardFooter className="text-small justify-between">
                        <p>
                          {item?.name?.substring(0, 22)}
                          {item?.name?.length > 22 && "..."}
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Table
                aria-label="table"
                className="max-w-7xl p-3 pt-0"
                isCompact
              >
                <TableHeader>
                  <>
                    {table.columns.map((item: any, index: number) => (
                      <TableColumn key={index}>
                        <span
                          className={`bg-transparent h-11 text-sm font-semibold text-gray-400`}
                        >
                          {item?.name}
                        </span>
                      </TableColumn>
                    ))}
                  </>
                </TableHeader>
                <TableBody>
                  {data.map((item: any, index: number) => (
                    <TableRow key={index} className="h-11">
                      {table.columns.map((column: any, index: number) => {
                        const cellValue = item[column.key]
                          ? item[column.key]
                          : item;
                        const displayValue = column.handlerValue
                          ? column.handlerValue(cellValue, item)
                          : cellValue;

                        return (
                          <TableCell key={index}>{displayValue}</TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {data?.length === 0 && (
              <div className="flex flex-col gap-3 justify-center items-center h-[40vh]">
                <PiWarningFill size={80} className="text-gray-400" />
                <p className="text-gray-400 text-xl font-semibold">
                  No hay registros para mostrar
                </p>
              </div>
            )}
          </>
        )}
        <Pagination
          total={urlParams.totalPages}
          initialPage={1}
          page={urlParams.page}
          color="danger"
          loop
          showControls
          variant="light"
          onChange={handlePageChange}
        />
        </div>
      </main>
    </div>
  );
}
