import type { CreateVehicleRequest } from "@/types/vehicle.type";

export const VEHICLE_TYPES = [
  { value: "CAR", label: "Car" },
  { value: "VAN", label: "Van" },
  { value: "BUS", label: "Bus" },
  { value: "TRUCK", label: "Truck" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "CAB", label: "Cab" },
  { value: "THREE_WHEELER", label: "Three Wheeler" },
  { value: "BOWSER", label: "Bowser" },
  { value: "AMBULANCE", label: "Ambulance" },
  { value: "OTHER", label: "Other" },
];

export const FUEL_TYPES = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ELECTRIC", label: "Electric" },
];

export const VEHICLE_STATUS = [
  { value: "ACTIVE", label: "Active" },
  {
    value: "UNDER_MAINTENANCE",
    label: "Under Maintenance",
  },
  {
    value: "OUT_OF_SERVICE",
    label: "Out of Service",
  },
  {
    value: "DISPOSED",
    label: "Disposed",
  },
];

export const initialValues: CreateVehicleRequest = {
  vehicle_number: "",
  registered_date: "",

  vehicle_type: "CAR",

  brand: "",
  model: "",

  manufactured_year: new Date().getFullYear(),

  engine_number: "",
  chassis_number: "",

  insurance_number: "",
  insurance_expiry_date: "",

  registered_owner: "",
  value: 0,

  fuel_type: "PETROL",

  status: "ACTIVE",

  institution_id: undefined,
};
