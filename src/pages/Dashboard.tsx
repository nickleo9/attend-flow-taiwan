
import { Sidebar } from "@/components/Sidebar";
import { AttendanceSummary } from "@/components/AttendanceSummary";
import { ClockInOutCard } from "@/components/ClockInOutCard";
import { RecentActivities } from "@/components/RecentActivities";
import { format } from "date-fns";

export default function Dashboard() {
  const today = new Date();
  const formattedDate = format(today, "yyyy年MM月dd日");
  const dayOfWeek = format(today, "EEEE").replace("Sunday", "週日")
    .replace("Monday", "週一")
    .replace("Tuesday", "週二")
    .replace("Wednesday", "週三")
    .replace("Thursday", "週四")
    .replace("Friday", "週五")
    .replace("Saturday", "週六");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">儀表板</h1>
              <p className="text-muted-foreground">
                {formattedDate} {dayOfWeek}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-md">
              <span className="font-medium">今日狀態:</span>
              <span className="font-bold">出勤</span>
            </div>
          </div>
          
          <AttendanceSummary />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClockInOutCard />
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
}
