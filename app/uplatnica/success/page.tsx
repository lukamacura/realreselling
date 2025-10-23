/* eslint-disable @typescript-eslint/no-unused-vars */
// app/success/page.tsx

"use client";
import { useEffect, useState } from "react";

import {
  PackageCheck
} from "lucide-react";

export default function SuccessPage() {

  return (
    <main className="container mx-auto max-w-lg h-screen px-4 py-12 text-center flex flex-col justify-center items-center">
       <PackageCheck className="h-12 w-12 mb-6 text-emerald-400" />
      <h1 className="text-3xl font-bold text-white mb-1">Poslata uplatnica!</h1>
      <p className="text-white/80 max-w-md">
        Hvala ti na poverenju! Nakon verifikacije uplatnice, poslaćemo ti email za pristup. Dobio si i potvrdu na mail.
      </p>
     
    </main>
  );
}
