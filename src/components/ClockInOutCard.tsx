
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useState, useEffect } from "react";

export function ClockInOutCard() {
  const { clockedIn, clockInTime, clockOutTime, handleClockIn, handleClockOut } = useAttendance();
  const [currentTime, setCurrentTime] = useState<string>(format(new Date(), "HH:mm:ss"));

  // 更新當前時間
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2" size={20} />
          今天打卡
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="text-4xl font-bold">
          {currentTime}
        </div>
        
        <div className="flex flex-col w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">上班時間</span>
            <span className="font-medium">{clockInTime || "-"}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">下班時間</span>
            <span className="font-medium">{clockOutTime || "-"}</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 w-full mt-4">
          <Button
            className="flex-1"
            onClick={handleClockIn}
            disabled={clockedIn}
            size="lg"
          >
            <LogIn className="mr-2" size={16} />
            上班打卡
          </Button>
          
          <Button
            className="flex-1"
            onClick={handleClockOut}
            disabled={!clockedIn}
            size="lg"
            variant={clockedIn ? "default" : "outline"}
          >
            <LogOut className="mr-2" size={16} />
            下班打卡
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
