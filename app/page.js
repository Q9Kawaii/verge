import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Virtual Energy & Renewable Green Exchange
        </h1>
        <p className="text-gray-600">
          Buy green energy. Retire RECs once. Resell excess as brown power.
        </p>

        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-md"
        >
          Get Started
        </Link>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <p className="text-gray-600">
          Generator → Anchor Buyer (REC retired) → MSMEs (brown energy)
        </p>
      </section>
    </div>
  );
}
