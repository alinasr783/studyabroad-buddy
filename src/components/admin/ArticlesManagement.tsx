import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  image_url: string;
  author_name: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const ArticlesManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات المقالات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المقال بنجاح"
      });
      
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف المقال",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: `تم ${!currentStatus ? 'نشر' : 'إخفاء'} المقال بنجاح`
      });
      
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحديث المقال",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة المقالات</h2>
        <Button onClick={() => navigate('/admin/articles/add')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة مقال جديد
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{article.title_ar}</CardTitle>
                  <p className="text-sm text-muted-foreground">{article.title_en}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "منشور" : "مسودة"}
                    </Badge>
                    {article.featured && (
                      <Badge variant="outline">مميز</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => togglePublished(article.id, article.published)}
                    title={article.published ? "إخفاء المقال" : "نشر المقال"}
                  >
                    {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/articles/edit/${article.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={article.image_url} alt={article.title_ar} className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-sm mb-2">{article.excerpt_ar?.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>الكاتب: {article.author_name}</p>
                <p>تاريخ النشر: {formatDate(article.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesManagement;