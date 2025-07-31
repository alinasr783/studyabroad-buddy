import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

const CountryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    image_url: "",
    capital: "",
    population: 0,
    acceptance_rate: 0,
    living_cost: 0,
    featured: false
  });

  useEffect(() => {
    if (id) {
      fetchCountry();
    }
  }, [id]);

  const fetchCountry = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('countries')
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
          capital: data.capital || "",
          population: data.population || 0,
          acceptance_rate: data.acceptance_rate || 0,
          living_cost: data.living_cost || 0,
          featured: data.featured || false
        });
      }
    } catch (error) {
      console.error('Error fetching country:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات الدولة",
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
          .from('countries')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الدولة بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة الدولة بنجاح"
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ الدولة",
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
            {id ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات الدولة</CardTitle>
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
                <label className="text-sm font-medium">صورة الدولة</label>
                <ImageUpload
                  bucket="countries"
                  onUpload={(url) => setFormData({...formData, image_url: url})}
                  currentImage={formData.image_url}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">العاصمة</label>
                  <Input
                    value={formData.capital}
                    onChange={(e) => setFormData({...formData, capital: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">عدد السكان</label>
                  <Input
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData({...formData, population: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نسبة القبول (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acceptance_rate}
                    onChange={(e) => setFormData({...formData, acceptance_rate: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">تكلفة المعيشة السنوية (USD)</label>
                  <Input
                    type="number"
                    value={formData.living_cost}
                    onChange={(e) => setFormData({...formData, living_cost: parseInt(e.target.value) || 0})}
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
                <label className="text-sm font-medium">دولة مميزة</label>
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

export default CountryForm;