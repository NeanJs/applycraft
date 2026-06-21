import { generateToolMetadata } from "@/app/lib/seo/generateMetadata";

export const metadata = generateToolMetadata("resume-summary-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
