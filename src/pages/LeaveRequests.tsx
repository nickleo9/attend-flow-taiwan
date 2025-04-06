
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveRequestForm } from "@/components/LeaveRequestForm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ExportButton } from "@/components/ExportButton";

type LeaveStatus = "approved" | "pending" | "rejected";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export default function LeaveRequests() {
  const [activeTab, setActiveTab] = useState("new");
  
  const leaveRequests: LeaveRequest[] = [
    {
      id: "1",
      type: "特休假",
      startDate: "2025-04-15",
      endDate: "2025-04-15",
      days: "1天",
      reason: "家庭旅遊",
      status: "pending",
      appliedDate: "2025-04-05",
    },
    {
      id: "2",
      type: "特休假",
      startDate: "2025-03-20",
      endDate: "2025-03-22",
      days: "3天",
      reason: "個人休假",
      status: "approved",
      appliedDate: "2025-03-10",
    },
    {
      id: "3",
      type: "病假",
      startDate: "2025-03-05",
      endDate: "2025-03-05",
      days: "1天",
      reason: "身體不適，就醫",
      status: "approved",
      appliedDate: "2025-03-05",
    },
    {
      id: "4",
      type: "事假",
      startDate: "2025-02-28",
      endDate: "2025-02-28",
      days: "0.5天",
      reason: "處理私人事務",
      status: "rejected",
      appliedDate: "2025-02-25",
    },
    {
      id: "5",
      type: "婚假",
      startDate: "2025-02-10",
      endDate: "2025-02-17",
      days: "8天",
      reason: "結婚",
      status: "approved",
      appliedDate: "2025-01-20",
    },
  ];

  // 將請假資料轉換為可導出的格式
  const exportData = leaveRequests.map(request => ({
    date: request.appliedDate,
    type: request.type,
    startDate: request.startDate,
    endDate: request.endDate,
    days: request.days,
    reason: request.reason,
    status: request.status === "approved" ? "已核准" : 
            request.status === "pending" ? "待核准" : "已拒絕",
    clockIn: "-",
    clockOut: "-"
  }));

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已核准</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">待核准</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">已拒絕</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold">請假申請</h1>
          
          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="new">申請請假</TabsTrigger>
              <TabsTrigger value="history">請假記錄</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="mt-6">
              <LeaveRequestForm />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <div className="flex justify-end mb-4">
                <ExportButton data={exportData} fileName="請假記錄" />
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>假別</TableHead>
                        <TableHead>開始日期</TableHead>
                        <TableHead>結束日期</TableHead>
                        <TableHead>天數</TableHead>
                        <TableHead>原因</TableHead>
                        <TableHead>申請日期</TableHead>
                        <TableHead>狀態</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.startDate}</TableCell>
                          <TableCell>{request.endDate}</TableCell>
                          <TableCell>{request.days}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.reason}
                          </TableCell>
                          <TableCell>{request.appliedDate}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
