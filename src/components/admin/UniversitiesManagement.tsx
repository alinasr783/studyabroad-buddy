import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface University {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  country_id: string;
  ranking: number;
  students_count: string;
  website_url: string;
  featured: boolean;
}

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
}

const UniversitiesManagement = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUniversities();
    fetchCountries();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select(`
          *,
          countries(name_ar, name_en)
        `)
        .order('name_en');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات الجامعات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name_ar, name_en')
        .order('name_ar');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الجامعة؟')) return;
    
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الجامعة بنجاح"
      });
      
      fetchUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف الجامعة",
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
        <h2 className="text-xl font-semibold">إدارة الجامعات</h2>
        <Button onClick={() => navigate('/admin/universities/add')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة جامعة جديدة
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map((university: any) => (
          <Card key={university.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{university.name_ar}</CardTitle>
                  <p className="text-sm text-muted-foreground">{university.name_en}</p>
                  <p className="text-xs text-muted-foreground">{university.countries?.name_ar}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/universities/edit/${university.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(university.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={university.image_url} alt={university.name_ar} className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-sm mb-2">{university.description_ar?.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>التصنيف: #{university.ranking}</p>
                <p>عدد الطلاب: {university.students_count}</p>
                <p>الموقع: <a href={university.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{university.website_url}</a></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UniversitiesManagement;