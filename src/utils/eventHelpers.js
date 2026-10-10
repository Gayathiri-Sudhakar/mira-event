export function getCategoryColor(category) {
  switch (category) {
    case "Symposium":
      return { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" };
    case "Culturals":
      return { bg: "#fdf2f8", text: "#db2777", border: "#fbcfe8" };
    case "Technical Events":
      return { bg: "#eef2ff", text: "#4f46e5", border: "#c7d2fe" };
    case "Workshops":
      return { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" };
    case "Sports":
      return { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" };
    default:
      return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
  }
}

export function formatEventDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}
