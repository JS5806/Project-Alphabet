import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tailwind CSS가 적용된 글로벌 스타일 필요
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lunch Vote MVP',
  description: '점심 메뉴 투표 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-slate-50 text-slate-900">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}