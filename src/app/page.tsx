import ControlBar from "@/components/ControlBar";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to /new if not authenticated
  // redirect('/new');
  return (
    <div className="flex flex-col h-full w-full">
      <div>Welcome Full</div>
    </div>
  );
}
