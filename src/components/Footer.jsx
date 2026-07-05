import { siteConfig } from "../config/siteConfig";
default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-xl font-bold">
          Dream Mode
        </h2>

        <p className="mt-3 text-gray-300">
          Powered By 'Dream Mode Fashion'
        </p>
        <p className="mt-4 text-gray-300">
      📞 {siteConfig.phone}
</p>

<p className="text-gray-300">
  ✉️ {siteConfig.email}
</p>

<a
  href={siteConfig.facebook}
  target="_blank"
  rel="noopener noreferrer"
  className="block mt-2 text-blue-400 hover:text-blue-300"
>
  Facebook Page
</a>
        <p className="mt-6 text-sm text-gray-400">
          © 2026 Dream Mode. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}
