import {
  ArrowLeft,
  Building2,
  Car,
  Pencil,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="space-y-1">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="text-sm font-semibold text-slate-800 wrap-break-word">
      {value || "-"}
    </p>
  </div>
);

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({
  title,
  icon,
  children,
}: SectionCardProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 bg-linear-to-r from-blue-900 to-blue-800 px-6 py-4">
      <div className="rounded-lg bg-blue-900 p-2 text-white">
        {icon}
      </div>

      <h2 className="font-semibold text-white">
        {title}
      </h2>
    </div>

    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function VehicleDetails() {
  const vehicle = {
    registrationNumber: "WP-CAB-1234",
    type: "Car",
    make: "Toyota",
    model: "Corolla",
    year: "2023",
    institution: "National Hospital Colombo",
    engineNumber: "ENG123456",
    chassisNumber: "CHS123456",
    insuranceNumber: "INS123456",
    insuranceExpiry: "2027-06-30",
    assignedDriver: "Kasun Perera",
    status: "Active",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-blue-900 to-blue-800 px-6 py-5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                <Car size={40} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {vehicle.registrationNumber}
                </h1>

                <p className="mt-1 text-blue-100">
                  {vehicle.make} {vehicle.model}
                </p>

                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="
                  flex items-center justify-center gap-2
                  rounded-lg
                  border border-white/20
                  bg-white/10
                  px-4 py-2
                  text-white
                  hover:bg-white/20
                  transition-colors
                "
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                className="
                  flex items-center justify-center gap-2
                  rounded-lg
                  bg-white
                  px-4 py-2
                  font-medium
                  text-blue-800
                  hover:bg-slate-100
                  transition-colors
                "
              >
                <Pencil size={18} />
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-200 p-6 md:grid-cols-4">
          <DetailItem
            label="Vehicle Type"
            value={vehicle.type}
          />

          <DetailItem
            label="Year"
            value={vehicle.year}
          />

          <DetailItem
            label="Driver"
            value={vehicle.assignedDriver}
          />

          <DetailItem
            label="Institution"
            value={vehicle.institution}
          />
        </div>
      </div>

      {/* Vehicle Information */}
      <SectionCard
        title="Vehicle Information"
        icon={<Car size={18} />}
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            label="Registration Number"
            value={vehicle.registrationNumber}
          />

          <DetailItem
            label="Vehicle Type"
            value={vehicle.type}
          />

          <DetailItem
            label="Institution"
            value={vehicle.institution}
          />

          <DetailItem
            label="Make"
            value={vehicle.make}
          />

          <DetailItem
            label="Model"
            value={vehicle.model}
          />

          <DetailItem
            label="Year"
            value={vehicle.year}
          />
        </div>
      </SectionCard>

      {/* Institution Information */}
      <SectionCard
        title="Institution Information"
        icon={<Building2 size={18} />}
      >
        <DetailItem
          label="Institution Name"
          value={vehicle.institution}
        />
      </SectionCard>

      {/* Technical Information */}
      <SectionCard
        title="Technical Information"
        icon={<Wrench size={18} />}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem
            label="Engine Number"
            value={vehicle.engineNumber}
          />

          <DetailItem
            label="Chassis Number"
            value={vehicle.chassisNumber}
          />
        </div>
      </SectionCard>

      {/* Insurance Information */}
      <SectionCard
        title="Insurance Information"
        icon={<ShieldCheck size={18} />}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem
            label="Insurance Number"
            value={vehicle.insuranceNumber}
          />

          <DetailItem
            label="Insurance Expiry Date"
            value={vehicle.insuranceExpiry}
          />
        </div>
      </SectionCard>

      {/* Driver Information */}
      <SectionCard
        title="Assigned Driver"
        icon={<User size={18} />}
      >
        <DetailItem
          label="Driver Name"
          value={vehicle.assignedDriver}
        />
      </SectionCard>
    </div>
  );
}