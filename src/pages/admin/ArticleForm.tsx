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
import RichTextEditor from "@/components/ui/RichTextEditor";

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    excerpt_en: "",
    excerpt_ar: "",
    content_en: "",
    content_ar: "",
    image_url: "",
    author_name: "",
    featured: false,
    published: false
  });

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          title_en: data.title_en,
          title_ar: data.title_ar,
          excerpt_en: data.excerpt_en || "",
          excerpt_ar: data.excerpt_ar || "",
          content_en: data.content_en || "",
          content_ar: data.content_ar || "",
          image_url: data.image_url || "",
          author_name: data.author_name || "",
          featured: data.featured || false,
          published: data.published || false
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات المقال",
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
          .from('articles')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث المقال بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة المقال بنجاح"
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ المقال",
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للوحة التحكم
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? 'تعديل المقال' : 'إضافة مقال جديد'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">العنوان بالإنجليزية</label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">العنوان بالعربية</label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الملخص بالإنجليزية</label>
                  <Textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData({...formData, excerpt_en: e.target.value})}
                    rows={3}
                    placeholder="ملخص قصير للمقال..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الملخص بالعربية</label>
                  <Textarea
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})}
                    rows={3}
                    placeholder="ملخص قصير للمقال..."
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">المحتوى بالإنجليزية</label>
                <RichTextEditor
                  value={formData.content_en}
                  onChange={(value) => setFormData({...formData, content_en: value})}
                  placeholder="محتوى المقال الكامل..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">المحتوى بالعربية</label>
                <RichTextEditor
                  value={formData.content_ar}
                  onChange={(value) => setFormData({...formData, content_ar: value})}
                  placeholder="محتوى المقال الكامل..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">صورة المقال</label>
                  <ImageUpload
                    bucket="articles"
                    currentImage={formData.image_url}
                    onUpload={(url) => setFormData({...formData, image_url: url})}
                    maxSize={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">اسم الكاتب</label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                    placeholder="اسم الكاتب"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <label className="text-sm font-medium">مقال مميز</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  />
                  <label className="text-sm font-medium">نشر المقال</label>
                </div>
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

export default ArticleForm;