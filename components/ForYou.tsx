"use client";

export default function ForYou() {
  const left = [
    "Ako tražiš pasivni prihod",
    "Ako nećeš da radiš apsolutno ništa",
    "Ako želiš da radiš za nekoga",
    

  ];

  const right = [
    "Ako imaš preko 12 godina",
    "Ako si spreman da prošetaš do pošte",
    "Ako imaš telefon",
  ];

  return (
    <section className="bg-brand-dark mx-auto md:pb-24">
      <div className="container mx-auto max-w-[1100px] px-4">
        {/* Naslov */}
        <h2 className="mb-10 text-center font-display text-4xl leading-[1.1] text-white md:text-6xl">
          Da li je ovo za tebe?
        </h2>

        {/* Dve kolone */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* NIJE */}
          <div>
            <h3 className="text-center font-display text-3xl text-red-500 md:text-4xl">
              NIJE
            </h3>

            <div className="mt-6 space-y-6">
              {left.map((t) => (
                <div
                  key={t}
                  className="rounded-lg uppercase font-bold border-2 border-orange-800 bg-orange-300 px-2 py-2 text-center text-md  text-orange-800 shadow-soft md:text-lg"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* JESTE */}
          <div>
            <h3 className="text-center font-display text-3xl text-green-500 md:text-4xl">
              JESTE
            </h3>

            <div className="mt-6 space-y-6">
              {right.map((t) => (
                <div
                  key={t}
                  className="rounded-lg uppercase font-bold bg-green-300 px-2 py-2 text-center text-md  text-green-800 shadow-soft md:text-lg"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
