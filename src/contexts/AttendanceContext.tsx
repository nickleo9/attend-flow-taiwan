
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface AttendanceContextType {
  clockedIn: boolean;
  clockInTime: string | null;
  clockOutTime: string | null;
  handleClockIn: () => void;
  handleClockOut: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const { toast } = useToast();

  // 初始化時從 localStorage 讀取打卡信息
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const storedDate = localStorage.getItem("attendance-date");
    
    // 如果日期不是今天，重置打卡狀態
    if (storedDate !== today) {
      localStorage.setItem("attendance-date", today);
      localStorage.removeItem("clockedIn");
      localStorage.removeItem("clockInTime");
      localStorage.removeItem("clockOutTime");
      return;
    }
    
    const storedClockedIn = localStorage.getItem("clockedIn") === "true";
    const storedClockInTime = localStorage.getItem("clockInTime");
    const storedClockOutTime = localStorage.getItem("clockOutTime");
    
    setClockedIn(storedClockedIn);
    setClockInTime(storedClockInTime);
    setClockOutTime(storedClockOutTime);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    const timeString = format(now, "HH:mm:ss");
    
    setClockInTime(timeString);
    setClockedIn(true);
    
    localStorage.setItem("clockedIn", "true");
    localStorage.setItem("clockInTime", timeString);
    
    toast({
      title: "成功打卡上班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    const timeString = format(now, "HH:mm:ss");
    
    setClockOutTime(timeString);
    setClockedIn(false);
    
    localStorage.setItem("clockedIn", "false");
    localStorage.setItem("clockOutTime", timeString);
    
    toast({
      title: "成功打卡下班",
      description: `時間：${format(now, "yyyy-MM-dd HH:mm:ss")}`,
    });
  };

  return (
    <AttendanceContext.Provider
      value={{
        clockedIn,
        clockInTime,
        clockOutTime,
        handleClockIn,
        handleClockOut,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
