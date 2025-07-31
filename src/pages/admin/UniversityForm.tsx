import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
}

const UniversityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    image_url: "",
    country_id: "",
    ranking: 0,
    students_count: "",
    website_url: "",
    featured: false
  });

  useEffect(() => {
    fetchCountries();
    if (id) {
      fetchUniversity();
    }
  }, [id]);

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

  const fetchUniversity = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          name_en: data.name_en,
          name_ar: data.name_ar,
          description_en: data.description_en || "",
          description_ar: data.description_ar || "",
          image_url: data.image_url || "",
          country_id: data.country_id || "",
          ranking: data.ranking || 0,
          students_count: data.students_count || "",
          website_url: data.website_url || "",
          featured: data.featured || false
        });
      }
    } catch (error) {
      console.error('Error fetching university:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات الجامعة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (id) {
        const { error } = await supabase
          .from('universities')
          .update(formData)
          .eq('id', id);

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
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving university:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ الجامعة",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للوحة التحكم
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? 'تعديل الجامعة' : 'إضافة جامعة جديدة'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات الجامعة</CardTitle>
          </CardHeader>
          <CardContent>
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
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">الوصف بالعربية</label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">صورة الجامعة</label>
                <ImageUpload
                  bucket="universities"
                  onUpload={(url) => setFormData({...formData, image_url: url})}
                  currentImage={formData.image_url}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">التصنيف العالمي</label>
                  <Input
                    type="number"
                    value={formData.ranking}
                    onChange={(e) => setFormData({...formData, ranking: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">عدد الطلاب</label>
                  <Input
                    value={formData.students_count}
                    onChange={(e) => setFormData({...formData, students_count: e.target.value})}
                    placeholder="25,000"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">موقع الجامعة</label>
                  <Input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    placeholder="https://university.edu"
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
                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : (id ? 'تحديث' : 'إضافة')}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversityForm;