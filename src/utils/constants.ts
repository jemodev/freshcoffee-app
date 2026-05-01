import Clock from "@/components/icons/Clock.astro";
import Coffee from "@/components/icons/Coffee.astro";
import CheckCircle from "@/components/icons/CheckCircle.astro";
import XCircle from "@/components/icons/XCircle.astro";

export const orderStatusOptions = [
    { label: "Pendientes", value: "pending", icon: Clock },
    { label: "Preparando", value: "in_progress", icon: Coffee },
    { label: "Canceladas", value: "cancelled", icon: XCircle },
    { label: "Completadas", value: "completed", icon: CheckCircle },
];