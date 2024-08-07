import { Dashboard } from "@/components/Dashboard";
import getCurrentUser from "@/actions/getCurrentUser";
import Test from "@/components/Test";

export default async function Home() {
  const currentUser = await getCurrentUser();
  return (
    <>
      <div className="min-h-screen w-full">
        <Test currentUser={currentUser} />
        <Dashboard />
      </div>
    </>
  );
}
