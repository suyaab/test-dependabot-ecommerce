import { headers } from "next/headers";

// Must be called on the server
export default function getIpAddress() {
  return (
    headers().get("x-azure-socketip") ??
    headers().get("x-azure-clientip") ??
    "127.0.0.1"
  );
}
