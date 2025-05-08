/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import moment from "moment";

import { FaWhatsapp } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";

export default function App({ data }: { data: any }) {
    const { onClose } = useDisclosure();

    const type = data?.type === "shared" ? "Cuenta compartida" : "Cuenta personal";

    const message = `
📋 *¡Tu suscripción está lista!* 📋

👤 *USUARIO PRINCIPAL*: 
- Teléfono: ${data?.user?.phone || 'No registrado'}
- Email: ${data?.user?.email || 'No registrado'}

🔑 *CREDENCIALES*: 
- Correo: ${data?.account?.email}
- Contraseña: ${data?.account?.password}
${data?.pin ? `- PIN: ${data?.pin}
` : ``}
🎬 *SERVICIO*: 
- ${data?.service?.name}
- Tipo: ${type}
  
📅 *PERIODO DE CONTRATO*: 
- Fecha de inicio: ${data?.contract_date ? moment(data?.contract_date).format("DD/MM/YYYY") : "-"}
- Fecha de corte: ${data?.cutoff_date ? moment(data?.cutoff_date).format("DD/MM/YYYY") : "-"}
  
${data?.cutoff_date > moment().format("YYYY-MM-DD") ? `Te quedan ${moment(data?.cutoff_date).diff(moment(), "days")} días de suscripción.` : "*SUSCRIPCION VENCIDA*"}
  
✨ *¡Gracias por preferirnos!* ✨  
Si necesitas ayuda, responde a este mensaje. ¡Estamos aquí para ayudarte!`;

    const encodeMessage = encodeURIComponent(message);

    return (
        <Modal defaultOpen onClose={onClose} backdrop="blur" isDismissable={false}>
            <ModalBody>
                <ModalContent>
                    <ModalHeader className="text-center font-bold text-xl flex items-center gap-2">
                        <IoBagCheck size={25} /> Suscripción creada
                    </ModalHeader>
                    <ModalBody>
                        <p>Se ha creado una nueva suscripción de <span className="font-semibold">{data?.service?.name}</span> para el usuario <span className="font-semibold">{data?.user?.email}</span></p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onPress={() => { navigator.clipboard.writeText(message); }}
                            variant="flat"
                            color="primary"
                            className="font-semibold"
                            fullWidth
                        >
                            Copiar datos <FaRegCopy size={18} />
                        </Button>
                        <Button
                            onPress={() => {
                                const phone = data?.user?.phone.replace(/\D/g, '');
                                window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeMessage}`);
                            }}
                            variant="flat"
                            color="success"
                            className="font-semibold"
                            fullWidth
                        >
                            Enviar mensaje <FaWhatsapp size={20} />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </ModalBody>
        </Modal>
    )
}