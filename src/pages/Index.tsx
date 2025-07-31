import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    site_name: "StudyWay",
    hero_title: "ابدأ رحلتك التعليمية",
    hero_subtitle: "اكتشف أفضل الجامعات والبرامج الدراسية حول العالم"
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['site_name', 'hero_title', 'hero_subtitle']);

      if (settings && settings.length > 0) {
        const settingsObj = settings.reduce((acc, setting) => {
          acc[setting.key] = setting.value_ar || setting.value_en;
          return acc;
        }, {});
        setSiteSettings(prev => ({ ...prev, ...settingsObj }));
      }

      // Fetch featured content
      const [countries, universities, programs, articles] = await Promise.all([
        supabase.from('countries').select('*').eq('featured', true).limit(3),
        supabase.from('universities').select('*').eq('featured', true).limit(3),
        supabase.from('programs').select('*').eq('featured', true).limit(3),
        supabase.from('articles').select('*').eq('featured', true).eq('published', true).limit(3)
      ]);

      setFeaturedCountries(countries.data || []);
      setFeaturedUniversities(universities.data || []);
      setFeaturedPrograms(programs.data || []);
      setFeaturedArticles(articles.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {siteSettings.hero_title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {siteSettings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/universities')}>
              استكشف الجامعات
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              احجز استشارة
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      {featuredCountries.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">أفضل الدول للدراسة</h2>
              <p className="text-muted-foreground">اكتشف الوجهات التعليمية الأكثر شعبية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredCountries.map((country: any) => (
                <Card 
                  key={country.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/countries/${country.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      {country.image_url ? (
                        <img src={country.image_url} alt={country.name_ar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-6xl">{country.flag_emoji || "🏛️"}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <span>{country.flag_emoji}</span>
                      <span>{country.name_ar}</span>
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {country.description_ar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/countries')}>
                عرض جميع الدول
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Universities */}
      {featuredUniversities.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">أفضل الجامعات</h2>
              <p className="text-muted-foreground">جامعات مميزة بسمعة أكاديمية عالمية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredUniversities.map((university: any) => (
                <Card 
                  key={university.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/universities/${university.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      {university.image_url ? (
                        <img src={university.image_url} alt={university.name_ar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl">🏛️</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">{university.name_ar}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {university.description_ar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/universities')}>
                عرض جميع الجامعات
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">أفضل البرامج الدراسية</h2>
              <p className="text-muted-foreground">برامج أكاديمية متميزة في مختلف التخصصات</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredPrograms.map((program: any) => (
                <Card 
                  key={program.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      {program.image_url ? (
                        <img src={program.image_url} alt={program.name_ar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">{program.name_ar}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {program.description_ar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/programs')}>
                عرض جميع البرامج
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">أحدث المقالات</h2>
              <p className="text-muted-foreground">نصائح ومعلومات مفيدة للدراسة في الخارج</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredArticles.map((article: any) => (
                <Card 
                  key={article.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title_ar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl">📰</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2 line-clamp-2">{article.title_ar}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {article.excerpt_ar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/articles')}>
                عرض جميع المقالات
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
