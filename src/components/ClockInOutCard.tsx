
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export function ClockInOutCard() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(format(now, "HH:mm:ss"));
    setClockedIn(true);
    
    toast({
      title: "成功打卡上班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(format(now, "HH:mm:ss"));
    setClockedIn(false);
    
    toast({
      title: "成功打卡下班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

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
          {format(new Date(), "HH:mm:ss")}
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
