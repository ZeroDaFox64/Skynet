import { useNavigate } from "react-router";

export default function App({route} : {route: string}) {
  const navigate = useNavigate();

  return (
    <img
      src={"/logo.png"}
      alt="logo"
      className="h-8 min-w-[116px] w-auto cursor-pointer"
      onClick={() => navigate(route)}
    />
  );
}
