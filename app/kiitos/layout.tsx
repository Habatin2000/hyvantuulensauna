import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kiitos Varauksestasi | Hyvän Tuulen Sauna',
  description: 'Vastaanotimme varauskyselysi. Olemme sinuun yhteydessä pian!',
  robots: {
    index: false,
    follow: false,
  },
};

export default function KiitosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
