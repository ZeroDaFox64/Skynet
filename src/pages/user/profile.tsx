import { authorizationStore } from "../../store/authenticationStore";
import PassChange from "../../components/user/PasswordChange";
import UploadAvatar from "../../components/user/uploadAvatar";
import UserChange from "../../components/user/usernameChange";
import { Chip } from "@heroui/react";

import { BsPatchCheckFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";

function Dashboard() {
  const { user } = authorizationStore();

  return (
    <>
      <div className="w-full h-[calc(600px-64px)] gap-2 bg-gradient-to-br from-rose-300 to-violet-500 flex flex-col justify-center items-center">
        <UploadAvatar />
        <UserChange />
        <div className="text-center text-white text-base font-semibold mb-5">
          ¡Bienvenid@!
        </div>
        {user?.role === "superadmin" ? (
          <Chip
            color="warning"
            className="text-white"
            startContent={<FaCrown size={20} />}
          >
            <span className="font-semibold">Game Master</span>
          </Chip>
        ) : (
          <Chip
            color="primary"
            className="text-white"
            startContent={<BsPatchCheckFill size={20} />}
          >
            <span className="font-semibold">Verificado</span>
          </Chip>
        )}
      </div>
      <div className="flex flex-col items-center p-4 gap-16 mb-10">
        <div className="max-w-lg w-full flex flex-col gap-2">
          <p className="text-gray-400 text-base font-semibold">
            Correo electrónico
          </p>
          <p className="mb-2">{user?.email}</p>
        </div>
        <PassChange />
      </div>
    </>
  );
}

export default Dashboard;
