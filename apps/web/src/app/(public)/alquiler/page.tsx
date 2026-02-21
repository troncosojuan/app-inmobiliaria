import { redirect } from "next/navigation";

export default function AlquilerPage() {
  redirect("/propiedades?operation=RENT");
}
