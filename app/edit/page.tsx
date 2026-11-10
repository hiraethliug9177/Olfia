import type { Metadata } from "next";
import { EditList } from "@/components/edit/EditList";

export const metadata: Metadata = { title: "The Olfia Edit" };

export default function EditPage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 14 }}>The Olfia Edit</h1>
      <p className="lead" style={{ marginBottom: 32 }}>Culture, fragrance, and the art of living.</p>
      <EditList />
    </div>
  );
}
