// frontend/src/services/Tenants.js
export const API =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:8000";

export const TAG_OPTIONS = [
  "Office 365",
  "On-Prem",
  "Hybrid",
  "Production",
  "Sandbox",
  "Dev",
  "Staging",
  "Test",
  "DR",
  "EDU",
  "B2C",
];

export async function listTenants() {
  return [
    {
      id: "9a30ebaz-2bf7-4e9d-ab1c-0382a965e31e",
      name: "Covenant Technology",
      domain: "covenanttechnology.net",
      status: "connected",
      tags: ["Office 365", "Production"],
      granted: 3,
      notGranted: 16,
      requireMfa: false,
      securityGroupId: "",
    },
    {
      id: "a1b2c3d4-0000-1111-2222-333344445555",
      name: "Example Holdings",
      domain: "example.com",
      status: "warning",
      tags: ["Office 365", "Hybrid"],
      granted: 8,
      notGranted: 2,
      requireMfa: false,
      securityGroupId: "",
    },
    {
      id: "fffeeee-dddd-cccc-bbbb-aaaa00001111",
      name: "Acme Corp",
      domain: "acme.org",
      status: "offline",
      tags: ["Office 365", "Sandbox"],
      granted: 0,
      notGranted: 20,
      requireMfa: false,
      securityGroupId: "",
    },
  ];
}

export function startEntraConsentRedirect() {
  const url = `${API}/auth/entra/consent/start`;
  window.location.href = url;
}
