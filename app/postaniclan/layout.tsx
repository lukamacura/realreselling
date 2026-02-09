import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Postani Član",
  description:
    "Od minimalca do slobode — pročitaj pravu priču i pridruži se Real Reselling zajednici za samo 39€. Vodiči, alati, zajednica i doživotan pristup.",
  openGraph: {
    title: "Postani Član | Real Reselling",
    description:
      "Pročitaj pravu priču i pridruži se Real Reselling zajednici za samo 39€.",
    url: "https://realreselling.com/postaniclan",
  },
};

export default function PostaniClanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
