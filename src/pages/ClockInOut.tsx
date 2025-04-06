
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useAttendance } from "@/contexts/AttendanceContext";
import { ExportButton, AttendanceRecord } from "@/components/ExportButton";

export default function ClockInOut() {
  const { clockedIn, clockInTime, clockOutTime, handleClockIn, handleClockOut } = useAttendance();
  const [currentTime, setCurrentTime] = useState<string>(format(new Date(), "HH:mm:ss"));

  // 更新當前時間
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 假設的過去打卡紀錄
  const clockHistory: AttendanceRecord[] = [
    { date: "2025-04-05", clockIn: "09:05:22", clockOut: "18:15:45", status: "正常" },
    { date: "2025-04-04", clockIn: "08:55:10", clockOut: "18:10:30", status: "正常" },
    { date: "2025-04-03", clockIn: "09:10:05", clockOut: "18:30:15", status: "遲到" },
    { date: "2025-04-02", clockIn: "08:45:32", clockOut: "18:05:40", status: "正常" },
    { date: "2025-04-01", clockIn: "08:50:18", clockOut: "18:20:55", status: "正常" },
    { date: "2025-03-31", clockIn: "09:15:42", clockOut: "18:00:25", status: "遲到" },
    { date: "2025-03-30", clockIn: "08:58:37", clockOut: "18:12:10", status: "正常" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold">上下班打卡</h1>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" size={20} />
                今日打卡
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8">
              <div className="text-6xl font-bold">
                {currentTime}
              </div>
              
              <p className="text-lg text-muted-foreground">
                {format(new Date(), "yyyy年MM月dd日 EEEE").replace("Sunday", "週日")
                  .replace("Monday", "週一")
                  .replace("Tuesday", "週二")
                  .replace("Wednesday", "週三")
                  .replace("Thursday", "週四")
                  .replace("Friday", "週五")
                  .replace("Saturday", "週六")}
              </p>
              
              <div className="flex justify-center gap-6 w-full max-w-md">
                <Button
                  className="flex-1 h-16 text-lg"
                  onClick={handleClockIn}
                  disabled={clockedIn}
                  size="lg"
                >
                  <LogIn className="mr-2" size={20} />
                  上班打卡
                </Button>
                
                <Button
                  className="flex-1 h-16 text-lg"
                  onClick={handleClockOut}
                  disabled={!clockedIn}
                  size="lg"
                  variant={clockedIn ? "default" : "outline"}
                >
                  <LogOut className="mr-2" size={20} />
                  下班打卡
                </Button>
              </div>
              
              <div className="flex flex-col w-full max-w-md space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">上班時間</span>
                  <span className="font-medium">{clockInTime || "-"}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">下班時間</span>
                  <span className="font-medium">{clockOutTime || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-8" />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">打卡記錄</h2>
            <ExportButton data={clockHistory} fileName="出勤記錄" />
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>上班時間</TableHead>
                    <TableHead>下班時間</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>工作時數</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clockHistory.map((record) => {
                    // 計算工作時數
                    let hours = "-";
                    if (record.clockIn && record.clockOut) {
                      const [inHour, inMin] = record.clockIn.split(':').map(Number);
                      const [outHour, outMin] = record.clockOut.split(':').map(Number);
                      
                      const inMinutes = inHour * 60 + inMin;
                      const outMinutes = outHour * 60 + outMin;
                      
                      const hoursDiff = ((outMinutes - inMinutes) / 60);
                      hours = hoursDiff.toFixed(1);
                    }
                    
                    return (
                      <TableRow key={record.date}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.clockIn}</TableCell>
                        <TableCell>{record.clockOut}</TableCell>
                        <TableCell>
                          <span className={record.status === "正常" ? "text-green-600" : "text-amber-600"}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>{hours}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
