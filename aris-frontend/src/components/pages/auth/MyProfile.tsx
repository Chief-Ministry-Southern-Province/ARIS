import { Building2, Phone, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useAuth";
import Loader from "@/components/atoms/Loader";

export default function MyProfile() {
  const navigate = useNavigate();

  const { data: profile, isLoading: loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load profile
      </div>
    );
  }

  const user = profile.user;

  const avatar =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const role =
    profile.role[0]
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View your account information and security settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {avatar}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{role}</p>
          </div>

          <button
            onClick={() => navigate("/change-password")}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Personal Information
          </h3>

          <div className="space-y-4">
            <ProfileItem
              icon={<User size={18} />}
              label="Full Name"
              value={user.name}
            />

            <ProfileItem
              icon={<Phone size={18} />}
              label="NIC"
              value={user.nic}
            />

            <ProfileItem
              icon={<Phone size={18} />}
              label="Mobile Number"
              value={user.mobile}
            />
          </div>
        </div>

        {/* Organization Information */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Organization Information
          </h3>

          <div className="space-y-4">
            <ProfileItem
              icon={<Shield size={18} />}
              label="Role"
              value={role}
            />

            <ProfileItem
              icon={<Building2 size={18} />}
              label="Institution"
              value={user.institution?.name ?? "N/A"}
            />

            <ProfileItem
              icon={<Building2 size={18} />}
              label="Institution Type"
              value={user.institution?.type ?? "N/A"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileItem({
  icon,
  label,
  value,
}: ProfileItemProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-primary">
        {icon}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
