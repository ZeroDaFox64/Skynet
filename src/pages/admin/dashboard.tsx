import { Chart } from "../../components/admin/charts";

export default function Dashboard() {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <Chart />
      </div>
    </>
  );
}
