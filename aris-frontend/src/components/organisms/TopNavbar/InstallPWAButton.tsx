import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWAButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
      alert("PWA EVENT FIRED");
      e.preventDefault();
      setPrompt(beforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;

    prompt.prompt();

    const result = await prompt.userChoice;

    console.log(result);
  };

  return (
    <button
      disabled={!prompt}
      onClick={install}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {prompt
        ? "Install ARIS"
        : "PWA Ready"}
    </button>
  );
}