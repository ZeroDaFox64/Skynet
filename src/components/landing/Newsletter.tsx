import { Button, Input } from "@heroui/react";
import { toast } from "sonner";
import { IoMailUnread } from "react-icons/io5";
import { useState } from "react";

export default function Newsletter({ ContainerStyles = "" }: { ContainerStyles?: string }) {
    const [email, setEmail] = useState("");
    const [preference, setPreference] = useState<string[]>([]);

    const handlePreferences = (prefer : string) => {
        let newPreferences;

        if (preference.includes(prefer)) {
            newPreferences = preference.filter(item => item !== prefer);
        } else {
            newPreferences = [...preference, prefer];
        }

        setPreference(newPreferences);
    };

    console.log(email);

    return (
        <div className={`w-full flex justify-center ${ContainerStyles} p-3`}>
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3  items-center border-1 border-gray-200 dark:border-gray-900 rounded-2xl overflow-hidden">
                <div className="flex flex-col gap-5 py-5 px-5 col-span-2">
                    <p className="text-4xl font-bold w-full">
                        <span className="text-store">Únete a nuestra</span> newsletter
                    </p>
                    <p className="text-gray-400 w-full">
                        Recibe las últimas novedades, ofertas exclusivas y noticias sobre tus mangas, animes y videojuegos favoritos.
                    </p>
                    <div className="flex gap-2 flex-col w-full">
                        <p className="mb-1">¿Qué te interesa?</p>
                        <div className="flex gap-2 flex-wrap">
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Mangas') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Mangas')}>Mangas</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Figuras') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Figuras')}>Figuras</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Crunchyroll') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Crunchyroll')}>Crunchyroll</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Streaming') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Streaming')}>Streaming</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Ropa') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Ropa')}>Ropa</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Posters') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Posters')}>Posters</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('GiftCards') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('GiftCards')}>GiftCards</Button>
                            <Button size="sm" className={`dark:border-white font-semibold border-1 ${preference.includes('Recargas') ? 'bg-danger' : ''}`} variant="bordered" onPress={() => handlePreferences('Recargas')}>Recargas</Button>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full flex-col items-end">
                        <Input type="email" className="max-w-xl" label="Correo electrónico" labelPlacement="outside" placeholder="hola@nittogame.com" onChange={(e) => setEmail(e.target.value)} />
                        <Button endContent={<IoMailUnread size={20} />} color="danger" className="font-semibold max-w-44" onPress={() => toast.success('Gracias por suscribirte')} >Suscribirme</Button>
                    </div>
                </div>
                <div className="col-span-1">
                    <img src="/newsletter.webp" alt="Newsletter" className="w-full h-[410px] object-cover"/>
                </div>
            </div>
        </div>
    )
}