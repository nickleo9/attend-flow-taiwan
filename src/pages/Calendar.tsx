
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AttendanceType = "present" | "absent" | "leave" | "business" | "late" | "weekend" | null;

interface DayData {
  date: Date;
  type: AttendanceType;
  note?: string;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // 生成當月日期
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 在月初補充前一個月的最後幾天
  const startDay = getDay(monthStart);
  const previousMonthDays = [];
  if (startDay > 0) {
    const previousMonth = new Date(monthStart);
    previousMonth.setDate(0);
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(previousMonth);
      day.setDate(previousMonth.getDate() - i);
      previousMonthDays.push(day);
    }
  }

  // 在月底補充下一個月的前幾天
  const endDay = getDay(monthEnd);
  const nextMonthDays = [];
  if (endDay < 6) {
    const nextMonth = new Date(monthEnd);
    nextMonth.setDate(monthEnd.getDate() + 1);
    for (let i = 0; i < 6 - endDay; i++) {
      const day = new Date(nextMonth);
      day.setDate(nextMonth.getDate() + i);
      nextMonthDays.push(day);
    }
  }

  // 假設的出勤資料
  const attendanceData: { [key: string]: DayData } = {
    "2025-04-01": { date: new Date(2025, 3, 1), type: "present" },
    "2025-04-02": { date: new Date(2025, 3, 2), type: "present" },
    "2025-04-03": { date: new Date(2025, 3, 3), type: "late", note: "遲到10分鐘" },
    "2025-04-04": { date: new Date(2025, 3, 4), type: "present" },
    "2025-04-05": { date: new Date(2025, 3, 5), type: "weekend" },
    "2025-04-06": { date: new Date(2025, 3, 6), type: "weekend" },
    "2025-04-07": { date: new Date(2025, 3, 7), type: "present" },
    "2025-04-08": { date: new Date(2025, 3, 8), type: "present" },
    "2025-04-09": { date: new Date(2025, 3, 9), type: "leave", note: "特休" },
    "2025-04-10": { date: new Date(2025, 3, 10), type: "business", note: "公出-研討會" },
    "2025-04-11": { date: new Date(2025, 3, 11), type: "present" },
    "2025-04-12": { date: new Date(2025, 3, 12), type: "weekend" },
    "2025-04-13": { date: new Date(2025, 3, 13), type: "weekend" },
    "2025-04-14": { date: new Date(2025, 3, 14), type: "absent", note: "病假" },
    "2025-04-15": { date: new Date(2025, 3, 15), type: "present" },
    // ...更多日期
  };

  const getAttendanceType = (date: Date): AttendanceType => {
    const dateString = format(date, "yyyy-MM-dd");
    
    // 如果不是當月，返回null
    if (!isSameMonth(date, currentMonth)) {
      return null;
    }
    
    // 如果是週末
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return "weekend";
    }
    
    // 檢查出勤資料
    if (attendanceData[dateString]) {
      return attendanceData[dateString].type;
    }
    
    // 如果是今天之後的日期，返回null
    if (date > new Date()) {
      return null;
    }
    
    // 默認為出勤
    return "present";
  };

  const getAttendanceStyle = (type: AttendanceType): string => {
    switch (type) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300";
      case "absent":
        return "bg-red-100 text-red-700 border-red-300";
      case "leave":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "business":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "late":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "weekend":
        return "bg-gray-100 text-gray-500 border-gray-300";
      default:
        return "bg-white border-transparent";
    }
  };

  const getAttendanceLabel = (type: AttendanceType): string => {
    switch (type) {
      case "present":
        return "出勤";
      case "absent":
        return "缺勤";
      case "leave":
        return "請假";
      case "business":
        return "公出";
      case "late":
        return "遲到";
      case "weekend":
        return "週末";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">出勤日曆</h1>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft size={16} />
              </Button>
              
              <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
                <CalendarIcon size={16} className="mr-1" /> 今天
              </Button>
              
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center">
            {format(currentMonth, "yyyy年MM月")}
          </h2>
          
          <Card>
            <CardContent className="p-4">
              {/* 日曆頭部 - 星期 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                  <div 
                    key={day} 
                    className="p-2 text-center font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* 日曆主體 */}
              <div className="grid grid-cols-7 gap-1">
                {/* 前一個月的日期 */}
                {previousMonthDays.map((day) => (
                  <div
                    key={`prev-${format(day, "yyyy-MM-dd")}`}
                    className="p-2 min-h-[80px] border rounded-md text-gray-400"
                  >
                    {format(day, "d")}
                  </div>
                ))}
                
                {/* 當月的日期 */}
                {daysInMonth.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const type = getAttendanceType(day);
                  const attendanceStyleClass = getAttendanceStyle(type);
                  const attendanceLabel = getAttendanceLabel(type);
                  const note = attendanceData[dateKey]?.note;
                  
                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        "p-2 min-h-[80px] border rounded-md",
                        isToday(day) && "ring-2 ring-brand-400",
                        attendanceStyleClass
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className={cn("font-medium", isToday(day) && "text-brand-600")}>
                          {format(day, "d")}
                        </span>
                        {type && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-white bg-opacity-60">
                            {attendanceLabel}
                          </span>
                        )}
                      </div>
                      {note && (
                        <p className="text-xs mt-1">{note}</p>
                      )}
                    </div>
                  );
                })}
                
                {/* 下一個月的日期 */}
                {nextMonthDays.map((day) => (
                  <div
                    key={`next-${format(day, "yyyy-MM-dd")}`}
                    className="p-2 min-h-[80px] border rounded-md text-gray-400"
                  >
                    {format(day, "d")}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* 圖例 */}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {[
              { type: "present", label: "出勤" },
              { type: "absent", label: "缺勤" },
              { type: "leave", label: "請假" },
              { type: "business", label: "公出" },
              { type: "late", label: "遲到" },
              { type: "weekend", label: "週末" },
            ].map((item) => (
              <div 
                key={item.type} 
                className="flex items-center gap-2"
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full", 
                    getAttendanceStyle(item.type as AttendanceType)
                  )}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
