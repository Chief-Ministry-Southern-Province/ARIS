import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
  const handler = (e: Event) => {
    console.log("beforeinstallprompt fired");
    e.preventDefault();
    setPrompt(e);
  };

  window.addEventListener(
    "beforeinstallprompt",
    handler as EventListener
  );

  return () => {
    window.removeEventListener(
      "beforeinstallprompt",
      handler as EventListener
    );
  };
}, []);

  const install = async () => {
    if (!prompt) return;

    prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  if (!prompt) return null;

  return (
    <button onClick={install} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90">
      Install ARIS
    </button>
  );
}