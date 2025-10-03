import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  // Rediriger automatiquement vers la page des véhicules
  redirect("/dashboard/vehicles")
}
