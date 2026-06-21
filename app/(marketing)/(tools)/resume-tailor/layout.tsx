import { generateToolMetadata } from "@/app/lib/seo/generateMetadata";

export const metadata = generateToolMetadata("resume-tailor");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
