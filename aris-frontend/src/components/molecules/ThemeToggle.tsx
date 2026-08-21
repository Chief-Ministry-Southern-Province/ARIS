import { Check, Laptop, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types/theme.type';

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
];

export const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 transition-colors hover:bg-muted" aria-label="Choose colour theme" aria-expanded={open}>
        <CurrentIcon className="h-5 w-5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-36 rounded-xl border border-border bg-popover p-1 shadow-lg">
          {options.map(({ value, label, icon: Icon }) => (
            <button key={value} type="button" onClick={() => { setTheme(value); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted">
              <Icon className="h-4 w-4" />{label}{theme === value && <Check className="ml-auto h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
