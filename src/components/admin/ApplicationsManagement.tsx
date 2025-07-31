import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality?: string;
  education_level?: string;
  message?: string;
  status: string;
  created_at: string;
  program_id?: string;
}

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب الاستشارات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الاستشارة بنجاح"
      });

      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحديث الحالة",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الاستشارة؟')) return;

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الاستشارة بنجاح"
      });

      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف الاستشارة",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, icon: Clock, text: "في الانتظار" },
      approved: { variant: "default" as const, icon: CheckCircle, text: "تمت الموافقة" },
      rejected: { variant: "destructive" as const, icon: XCircle, text: "تم الرفض" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {statusInfo.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الاستشارات</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {applications.length} استشارة
        </Badge>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">لا توجد استشارات حالياً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{application.full_name}</h3>
                    <p className="text-muted-foreground">{application.email}</p>
                    <p className="text-sm text-muted-foreground">{application.phone}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(application.status)}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(application.created_at)}
                    </span>
                  </div>
                </div>

                {(application.nationality || application.education_level) && (
                  <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                    {application.nationality && (
                      <div>
                        <span className="font-medium">الجنسية: </span>
                        <span className="text-muted-foreground">{application.nationality}</span>
                      </div>
                    )}
                    {application.education_level && (
                      <div>
                        <span className="font-medium">المستوى التعليمي: </span>
                        <span className="text-muted-foreground">{application.education_level}</span>
                      </div>
                    )}
                  </div>
                )}

                {application.message && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">الرسالة:</h4>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{application.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  {application.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(application.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        موافقة
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(application.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        رفض
                      </Button>
                    </>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteApplication(application.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;