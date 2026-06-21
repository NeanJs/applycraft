import { generateToolMetadata } from "@/app/lib/seo/generateMetadata";

export const metadata = generateToolMetadata("cover-letter-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
