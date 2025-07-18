// app/layout.js or app/layout.jsx
import "./globals.css";
import Navbar from "../components/Navbar";
import SessionWrapper from "../components/SessionWrapper";

export const metadata = {
  title: "Blog App",
  description: "Built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head /> 
      <body>
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
