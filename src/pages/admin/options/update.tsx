import UpdateItem from "../../../components/admin/CreateUpdateDelete";
import AdminHeader from "../../../components/admin/adminHeader";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans transition-colors duration-300">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <UpdateItem formType="update" />
      </main>
    </div>
  );
}
