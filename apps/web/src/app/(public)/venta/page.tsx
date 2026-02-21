import { redirect } from "next/navigation";

export default function VentaPage() {
  redirect("/propiedades?operation=SALE");
}
