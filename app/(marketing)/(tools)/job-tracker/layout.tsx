import { generateToolMetadata } from "@/app/lib/seo/generateMetadata";

export const metadata = generateToolMetadata("job-tracker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
