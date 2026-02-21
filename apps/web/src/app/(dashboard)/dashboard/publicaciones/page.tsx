import { PageHeader } from "@app-inmobiliaria/ui";
import { PublicationCenter } from "@/components/dashboard/publication-center";

export const metadata = { title: "Centro de Publicaciones" };

export default function PublicacionesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Centro de Publicaciones"
        description="Gestioná las publicaciones de tus propiedades en portales externos"
      />
      <PublicationCenter />
    </div>
  );
}
