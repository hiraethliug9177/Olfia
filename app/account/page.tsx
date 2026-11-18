import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My Page" };

export default function AccountPage() {
  return (
    <div className="wrap page">
      <AccountView />
    </div>
  );
}
