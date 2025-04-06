
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";

export interface AttendanceRecord {
  date: string;
  name?: string;
  clockIn: string;
  clockOut: string;
  status: string;
  hours?: number;
}

export function ExportButton({ data, fileName = "attendance_records" }: { 
  data: AttendanceRecord[]; 
  fileName?: string;
}) {
  const { toast } = useToast();

  // 計算工作時數
  const processDataForExport = (records: AttendanceRecord[]) => {
    return records.map(record => {
      // 如果已經有計算過的小時數，直接返回
      if (record.hours) {
        return record;
      }
      
      // 計算工作時數
      let hours = 0;
      if (record.clockIn && record.clockOut) {
        const [inHour, inMin] = record.clockIn.split(':').map(Number);
        const [outHour, outMin] = record.clockOut.split(':').map(Number);
        
        const inMinutes = inHour * 60 + inMin;
        const outMinutes = outHour * 60 + outMin;
        
        // 假設正常工作時間為9小時（含午休1小時）
        hours = ((outMinutes - inMinutes) / 60);
        
        // 四捨五入到小數點後一位
        hours = Math.round(hours * 10) / 10;
      }
      
      return {
        ...record,
        hours
      };
    });
  };

  const handleExport = () => {
    try {
      // 處理數據並計算工作時數
      const processedData = processDataForExport(data);
      
      // 建立工作表
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      
      // 設定欄寬
      const columnWidths = [
        { wch: 15 }, // 日期
        { wch: 10 }, // 姓名
        { wch: 10 }, // 上班時間
        { wch: 10 }, // 下班時間
        { wch: 10 }, // 狀態
        { wch: 10 }, // 工作時數
      ];
      
      worksheet["!cols"] = columnWidths;
      
      // 建立工作簿並添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "出勤記錄");
      
      // 產生Excel檔案並下載
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      
      toast({
        title: "匯出成功",
        description: "出勤紀錄已成功匯出為Excel檔案",
      });
    } catch (error) {
      console.error("匯出失敗:", error);
      toast({
        title: "匯出失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleExport} className="ml-auto">
      <Download className="mr-2" size={16} />
      匯出Excel
    </Button>
  );
}
