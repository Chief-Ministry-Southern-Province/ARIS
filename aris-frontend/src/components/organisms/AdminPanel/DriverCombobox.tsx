import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

const drivers = [
  { value: "1", label: "John Silva" },
  { value: "2", label: "Kasun Perera" },
  { value: "3", label: "Nimal Fernando" },
];

export function DriverCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
      >
        {value
          ? drivers.find((driver) => driver.value === value)?.label
          : "Search and select driver"}
        <ChevronsUpDown className="w-4 h-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Search driver..."
            className="w-full px-3 py-2 border-b outline-none"
            onChange={(e) => {
              const search = e.target.value.toLowerCase();
              const items = document.querySelectorAll(".driver-item");

              items.forEach((item) => {
                const text = item.textContent?.toLowerCase() || "";
                (item as HTMLElement).style.display = text.includes(search)
                  ? "flex"
                  : "none";
              });
            }}
          />

          <div className="max-h-60 overflow-y-auto">
            {drivers.map((driver) => (
              <button
                key={driver.value}
                type="button"
                onClick={() => {
                  setValue(driver.value);
                  setOpen(false);
                }}
                className="driver-item w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100"
              >
                {driver.label}

                {value === driver.value && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}