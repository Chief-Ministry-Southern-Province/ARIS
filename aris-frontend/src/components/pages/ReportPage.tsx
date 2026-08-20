import { AlertCircle, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ChangeEvent, useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { ImageUploadField } from "@/components/molecules/ImageUploadField";
import { useCurrentLocation } from "@/hooks/useGetCurrentLiveLocation";
import { useCreateAccidentMutation } from "@/hooks/mutations/useResourceMutations";
import { useUpdateAccidentMutation } from "@/hooks/mutations/useResourceMutations";
import { useVehicles } from "@/hooks/queries/useVehicleQueries";
import { useCase } from "@/hooks/queries/useCaseQueries";
import { useAccident } from "@/hooks/queries/useAccidentQueries";
import type { CreateAccidentRequest, UpdateAccidentRequest } from "@/types/accident.type";
import { Checkbox } from "@/components/atoms/Checkbox";
import LocationPicker from "@/components/maps/LocationPicker";
import { reverseGeocode } from "@/services/geocoding.service";
import { mapSriLankaLocation } from "@/utils/locationMapper";
import { useEvidenceUploadMutation } from "@/hooks/mutations/useEvidenceUploadMutation";

import { useAuth } from "@/context/auth/AuthContext";

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type ReportPageProps = {
  mode?: "create" | "edit";
};

const ReportPage = ({ mode = "create" }: ReportPageProps) => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const isEditing = mode === "edit";
  const numericCaseId = Number(caseId);
  const { loadingLocation, getCurrentLocation } = useCurrentLocation();
  const { role, id: userId } = useAuth();
  const isDriver = role.includes("driver");

  const [vehicleSearch, setVehicleSearch] = useState("");
  const { data: vehicleResponse } = useVehicles(1, vehicleSearch);
  const vehicles = vehicleResponse?.data ?? [];
  const { data: accidentCase, isLoading: loadingCase } = useCase(isEditing ? numericCaseId : undefined);
  const accidentId = accidentCase?.accident?.id;
  const { data: existingAccident, isLoading: loadingAccident, error: accidentError } = useAccident(isEditing ? accidentId : undefined);
  const { mutateAsync: createAccidentData, isPending: creating, error: createMutationError } = useCreateAccidentMutation();
  const { mutateAsync: updateAccidentData, isPending: updating, error: updateMutationError } = useUpdateAccidentMutation();
  const { mutateAsync: uploadEvidenceFiles, isPending: uploadingEvidence } = useEvidenceUploadMutation();
  const submitting = creating || updating || uploadingEvidence;
  const submitMutationError = updateMutationError ?? createMutationError;
  const submitError = submitMutationError instanceof Error ? submitMutationError.message : "";


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
    road_condition: "",
    weather_condition: "",
    mapLocation: "",
    latitude: "",
    longitude: "",
    has_travel_permission: false,
    files: [] as File[]
  });

   
  useEffect(() => {
    if (!isDriver || vehicles.length === 0) return;

    const assignedVehicle = vehicles[0];

    setForm(prev => ({
        ...prev,
        driver_id: userId === null ? "" : String(userId),
        vehicle_id: String(assignedVehicle.id),
    }));
}, [vehicles, userId, isDriver]);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isEditing || !existingAccident) return;

    setForm({
      date: existingAccident.accident_date.slice(0, 10),
      time: existingAccident.accident_time.slice(0, 5),
      location: existingAccident.location,
      province: existingAccident.province,
      district: existingAccident.district,
      vehicle_id: String(existingAccident.vehicle_id),
      driver_id: existingAccident.driver_id ? String(existingAccident.driver_id) : "",
      fatality_count: String(existingAccident.fatality_count ?? 0),
      injury_count: String(existingAccident.injury_count ?? 0),
      severity: existingAccident.severity,
      road_condition: existingAccident.road_condition,
      weather_condition: existingAccident.weather_condition,
      mapLocation: "",
      latitude: existingAccident.latitude === null ? "" : String(existingAccident.latitude),
      longitude: existingAccident.longitude === null ? "" : String(existingAccident.longitude),
      has_travel_permission: Boolean(existingAccident.has_travel_permission),
      files: [],
    });
  }, [isEditing, existingAccident]);

  function update(field: string, value: any) {
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

  // Used by the driver's "Get GPS Location" pin button.
  // Auto-fills lat/lng/location AND reverse-geocodes province/district.
  const handleGetLocation = async () => {
    try {
      const data = await getCurrentLocation();

      let province = "";
      let district = "";

      try {
        const geo = await reverseGeocode(Number(data.latitude), Number(data.longitude));
        const mapped = mapSriLankaLocation(geo.address);
        province = mapped.province;
        district = mapped.district;
      } catch (geoError) {
        console.error("Reverse geocoding failed:", geoError);
      }

      setForm((prev) => ({
        ...prev,
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        province,
        district,
      }));
    } catch (error) {
      alert(error);
    }
  };

  // Used by the subject officer's map/search picker.
  const handleMapLocationSelect = (location: {
    latitude: string;
    longitude: string;
    address: string;
    province: string;
    district: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      location: location.address,
      province: location.province,
      district: location.district,
    }));
  };

  const buildFormData = (payload: CreateAccidentRequest): FormData => {
    const formData = new FormData();

    formData.append("vehicle_id", String(payload.vehicle_id));

    if (payload.driver_id !== null && payload.driver_id !== undefined) {
      formData.append("driver_id", String(payload.driver_id));
    }

    formData.append("accident_date", payload.accident_date ?? "");
    formData.append("accident_time", payload.accident_time ?? "");
    formData.append("severity", payload.severity ?? "");
    formData.append("province", payload.province ?? "");
    formData.append("district", payload.district ?? "");
    formData.append("location", payload.location ?? "");

    if (payload.latitude !== null && payload.latitude !== undefined) {
      formData.append("latitude", String(payload.latitude));
    }
    if (payload.longitude !== null && payload.longitude !== undefined) {
      formData.append("longitude", String(payload.longitude));
    }

    formData.append("injury_count", String(payload.injury_count ?? 0));
    formData.append("fatality_count", String(payload.fatality_count ?? 0));
    formData.append("road_condition", payload.road_condition ?? "");
    formData.append("weather_condition", payload.weather_condition ?? "");
    formData.append("has_travel_permission", payload.has_travel_permission ? "1" : "0");

    (payload.files ?? []).forEach((file) => {
      formData.append("files[]", file);
    });

    return formData;
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
      has_travel_permission: form.has_travel_permission,
      files: form.files,
    };

    try {
      if (isEditing) {
        if (!existingAccident) return;

        const { files: _files, ...updatePayload } = payload;
        await updateAccidentData({
          id: existingAccident.id,
          data: updatePayload as UpdateAccidentRequest,
        });

        if (form.files.length > 0) {
          await uploadEvidenceFiles({ accidentId: existingAccident.id, files: form.files });
        }

        toast.success("Accident details updated successfully!");
        navigate(`/cases/${numericCaseId}/details?tab=Details`);
        return;
      }

      const formData = buildFormData(payload);
      await createAccidentData(formData as unknown as CreateAccidentRequest);
      
      toast.success("Accident report submitted successfully!");
      setSuccessMessage("Accident report submitted successfully!");

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
        road_condition: "",
        weather_condition: "",
        mapLocation: "",
        latitude: "",
        longitude: "",
        files: [],
        has_travel_permission: false,
      });
    } catch {
      // error is handled by the hook
    }
  };

  if (isEditing && (loadingCase || loadingAccident)) {
    return <div className="py-12 text-center text-sm text-slate-500">Loading accident details...</div>;
  }

  if (isEditing && (!existingAccident || accidentError)) {
    return <div className="py-12 text-center text-sm font-medium text-red-600">Unable to load accident details for editing.</div>;
  }

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
              {isEditing ? "Update accident details" : t("report.incidentDetails")}
            </h1>

            <p className="text-sm text-slate-500">
              {t("report.subtitle")}
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


          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Checkbox
              name="has_travel_permission"
              checked={form.has_travel_permission}
              onChange={(e) =>
                update(
                  "has_travel_permission",
                  (e.target as HTMLInputElement).checked
                )
              }
            />

            <div className="flex flex-col">
              <label
                htmlFor="has_travel_permission"
                className="cursor-pointer text-sm font-medium text-gray-900"
              >
                {t("report.journeyAuthorized.label")}
              </label>
              <p className="text-xs text-gray-500">
                {t("report.journeyAuthorized.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle & Driver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
            {isDriver ? (
                <InputField
                    disabled
                    value={`${vehicles[0]?.vehicle_number} - ${vehicles[0]?.brand} ${vehicles[0]?.model}`}
                />
            ) : (
                <>
                    <InputField
                        placeholder="Search Registration No."
                        value={vehicleSearch}
                        onChange={(e) => setVehicleSearch(e.target.value)}
                    />

                    <SelectField
                        value={form.vehicle_id}
                        onChange={(e) => handleVehicleChange(e.target.value)}
                        options={vehicles.map(vehicle => ({
                            value: String(vehicle.id),
                            label: `${vehicle.vehicle_number} — ${vehicle.brand} ${vehicle.model}`
                        }))}
                    />
                </>
            )}

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

        {/* Location: driver gets a manual exact-location field, */}
        {/* subject officer gets the map + search picker */}
        {isDriver ? (
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
                {loadingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </button>
            </div>
          </FormField>
        ) : (
          <FormField label={t("report.exactLocation")} required>
            <LocationPicker
              key={successMessage}
              onLocationSelect={handleMapLocationSelect}
              initialLocation={isEditing && existingAccident ? {
                latitude: existingAccident.latitude,
                longitude: existingAccident.longitude,
                address: existingAccident.location,
              } : undefined}
            />
          </FormField>
        )}

        {/* Province & District (auto-filled by either location method above) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("report.province")}>
            <InputField
              value={form.province}
              disabled
              placeholder={isDriver ? "Auto-filled via GPS" : "Select a location on the map"}
            />
          </FormField>

          <FormField label={t("report.district")}>
            <InputField
              value={form.district}
              disabled
              placeholder={isDriver ? "Auto-filled via GPS" : "Select a location on the map"}
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
                label: t(`report.severityOptions.${severity}`)
              }))}
            />
          </FormField>
        </div>

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
                label: t(`report.roadConditionOptions.${condition}`)
              }))}
            />
          </FormField>

          <FormField label={t("report.weatherCondition")} required>
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
                label: t(`report.weatherConditionOptions.${weather}`)
              }))}
            />
          </FormField>
        </div>

        <FormField label={isEditing ? "Add new evidence photos" : t("report.evidenceImages")}>
          <ImageUploadField
            key={successMessage}
            enableCamera
            onChange={(files) =>
              setForm((prev) => ({
                ...prev,
                files,
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
                {isEditing ? "Updating..." : "Submitting..."}
              </span>
            ) : (
              isEditing ? "Update accident details" : t("btn.submit")
            )}
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default ReportPage;
