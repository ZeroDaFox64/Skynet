import {Switch} from "@heroui/react";
import { IoIosSunny, IoIosMoon } from "react-icons/io";
import {useTheme} from "next-themes";

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <Switch
      defaultSelected
      color="danger"
      size="lg"
      isSelected={theme === "light"}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <IoIosSunny className={'text-danger'} />
        ) : (
          <IoIosMoon className={className} />
        )
      }
    >
    </Switch>
  );
}
