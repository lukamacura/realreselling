// app/cancel/page.tsx

"use client";

import {
  BadgeAlert
} from "lucide-react";

export default function Cancel() {

  return (
    <main className="container mx-auto max-w-lg h-screen px-4 py-12 text-center flex flex-col justify-center items-center">
       <BadgeAlert className="h-12 w-12 mb-6 text-red-500" />
      <h1 className="text-3xl font-bold text-white mb-1">Neuspešna kupovina!</h1>
      <p className="text-white/80 max-w-md">
        Ako si imao problem prilikom kupovine na stripe-u kontaktiraj nas putem instagrama ili kupi uplatnicom.
      </p>
     
    </main>
  );
}
