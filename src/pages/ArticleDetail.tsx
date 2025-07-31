import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, Clock } from "lucide-react";

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
  updated_at: string;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticleData();
    }
  }, [id]);

  const fetchArticleData = async () => {
    try {
      // Fetch article details
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (articleError) throw articleError;
      setArticle(articleData);

      // Fetch related articles
      const { data: relatedData, error: relatedError } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (relatedError) throw relatedError;
      setRelatedArticles(relatedData || []);
    } catch (error) {
      console.error('Error fetching article data:', error);
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

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} دقائق قراءة`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Button onClick={() => navigate('/articles')}>
            العودة لصفحة المقالات
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/articles')}
              >
                ← العودة للمقالات
              </Button>
              {article.featured && (
                <Badge variant="default">مقال مميز</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {article.title_ar}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground text-sm mb-6">
              {article.author_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>بواسطة: {article.author_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              {article.content_ar && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(article.content_ar)}</span>
                </div>
              )}
            </div>

            {article.excerpt_ar && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt_ar}
              </p>
            )}
          </div>

          {/* Article Image */}
          {article.image_url && (
            <div className="mb-8">
              <img 
                src={article.image_url} 
                alt={article.title_ar}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content_ar ? 
                      article.content_ar.replace(/\n/g, '<br><br>') : 
                      'لا يوجد محتوى متاح'
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card 
                    key={relatedArticle.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      navigate(`/articles/${relatedArticle.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <CardHeader className="p-0">
                      <div className="h-32 w-full overflow-hidden rounded-t-lg">
                        {relatedArticle.image_url ? (
                          <img 
                            src={relatedArticle.image_url} 
                            alt={relatedArticle.title_ar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-2xl">📰</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {relatedArticle.title_ar}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedArticle.excerpt_ar}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        {relatedArticle.author_name && (
                          <span>{relatedArticle.author_name}</span>
                        )}
                        <span>{formatDate(relatedArticle.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleDetail;