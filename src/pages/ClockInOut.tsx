
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";

export default function ClockInOut() {
  const [clockedIn, setClockedIn] = useState(false);
  const { toast } = useToast();

  const handleClockIn = () => {
    const now = new Date();
    setClockedIn(true);
    
    toast({
      title: "成功打卡上班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockedIn(false);
    
    toast({
      title: "成功打卡下班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

  // 假設的過去打卡紀錄
  const clockHistory = [
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
                {format(new Date(), "HH:mm:ss")}
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
            </CardContent>
          </Card>
          
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold mb-4">打卡記錄</h2>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>上班時間</TableHead>
                    <TableHead>下班時間</TableHead>
                    <TableHead>狀態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clockHistory.map((record) => (
                    <TableRow key={record.date}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>
                        <span className={record.status === "正常" ? "text-green-600" : "text-amber-600"}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
