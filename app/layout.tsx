import type { Metadata } from "next";


import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "LifeLink App",
  description: "Modern SaaS UI for donor management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
