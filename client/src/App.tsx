import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

function App() {
  const { theme, themeColor } = useContext(ThemeContext)!;
  return (
    <div className={`${theme} ${themeColor} bg-themedBg flex min-h-screen`}>
      <h1 className="text-primary">{theme}</h1>
    </div>
  );
}

export default App;
