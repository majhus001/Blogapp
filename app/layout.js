import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Blog App",
  description: "Built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
