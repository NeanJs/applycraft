import { generateToolMetadata } from "@/app/lib/seo/generateMetadata";

export const metadata = generateToolMetadata("ats-resume-checker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
