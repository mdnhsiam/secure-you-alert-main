import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IncidentCard from "@/components/IncidentCard";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Incident = {
  id: number;
  user: string;
  location?: string;
  text?: string;
  image?: string;
  likes?: number;
  liked?: boolean;
  comments?: Array<{ user: string; text: string }>;
};

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();

  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("secureyou_incidents");
        const list: Incident[] = raw ? JSON.parse(raw) : [];
        const found = list.find((it) => String(it.id) === String(id));
        if (found) setIncident(found);
        else setIncident(null);
      } catch (e) {
        setIncident(null);
      }
    };
    load();
  }, [id]);

  const updateIncident = (updated: Incident) => {
    try {
      const raw = localStorage.getItem("secureyou_incidents");
      const list: Incident[] = raw ? JSON.parse(raw) : [];
      const next = list.map((it) => (String(it.id) === String(updated.id) ? updated : it));
      localStorage.setItem("secureyou_incidents", JSON.stringify(next));
      setIncident(updated);
    } catch (e) {}
  };

  const handleLike = () => {
    if (!incident) return;
    const updated = { ...incident, liked: !incident.liked, likes: incident.liked ? (incident.likes || 0) - 1 : (incident.likes || 0) + 1 };
    updateIncident(updated);
  };

  const handleDelete = () => {
    if (!incident) return;
    try {
      const raw = localStorage.getItem("secureyou_incidents");
      const list: Incident[] = raw ? JSON.parse(raw) : [];
      const next = list.filter((it) => String(it.id) !== String(incident.id));
      localStorage.setItem("secureyou_incidents", JSON.stringify(next));
      toast({ variant: "success", title: t("incidents.delete") || "Deleted", description: t("incidents.deletedDesc") || "Post removed" });
    } catch (e) {
      toast({ variant: "error", title: t("incidents.delete") || "Delete Failed", description: t("incidents.deleteFailed") || "Could not delete post" });
    }
    navigate("/incidents");
  };

  if (!incident) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {t("back")}
        </Button>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">{t("incidents.noIncidents")}</h2>
          <p className="text-sm text-muted-foreground mt-2">{t("incidents.noIncidentsDesc") || "The incident you're looking for could not be found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {t("back")}
        </Button>
      </div>

      <IncidentCard
        incident={incident}
        onLike={handleLike}
        onDelete={handleDelete}
        onEdit={() => {
          // for now, reuse delete as placeholder; could open edit dialog
          toast({ title: t("incidents.edit") || "Edit", description: t("incidents.editing") || "Editing is not implemented yet" });
        }}
      />
    </div>
  );
};

export default IncidentDetail;
