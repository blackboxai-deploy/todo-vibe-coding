export const metadata = {
  title: "Next.js Todo List",
  description: "A simple todo list built with Next.js"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
