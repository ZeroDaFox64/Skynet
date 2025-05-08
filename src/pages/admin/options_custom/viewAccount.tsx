/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { api } from "../../../libs/api";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { authorizationStore } from "../../../store/authenticationStore";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import moment from "moment";

export default function ViewAccount() {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [subscriptions, setSubscriptions] = useState<any>([]);

  const navigate = useNavigate();
  const { session } = authorizationStore();

  const getData = useCallback(async () => {
    try {
      const res = await api.get(`/account/${id}`, {
        headers: { Authorization: session },
      });

      const service = await api.get(`/service/${res?.data?.account?.service}`, {
        headers: { Authorization: session },
      });

      const provider = await api.get(`/provider/${res?.data?.account?.provider}`, {
        headers: { Authorization: session },
      });

      if (provider.status === 200 && res.status === 200 && service.status === 200) {
        setData({ ...res?.data?.account, provider: provider?.data?.provider, service: service?.data?.service });

        const getSubscription = async (id: string) => {
          try {
            const subRes = await api.get(`/subscription/${id}`, {
              headers: { Authorization: session },
            });
            return subRes?.data?.subscription;
          } catch (error) {
            console.error(`Error sincronizando suscripción ${id}:`, error);
            return
          }
        };

        // Usar Promise.all para manejar las llamadas en paralelo
        const subscriptionPromises = res?.data?.account?.users?.map((subscription: any) => getSubscription(subscription));
        const subscriptions = await Promise.all(subscriptionPromises);

        // Filtrar posibles valores nulos si hubo errores
        setSubscriptions(subscriptions);
      }

    } catch (err: any) {
      toast.error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." + err
      );
    }
  }, [id, session]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="w-full flex justify-center items-center px-3 mb-10">
        <Card className="w-full max-w-xl p-2">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-3xl font-bold mb-4">Información de la cuenta</h3>
            <p className="text-sm text-gray-500">
              F. contrato: {data?.contract_date} | F. vencimiento: {data?.cutoff_date}
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat">{data?.service?.name}</Chip>
              <Chip color="primary" variant="flat">{data?.type === 'shared' ? 'Compartida' : 'Individual'}</Chip>
              <Chip color="primary" variant="flat">
                {(() => {
                  switch (data?.availability) {
                    case 'full':
                      return 'Llena';
                    case 'partial':
                      return 'Parcial';
                    case 'empty':
                      return 'Vacia';
                    default:
                      return 'Desconocido';
                  }
                })()}
              </Chip>
              <Chip color="primary" variant="flat">
                {(() => {
                  switch (data?.status) {
                    case 'available':
                      return 'Activa';
                    case 'under_review':
                      return 'En revision';
                    case 'expired':
                      return 'Vencida';
                    default:
                      return 'Desconocido';
                  }
                })()}
              </Chip>
              <Chip color="primary" variant="flat">{data?.maintenance === 'true' ? 'En espera' : 'Listo'}</Chip>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="font-semibold">Correo:</span>
                <p> {data?.email}</p>
              </div>
              <div>
                <span className="font-semibold">Contraseña:</span>
                <p> {data?.password}</p>
              </div>
              <div>
                <span className="font-semibold">Proveedor:</span>
                <p> {data?.provider?.name}</p>
              </div>
              <div>
                <span className="font-semibold">Suscripciones activas:</span>
                <p>{data?.users?.length}/5</p>
              </div>
              <div>
                <span className="font-semibold">Dias restantes:</span>
                <p>{moment(data?.cutoff_date).diff(moment(), "days")} días</p>
              </div>
              {data?.observations && <p>Observaciones: {data?.observations}</p>}
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Suscripciones asociadas:</p>
            <Table isCompact>
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Fecha de inicio</TableColumn>
                <TableColumn>Fecha de fin</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Ver detalles</TableColumn>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{subscription?.nickname}</TableCell>
                    <TableCell>{subscription?.contract_date}</TableCell>
                    <TableCell>{subscription?.cutoff_date}</TableCell>
                    <TableCell>{subscription?.pay_status}</TableCell>
                    <TableCell>
                      <Link to={`/view/subscription/${subscription?._id}`} className="text-primary-500 text-sm text-underline">
                        Ver más
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardBody>
          <CardFooter className="flex gap-3 justify-end">
            <Button onPress={() => navigate(-1)}>
              Regresar
            </Button>
            <Button color="danger" variant="flat">Migrar usuarios</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}