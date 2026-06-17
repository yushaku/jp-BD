import { redirect } from "next/navigation";
import { wpPublicUrl } from "@/lib/config";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const subpath = path?.length ? `/${path.join("/")}` : "";
  redirect(`${wpPublicUrl}/my-account${subpath}`);
}
