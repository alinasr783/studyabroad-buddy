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

interface University {
  id: string;
  name_ar: string;
  name_en: string;
}

const ProgramForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    requirements_en: "",
    requirements_ar: "",
    image_url: "",
    university_id: "",
    degree_level: "",
    duration: "",
    language: "",
    tuition_fee: "",
    featured: false
  });

  useEffect(() => {
    fetchUniversities();
    if (id) {
      fetchProgram();
    }
  }, [id]);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name_ar, name_en')
        .order('name_ar');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const fetchProgram = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
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
          requirements_en: data.requirements_en || "",
          requirements_ar: data.requirements_ar || "",
          image_url: data.image_url || "",
          university_id: data.university_id || "",
          degree_level: data.degree_level || "",
          duration: data.duration || "",
          language: data.language || "",
          tuition_fee: data.tuition_fee || "",
          featured: data.featured || false
        });
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات البرنامج",
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
          .from('programs')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث البرنامج بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('programs')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة البرنامج بنجاح"
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ البرنامج",
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
            {id ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات البرنامج</CardTitle>
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
                <label className="text-sm font-medium">الجامعة</label>
                <Select value={formData.university_id} onValueChange={(value) => setFormData({...formData, university_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجامعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university.id} value={university.id}>
                        {university.name_ar}
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
                <label className="text-sm font-medium">متطلبات القبول بالإنجليزية</label>
                <Textarea
                  value={formData.requirements_en}
                  onChange={(e) => setFormData({...formData, requirements_en: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">متطلبات القبول بالعربية</label>
                <Textarea
                  value={formData.requirements_ar}
                  onChange={(e) => setFormData({...formData, requirements_ar: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">رابط الصورة</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">مستوى الدرجة</label>
                  <Select value={formData.degree_level} onValueChange={(value) => setFormData({...formData, degree_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bachelor">بكالوريوس</SelectItem>
                      <SelectItem value="Master">ماجستير</SelectItem>
                      <SelectItem value="PhD">دكتوراه</SelectItem>
                      <SelectItem value="Diploma">دبلوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">مدة البرنامج</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="4 سنوات"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">لغة التدريس</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">الإنجليزية</SelectItem>
                      <SelectItem value="Arabic">العربية</SelectItem>
                      <SelectItem value="French">الفرنسية</SelectItem>
                      <SelectItem value="German">الألمانية</SelectItem>
                      <SelectItem value="Spanish">الإسبانية</SelectItem>
                      <SelectItem value="Chinese">الصينية</SelectItem>
                      <SelectItem value="Russian">الروسية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">الرسوم الدراسية</label>
                  <Input
                    value={formData.tuition_fee}
                    onChange={(e) => setFormData({...formData, tuition_fee: e.target.value})}
                    placeholder="$25,000 سنوياً"
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
                <label className="text-sm font-medium">برنامج مميز</label>
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

export default ProgramForm;