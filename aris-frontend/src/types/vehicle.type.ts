import type { Institution } from "./Institution.type";
import type {User} from "./User.type";  

export type VehicleType =
  | "CAR"
  | "VAN"
  | "BUS"
  | "TRUCK"
  | "MOTORCYCLE"
  | "CAB"
  | "THREE_WHEELER"
  | "BOWSER"
  | "AMBULANCE"
  | "OTHER";

export type FuelType =
  | "PETROL"
  | "DIESEL"
  | "HYBRID"
  | "ELECTRIC";

export type VehicleStatus =
  | "ACTIVE"
  | "UNDER_MAINTENANCE"
  | "OUT_OF_SERVICE"
  | "DISPOSED";

export interface Vehicle {
  id: number;

  vehicle_number: string;
  registered_date: string | null;

  vehicle_type: VehicleType;

  brand: string;
  model: string;

  manufactured_year: number;

  engine_number: string;
  chassis_number: string;

  insurance_number: string;
  insurance_expiry_date: string;

  value: number | null;

  registered_owner: string;

  fuel_type: FuelType;

  status: VehicleStatus;

  institution_id: number;

  driver_id: number | null;

  created_at: string;
  updated_at: string;
}

export interface VehicleResponse {
  id: number;

  vehicle_number: string;
  registered_date: string | null;

  vehicle_type: VehicleType;

  brand: string;
  model: string;

  manufactured_year: number;

  engine_number: string;
  chassis_number: string;

  insurance_number: string;
  insurance_expiry_date: string;

  value: number | null;

  registered_owner: string;

  fuel_type: FuelType;

  status: VehicleStatus;

  institution_id: number;

  driver_id: number | null;

  created_at: string;
  updated_at: string;

  institution?: Institution;
  driver?: User | null;
}

export interface CreateVehicleRequest {
  vehicle_number: string;

  registered_date?: string;

  vehicle_type: VehicleType;

  driver_id?: number;

  brand: string;

  model: string;

  manufactured_year: number;

  engine_number: string;

  chassis_number: string;

  insurance_number: string;

  insurance_expiry_date: string;

  value?: number;

  registered_owner: string;

  fuel_type: FuelType;

  status?: VehicleStatus;

  institution_id?: number;
}

export interface UpdateVehicleRequest {
  vehicle_number: string;

  registered_date?: string;

  vehicle_type: VehicleType;

  brand: string;

  model: string;

  manufactured_year: number;

  engine_number: string;

  chassis_number: string;

  insurance_number: string;

  insurance_expiry_date: string;

  value?: number;

  registered_owner: string;

  fuel_type: FuelType;

  status?: VehicleStatus;

  institution_id?: number;

  driver_id?: number;
} 