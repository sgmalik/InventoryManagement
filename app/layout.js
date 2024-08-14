import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pantry Tracker',
  description: 'Pantry management using Firebase, Next.js, and Material UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        {/* This renders the page-specific content */}
        {children}
      </body>
    </html>
  );
}
