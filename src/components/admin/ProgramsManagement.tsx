import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  university_id: string;
  degree_level: string;
  duration: string;
  language: string;
  tuition_fee: string;
  requirements_en: string;
  requirements_ar: string;
  featured: boolean;
  universities?: {
    name_ar: string;
    name_en: string;
  };
}

const ProgramsManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          *,
          universities(name_ar, name_en)
        `)
        .order('name_en');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات البرامج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) return;
    
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف البرنامج بنجاح"
      });
      
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف البرنامج",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة البرامج</h2>
        <Button onClick={() => navigate('/admin/programs/add')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة برنامج جديد
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program: any) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{program.name_ar}</CardTitle>
                  <p className="text-sm text-muted-foreground">{program.name_en}</p>
                  <p className="text-xs text-muted-foreground">{program.universities?.name_ar}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/programs/edit/${program.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(program.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={program.image_url} alt={program.name_ar} className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-sm mb-2">{program.description_ar?.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>المستوى: {program.degree_level}</p>
                <p>المدة: {program.duration}</p>
                <p>اللغة: {program.language}</p>
                <p>الرسوم: {program.tuition_fee}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramsManagement;