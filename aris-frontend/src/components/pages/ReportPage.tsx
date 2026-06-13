import { AlertCircle, MapPin } from "lucide-react";
import { mockUsers, mockVehicles } from "../data/mockData";
import { useTranslation } from "react-i18next";
import { type ChangeEvent, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField ";
import { TextAreaField } from "../atoms/TextAreaField";
import { ImageUploadField } from "@/components/molecules/ImageUploadField";
import {provinces} from "@/components/data/province";
import { useCurrentLocation } from "@/hooks/useGetCurrentLiveLocation";

const ReportPage = () => {
  const { t } = useTranslation();
  const { loadingLocation, getCurrentLocation } = useCurrentLocation();

 
  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    province: "",
    district: "",
    vehicle: "",
    driver: "",
    casualties: "",
    injuries: "",
    casualties_type: "",
    description: "",
    vehicleDamage: "",
    roadCondition: "",
    mapLocation: "",
    latitude: "",
    longitude: "",
    evidenceImages: [] as File[]
  });

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

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

  const handleSubmit = () => {
    console.log("Accident Report:", form);

    alert("Report submitted successfully!");

    // TODO:
    // API call here
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-blue-700" />
        {t("report.incidentDetails")}
      </h3>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                update("province", e.target.value)
              }
          >
            <option value="">
              {t("report.selectProvince")}
            </option>

            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </SelectField>
        </FormField>

        <FormField label={t("report.district")}>
          <InputField
            type="text"
            placeholder={t("report.district")}
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
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
            value={form.vehicle}
            onChange={(e) => update("vehicle", e.target.value)}
          >
            <option value="">
              {t("report.selectVehicle")}
            </option>

            {mockVehicles.map((vehicle) => (
              <option
                key={vehicle.id}
                value={vehicle.regNo}
              >
                {vehicle.regNo} — {vehicle.make}
              </option>
            ))}
          </SelectField>
        </FormField>

        <FormField label={t("report.driver")} required>
          <SelectField
            value={form.driver}
            onChange={(e) => update("driver", e.target.value)}
          >
            <option value="">
              {t("report.selectDriver")}
            </option>

            {mockUsers
              .filter((user) => user.role === "Driver")
              .map((user) => (
                <option
                  key={user.id}
                  value={user.name}
                >
                  {user.name}
                </option>
              ))}
          </SelectField>
        </FormField>
      </div>

      {/* Casualties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label={t("report.casualties")}>
          <InputField
            type="number"
            min="0"
            value={form.casualties}
            onChange={(e) =>
              update("casualties", e.target.value)
            }
          />
        </FormField>

        <FormField label={t("report.injuries")}>
          <InputField
            type="number"
            min="0"
            value={form.injuries}
            onChange={(e) =>
              update("injuries", e.target.value)
            }
          />
        </FormField>

        <FormField label={t("report.severity")}>
          <SelectField
            value={form.casualties_type}
            onChange={(e) =>
              update("casualties_type", e.target.value)
            }
          >
            {["None", "Minor", "Serious", "Fatal"].map(
              (severity) => (
                <option
                  key={severity}
                  value={severity}
                >
                  {severity}
                </option>
              )
            )}
          </SelectField>
        </FormField>
      </div>

      {/* Description */}
      <FormField
        label={t("report.accidentDescription")}
        required
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

      {/* Damage & Road Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("report.vehicleDamage")}>
          <TextAreaField
            rows={2}
            value={form.vehicleDamage}
            onChange={(e) =>
              update("vehicleDamage", e.target.value)
            }
          />
        </FormField>

        <FormField label={t("report.roadCondition")}>
          <SelectField
            value={form.roadCondition}
            onChange={(e) =>
              update("roadCondition", e.target.value)
            }
          >
            <option value="">
              Select condition
            </option>

            {[
              "Dry & Clear",
              "Wet",
              "Night",
              "Foggy",
              "Heavy Rain",
              "Road Works",
            ].map((condition) => (
              <option
                key={condition}
                value={condition}
              >
                {condition}
              </option>
            ))}
          </SelectField>
        </FormField>
      </div>

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
        <Button onClick={handleSubmit}>
          {t("btn.submit")}
        </Button>
      </div>
    </div>
  );
};

export default ReportPage;