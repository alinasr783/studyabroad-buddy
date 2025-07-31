import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  published: boolean;
  featured: boolean;
  created_at: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">المقالات والأخبار</h1>
        <p className="text-xl text-muted-foreground">اقرأ أحدث المقالات والنصائح للدراسة في الخارج</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card 
            key={article.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                {article.image_url ? (
                  <img 
                    src={article.image_url} 
                    alt={article.title_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                {article.featured && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    مميز
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2 line-clamp-2">
                {article.title_ar}
              </CardTitle>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                {article.excerpt_ar}
              </p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                {article.author_name && (
                  <span>بواسطة: {article.author_name}</span>
                )}
                <span>{formatDate(article.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Articles;