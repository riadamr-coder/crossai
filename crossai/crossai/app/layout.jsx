import "./globals.css";

export const metadata = {
  title: "Cross AI",
  description: "Cross AI – a guided Scripture companion with citations and safe support."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
