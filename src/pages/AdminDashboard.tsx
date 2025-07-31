import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import CountriesManagement from "@/components/admin/CountriesManagement";
import UniversitiesManagement from "@/components/admin/UniversitiesManagement";
import ProgramsManagement from "@/components/admin/ProgramsManagement";
import ArticlesManagement from "@/components/admin/ArticlesManagement";
import SiteSettings from "@/components/admin/SiteSettings";

interface DashboardStats {
  countries: number;
  universities: number;
  programs: number;
  articles: number;
  applications: number;
}

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  education_level?: string;
  nationality?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    countries: 0,
    universities: 0,
    programs: 0,
    articles: 0,
    applications: 0
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      const adminSession = localStorage.getItem('admin_session');
      
      if (!adminSession) {
        navigate('/auth');
        return;
      }

      const admin = JSON.parse(adminSession);
      
      // Verify admin still exists in database
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', admin.id)
        .single();

      if (error || !adminData) {
        localStorage.removeItem('admin_session');
        navigate('/auth');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin_session');
      navigate('/auth');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [countriesRes, universitiesRes, programsRes, articlesRes, applicationsRes] = await Promise.all([
        supabase.from('countries').select('id', { count: 'exact' }),
        supabase.from('universities').select('id', { count: 'exact' }),
        supabase.from('programs').select('id', { count: 'exact' }),
        supabase.from('articles').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' })
      ]);

      setStats({
        countries: countriesRes.count || 0,
        universities: universitiesRes.count || 0,
        programs: programsRes.count || 0,
        articles: articlesRes.count || 0,
        applications: applicationsRes.count || 0
      });

      // Fetch recent applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_session');
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً"
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));

      toast({
        title: "تم تحديث حالة الطلب",
        description: `تم تغيير الحالة إلى: ${status}`
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحديث حالة الطلب",
        variant: "destructive"
      });
    }
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, text: "في الانتظار" },
      contacted: { variant: "default" as const, text: "تم التواصل" },
      completed: { variant: "default" as const, text: "مكتمل" },
      cancelled: { variant: "destructive" as const, text: "ملغي" }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">لوحة تحكم المدراء</h1>
              <p className="text-muted-foreground">إدارة الموقع والمحتوى</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Eye className="w-4 h-4 mr-2" />
                عرض الموقع
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الدول</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.countries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الجامعات</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.universities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">البرامج</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.programs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المقالات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="applications">الطلبات</TabsTrigger>
            <TabsTrigger value="countries">الدول</TabsTrigger>
            <TabsTrigger value="universities">الجامعات</TabsTrigger>
            <TabsTrigger value="programs">البرامج</TabsTrigger>
            <TabsTrigger value="articles">المقالات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">طلبات الحجز والاستشارة</h2>
            </div>
            
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{application.full_name}</h3>
                        <p className="text-muted-foreground">{application.email} • {application.phone}</p>
                        {application.nationality && (
                          <p className="text-sm text-muted-foreground">الجنسية: {application.nationality}</p>
                        )}
                        {application.education_level && (
                          <p className="text-sm text-muted-foreground">المستوى التعليمي: {application.education_level}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {getStatusBadge(application.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(application.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm">{application.message}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, 'contacted')}
                        disabled={application.status === 'contacted'}
                      >
                        تم التواصل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updateApplicationStatus(application.id, 'completed')}
                        disabled={application.status === 'completed'}
                      >
                        مكتمل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateApplicationStatus(application.id, 'cancelled')}
                        disabled={application.status === 'cancelled'}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="countries" className="space-y-4">
            <CountriesManagement />
          </TabsContent>

          <TabsContent value="universities" className="space-y-4">
            <UniversitiesManagement />
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <ProgramsManagement />
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <ArticlesManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;