import type { Institution } from "./Institution.type";
import type { Vehicle } from "./vehicle.type";
import type { User } from "./User.type";

export type Severity = "MINOR" | "MAJOR" | "FATAL";

export type RoadCondition =
  | "DRY"
  | "WET"
  | "FLOODED"
  | "GRAVEL"
  | "UNDER_CONSTRUCTION"
  | "OTHER";

export type WeatherCondition =
  | "SUNNY"
  | "RAINY"
  | "CLOUDY"
  | "FOGGY"
  | "WINDY"
  | "OTHER";

export type AccidentStatus =
  | "REPORTED"
  | "UNDER_INVESTIGATION"
  | "COMPLETED"
  | "CLOSED";

export interface Accident {
  id: number;

  reference_number: string;

  institution_id: number;

  reported_by: number;

  vehicle_id: number;

  driver_id: number | null;

  accident_date: string;

  accident_time: string;

  severity: Severity;

  province: string;

  district: string;

  location: string;

  latitude: number | null;

  longitude: number | null;

  injury_count: number;

  fatality_count: number;

  road_condition: RoadCondition;

  weather_condition: WeatherCondition;

  status: AccidentStatus;

  description: string | null;

  vehicle_damage: string | null;

  created_at: string;
  updated_at: string;
}

export interface AccidentResponse extends Accident {
  institution?: Institution;
  vehicle?: Vehicle;
  driver?: User | null;
  reporter?: User;
}

export interface CreateAccidentRequest {
  vehicle_id: number;

  driver_id?: number | null;

  accident_date: string;

  accident_time: string;

  severity: Severity;

  province: string;

  district: string;

  location: string;

  latitude?: number | null;

  longitude?: number | null;

  injury_count?: number;

  fatality_count?: number;

  road_condition: RoadCondition;

  weather_condition: WeatherCondition;

  description?: string | null;

  vehicle_damage?: string | null;
}

export interface UpdateAccidentRequest extends CreateAccidentRequest {
  status?: AccidentStatus;
}
