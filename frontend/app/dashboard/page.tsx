import { redirect } from "next/navigation";

export default async function Dashboard() {
    return redirect("/dashboard/overview");
}