
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

type ActivityStatus = "approved" | "pending" | "rejected";

interface ActivityItem {
  id: string;
  time: string;
  type: string;
  description: string;
  status: ActivityStatus;
}

export function RecentActivities() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      time: "2025-04-05",
      type: "請假",
      description: "特休假 (1天)",
      status: "approved",
    },
    {
      id: "2",
      time: "2025-04-03",
      type: "出差",
      description: "客戶拜訪",
      status: "approved",
    },
    {
      id: "3",
      time: "2025-04-02",
      type: "請假",
      description: "病假 (0.5天)",
      status: "approved",
    },
    {
      id: "4",
      time: "2025-04-01",
      type: "請假",
      description: "事假 (2小時)",
      status: "pending",
    },
    {
      id: "5",
      time: "2025-03-30",
      type: "公出",
      description: "研討會",
      status: "rejected",
    },
  ];

  const getStatusBadge = (status: ActivityStatus) => {
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2" size={20} />
          近期活動
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.type}</span>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="text-sm text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
