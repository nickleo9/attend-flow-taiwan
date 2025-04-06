
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  CalendarCheck, 
  CalendarX, 
  Briefcase,
  UserCheck 
} from "lucide-react";

export function AttendanceSummary() {
  const summaryData = [
    {
      title: "本月出勤天數",
      value: "18 天",
      icon: UserCheck,
      color: "text-green-500 bg-green-50",
    },
    {
      title: "本月請假天數",
      value: "2 天",
      icon: CalendarX,
      color: "text-amber-500 bg-amber-50",
    },
    {
      title: "本月公出/出差",
      value: "1 天",
      icon: Briefcase,
      color: "text-blue-500 bg-blue-50",
    },
    {
      title: "剩餘特休",
      value: "10 天",
      icon: CalendarCheck,
      color: "text-purple-500 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
              <item.icon size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
