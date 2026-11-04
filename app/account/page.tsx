import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <div className="wrap page">
      <AccountView />
    </div>
  );
}
