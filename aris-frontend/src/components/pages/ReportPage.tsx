import { AlertCircle, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ChangeEvent, useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { TextAreaField } from "../atoms/TextAreaField";
import { ImageUploadField } from "@/components/molecules/ImageUploadField";
import { useCurrentLocation } from "@/hooks/useGetCurrentLiveLocation";
import { useCreateAccident } from "@/hooks/useAccident";
import { useGetVehicles } from "@/hooks/useVehicle";
import type { CreateAccidentRequest } from "@/types/accident.type";
import { SRI_LANKA_PROVINCES, DISTRICTS_BY_PROVINCE } from "@/constants/sriLankaLocations";
const ReportPage = () => {

  const { t } = useTranslation();
  const { loadingLocation, getCurrentLocation } = useCurrentLocation();
  const { createAccidentData, loading: submitting, error: submitError } = useCreateAccident();
  const { fetchVehicles, vehicles } = useGetVehicles();

  const [districts, setDistricts] = useState<string[]>([]);

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles({ page: 1, search: "" });
  }, []);

  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    province: "",
    district: "",
    vehicle_id: "",
    driver_id: "",
    fatality_count: "",
    injury_count: "",
    severity: "",
    description: "",
    vehicleDamage: "",
    road_condition: "",
    weather_condition: "",
    mapLocation: "",
    latitude: "",
    longitude: "",
    evidenceImages: [] as File[]
  });

  useEffect(() => {
    if (form.province) {
      setDistricts(DISTRICTS_BY_PROVINCE[form.province as keyof typeof DISTRICTS_BY_PROVINCE] ?? []);
    } else {
      setDistricts([]);
    }
  }, [form.province]);

  useEffect(() => {
    fetchVehicles({ page: 1, search: "" });
  }, []);

  const [successMessage, setSuccessMessage] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Auto-select driver when vehicle is selected
  const handleVehicleChange = (vehicleId: string) => {
    update("vehicle_id", vehicleId);

    const selectedVehicle = vehicles.find(
      (v) => v.id === Number(vehicleId)
    );

    if (selectedVehicle?.driver_id) {
      update("driver_id", String(selectedVehicle.driver_id));
    } else {
      update("driver_id", "");
    }
  };

  const handleGetLocation = async () => {
    try {
      const data = await getCurrentLocation();

      setForm((prev) => ({
        ...prev,
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
      }));
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    setSuccessMessage("");

    const payload: CreateAccidentRequest = {
      vehicle_id: Number(form.vehicle_id),
      driver_id: form.driver_id ? Number(form.driver_id) : null,
      accident_date: form.date,
      accident_time: form.time,
      severity: form.severity as CreateAccidentRequest["severity"],
      province: form.province,
      district: form.district,
      location: form.location,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      injury_count: form.injury_count ? Number(form.injury_count) : 0,
      fatality_count: form.fatality_count ? Number(form.fatality_count) : 0,
      road_condition: form.road_condition as CreateAccidentRequest["road_condition"],
      weather_condition: form.weather_condition as CreateAccidentRequest["weather_condition"],
      description: form.description || null,
      vehicle_damage: form.vehicleDamage || null,
    };

    try {
      await createAccidentData(payload);
      setSuccessMessage("Accident report submitted successfully!");

      // Reset form
      setForm({
        date: "",
        time: "",
        location: "",
        province: "",
        district: "",
        vehicle_id: "",
        driver_id: "",
        fatality_count: "",
        injury_count: "",
        severity: "",
        description: "",
        vehicleDamage: "",
        road_condition: "",
        weather_condition: "",
        mapLocation: "",
        latitude: "",
        longitude: "",
        evidenceImages: [],
      });
    } catch {
      // error is handled by the hook
    }
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-blue-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("report.incidentDetails")}
            </h1>

            <p className="text-sm text-slate-500">
              Record and submit vehicle accident details
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
          {submitError}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          <FormField label={t("report.accidentDate")} required>
            <InputField
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </FormField>

          <FormField label={t("report.accidentTime")} required>
            <InputField
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </FormField>
        </div>

        {/* Location */}
        <FormField label={t("report.exactLocation")} required>
          <div className="flex gap-2">
            <InputField
              type="text"
              placeholder={t("report.locationPlaceholder")}
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLocation}
              className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50"
              title="Get GPS Location"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </FormField>

        {/* Province & District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("report.province")}>
            <SelectField
              value={form.province}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => update("province", e.target.value)}
              options={SRI_LANKA_PROVINCES.map((province) => ({
                value: province,
                label: province
              }))}
            />
          </FormField>

          <FormField label={t("report.district")}>
            <SelectField
              value={form.district}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => update("district", e.target.value)}
              options={districts.map((district) => ({
                value: district,
                label: district
              }))}
            />
          </FormField>
        </div>

        {/* GPS Display */}
        <div className="w-full h-48 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-blue-300 mx-auto mb-2" />

            <p className="text-sm text-blue-500">
              {loadingLocation
                ? "Getting current location..."
                : "Current GPS Location"}
            </p>

            <p className="text-xs text-blue-400 mt-2">
              Latitude: {form.latitude || "--"}
            </p>

            <p className="text-xs text-blue-400">
              Longitude: {form.longitude || "--"}
            </p>
          </div>
        </div>

        {/* Vehicle & Driver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("report.vehicleRegistration")} required>
            <SelectField
              value={form.vehicle_id}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleVehicleChange(e.target.value)}
              options={vehicles.map((vehicle) => ({
                value: String(vehicle.id),
                label: `${vehicle.vehicle_number} — ${vehicle.brand} ${vehicle.model}`
              }))}
            />
          </FormField>

          <FormField label={t("report.driver")}>
            <InputField
              type="text"
              value={
                form.driver_id
                  ? vehicles.find((v) => v.driver_id === Number(form.driver_id))?.driver?.name || `Driver ID: ${form.driver_id}`
                  : "No driver assigned"
              }
              disabled
            />
          </FormField>
        </div>

        {/* Casualties & Severity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label={t("report.casualties")}>
            <InputField
              type="number"
              min="0"
              value={form.fatality_count}
              onChange={(e) =>
                update("fatality_count", e.target.value)
              }
            />
          </FormField>

          <FormField label={t("report.injuries")}>
            <InputField
              type="number"
              min="0"
              value={form.injury_count}
              onChange={(e) =>
                update("injury_count", e.target.value)
              }
            />
          </FormField>

          <FormField label={t("report.severity")} required>
            <SelectField
              value={form.severity}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => update("severity", e.target.value)}
              options={["MINOR", "MAJOR", "FATAL"].map((severity) => ({
                value: severity,
                label: severity.charAt(0) + severity.slice(1).toLowerCase()
              }))}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField
          label={t("report.accidentDescription")}
        >
          <TextAreaField
            rows={4}
            placeholder={t(
              "report.accidentDescriptionPlaceholder"
            )}
            value={form.description}
            onChange={(e) =>
              update("description", e.target.value)
            }
          />
        </FormField>

        {/* Road Condition & Weather Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("report.roadCondition")} required>
            <SelectField
              value={form.road_condition}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => update("road_condition", e.target.value)}
              options={[
                "DRY",
                "WET",
                "FLOODED",
                "GRAVEL",
                "UNDER_CONSTRUCTION",
                "OTHER"
              ].map((condition) => ({
                value: condition,
                label: condition.replace(/_/g, " ").charAt(0) + condition.replace(/_/g, " ").slice(1).toLowerCase()
              }))}
            />
          </FormField>

          <FormField label="Weather Condition" required>
            <SelectField
              value={form.weather_condition}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => update("weather_condition", e.target.value)}
              options={[
                "SUNNY",
                "RAINY",
                "CLOUDY",
                "FOGGY",
                "WINDY",
                "OTHER"
              ].map((weather) => ({
                value: weather,
                label: weather.charAt(0) + weather.slice(1).toLowerCase()
              }))}
            />
          </FormField>
        </div>

        {/* Vehicle Damage */}
        <FormField label={t("report.vehicleDamage")}>
          <TextAreaField
            rows={2}
            value={form.vehicleDamage}
            onChange={(e) =>
              update("vehicleDamage", e.target.value)
            }
          />
        </FormField>

        {/* Evidence Images */}
        <FormField label={t("report.evidenceImages")}>
          <ImageUploadField
            onChange={(files) =>
              setForm((prev) => ({
                ...prev,
                evidenceImages: files,
              }))
            }
          />
        </FormField>

        {/* Submit */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              t("btn.submit")
            )}
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default ReportPage;