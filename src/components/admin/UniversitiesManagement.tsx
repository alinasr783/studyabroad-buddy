import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface University {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  country_id: string;
  ranking: number;
  students_count: number;
  website: string;
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
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    image_url: "",
    country_id: "",
    ranking: 0,
    students_count: 0,
    website: "",
    featured: false
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUniversity) {
        const { error } = await supabase
          .from('universities')
          .update(formData)
          .eq('id', editingUniversity.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الجامعة بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('universities')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة الجامعة بنجاح"
        });
      }
      
      fetchUniversities();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving university:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ الجامعة",
        variant: "destructive"
      });
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

  const resetForm = () => {
    setFormData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      image_url: "",
      country_id: "",
      ranking: 0,
      students_count: 0,
      website: "",
      featured: false
    });
    setEditingUniversity(null);
  };

  const openEditDialog = (university: University) => {
    setEditingUniversity(university);
    setFormData({
      name_en: university.name_en,
      name_ar: university.name_ar,
      description_en: university.description_en,
      description_ar: university.description_ar,
      image_url: university.image_url,
      country_id: university.country_id,
      ranking: university.ranking,
      students_count: university.students_count,
      website: university.website,
      featured: university.featured
    });
    setShowDialog(true);
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة الجامعات</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowDialog(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة جامعة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUniversity ? 'تعديل الجامعة' : 'إضافة جامعة جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الاسم بالإنجليزية</label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الاسم بالعربية</label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">الدولة</label>
                <Select value={formData.country_id} onValueChange={(value) => setFormData({...formData, country_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">الوصف بالإنجليزية</label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">الوصف بالعربية</label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">رابط الصورة</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">التصنيف العالمي</label>
                  <Input
                    type="number"
                    value={formData.ranking}
                    onChange={(e) => setFormData({...formData, ranking: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">عدد الطلاب</label>
                  <Input
                    type="number"
                    value={formData.students_count}
                    onChange={(e) => setFormData({...formData, students_count: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">موقع الجامعة</label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <label className="text-sm font-medium">جامعة مميزة</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingUniversity ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(university)}>
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
              <p className="text-sm mb-2">{university.description_ar.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>التصنيف: #{university.ranking}</p>
                <p>عدد الطلاب: {university.students_count.toLocaleString()}</p>
                <p>الموقع: <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{university.website}</a></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UniversitiesManagement;