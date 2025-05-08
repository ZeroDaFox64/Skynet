import {Switch} from "@heroui/react";
import { IoIosSunny, IoIosMoon } from "react-icons/io";
import {useTheme} from "next-themes";

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <Switch
      defaultSelected
      color="default"
      size="lg"
      isSelected={theme === "light"}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <IoIosSunny/>
        ) : (
          <IoIosMoon className={className} />
        )
      }
    >
    </Switch>
  );
}
