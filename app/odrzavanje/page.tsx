import { Paintbrush } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Održavanje u toku | Real Reselling",
  robots: { index: false, follow: true },
};

export default function MaintenancePage() {
  return (
    <><main className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-xl text-center flex flex-col justify-center items-center gap-4">
              <Paintbrush className="h-20 w-20 text-amber-600" />

              <h1 className="text-2xl font-semibold mb-2">U toku su izmene</h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                  Na stranici se trenutno vrše izmene. Uskoro će biti aktivirana.
              </p>
          </div>

      </main><Footer /></>

  );
}
