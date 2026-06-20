import { Building2, Mail, Phone, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();

  const user = {
    name: "Thilina Lakshan",
    email: "thilina@example.com",
    phone: "+94 71 234 5678",
    role: "System Administrator",
    institution: "Southern Provincial Department of Health Services",
    avatar: "TL",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View your account information and security settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
            {user.avatar}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
          </div>

          <button
            onClick={() => navigate("/change-password")}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
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
              icon={<Mail size={18} />}
              label="Email Address"
              value={user.email}
            />

            <ProfileItem
              icon={<Phone size={18} />}
              label="Phone Number"
              value={user.phone}
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
              value={user.role}
            />

            <ProfileItem
              icon={<Building2 size={18} />}
              label="Institution"
              value={user.institution}
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