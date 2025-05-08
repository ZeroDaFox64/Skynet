import AdminDrawer from "./adminDrawer";
import ThemeSwitch from "../ui/ThemeSwith";
import LogoLink from "../ui/LogoLink";

export default function Dashboard() {
  return (
    <>
      <div className="w-full flex justify-between p-5">
        <LogoLink route="/dashboard"/>
        <div className="flex gap-3">
          <ThemeSwitch/>
          <AdminDrawer/>
        </div>
      </div>
    </>
  )
}
