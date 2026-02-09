import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zakaži Poziv",
  description:
    "Zakaži besplatan konsultantski poziv sa Real Reselling timom. Saznaj kako da počneš da zarađuješ od resellinga.",
  openGraph: {
    title: "Zakaži Poziv | Real Reselling",
    description:
      "Zakaži besplatan konsultantski poziv sa Real Reselling timom.",
    url: "https://realreselling.com/meet",
  },
};

export default function MeetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
