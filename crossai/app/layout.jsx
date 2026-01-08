export const metadata = {
  title: "Cross AI",
  description: "Cross AI – intelligent Bible assistant"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Arial" }}>
        {children}
      </body>
    </html>
  );
}
