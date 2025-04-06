
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  tripType: z.string({
    required_error: "請選擇類型",
  }),
  startDate: z.date({
    required_error: "請選擇開始日期",
  }),
  endDate: z.date({
    required_error: "請選擇結束日期",
  }),
  destination: z.string()
    .min(2, { message: "目的地至少需要2個字" })
    .max(50, { message: "目的地最多50個字" }),
  purpose: z.string()
    .min(5, { message: "事由至少需要5個字" })
    .max(200, { message: "事由最多200個字" }),
  contact: z.string()
    .min(8, { message: "聯絡方式至少需要8個字" })
    .max(50, { message: "聯絡方式最多50個字" }),
});

type TripStatus = "approved" | "pending" | "rejected";

interface BusinessTrip {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  status: TripStatus;
  appliedDate: string;
}

export default function BusinessTrips() {
  const [activeTab, setActiveTab] = useState("new");
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "公出/出差申請已提交",
      description: (
        <div className="mt-2 text-sm">
          <p>類型: {data.tripType === "business" ? "公出" : "出差"}</p>
          <p>從 {format(data.startDate, "yyyy-MM-dd")} 到 {format(data.endDate, "yyyy-MM-dd")}</p>
          <p>目的地: {data.destination}</p>
        </div>
      ),
    });
    
    form.reset();
  }
  
  const businessTrips: BusinessTrip[] = [
    {
      id: "1",
      type: "出差",
      startDate: "2025-04-20",
      endDate: "2025-04-22",
      destination: "台中",
      purpose: "客戶會議與產品展示",
      status: "pending",
      appliedDate: "2025-04-05",
    },
    {
      id: "2",
      type: "公出",
      startDate: "2025-04-10",
      endDate: "2025-04-10",
      destination: "新竹科學園區",
      purpose: "參加研討會",
      status: "approved",
      appliedDate: "2025-04-01",
    },
    {
      id: "3",
      type: "出差",
      startDate: "2025-03-15",
      endDate: "2025-03-18",
      destination: "高雄",
      purpose: "專案現場勘查與協調",
      status: "approved",
      appliedDate: "2025-03-05",
    },
    {
      id: "4",
      type: "公出",
      startDate: "2025-02-28",
      endDate: "2025-02-28",
      destination: "台北世貿中心",
      purpose: "參加展覽",
      status: "rejected",
      appliedDate: "2025-02-20",
    },
  ];

  const getStatusBadge = (status: TripStatus) => {
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
          <h1 className="text-3xl font-bold">公出/出差申請</h1>
          
          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="new">新增申請</TabsTrigger>
              <TabsTrigger value="history">申請記錄</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>公出/出差申請</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="tripType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>類型</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="選擇類型" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="business">公出</SelectItem>
                                <SelectItem value="trip">出差</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              公出：指當日往返的業務活動；出差：指需要住宿的業務活動
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>開始日期</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "yyyy-MM-dd")
                                      ) : (
                                        <span>選擇日期</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>結束日期</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "yyyy-MM-dd")
                                      ) : (
                                        <span>選擇日期</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>目的地</FormLabel>
                            <FormControl>
                              <Input placeholder="輸入目的地" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>事由</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="請輸入公出/出差事由" 
                                {...field} 
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>聯絡方式</FormLabel>
                            <FormControl>
                              <Input placeholder="出差期間的聯絡方式" {...field} />
                            </FormControl>
                            <FormDescription>
                              請提供在外期間可聯繫到您的方式（手機、電子郵件等）
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">提交申請</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>類型</TableHead>
                        <TableHead>開始日期</TableHead>
                        <TableHead>結束日期</TableHead>
                        <TableHead>目的地</TableHead>
                        <TableHead>事由</TableHead>
                        <TableHead>申請日期</TableHead>
                        <TableHead>狀態</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell>{trip.type}</TableCell>
                          <TableCell>{trip.startDate}</TableCell>
                          <TableCell>{trip.endDate}</TableCell>
                          <TableCell>{trip.destination}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {trip.purpose}
                          </TableCell>
                          <TableCell>{trip.appliedDate}</TableCell>
                          <TableCell>{getStatusBadge(trip.status)}</TableCell>
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
