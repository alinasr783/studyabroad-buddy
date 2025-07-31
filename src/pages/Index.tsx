import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg-new.jpg";
import usaLandmark from "@/assets/usa-landmark.jpg";
import canadaLandmark from "@/assets/canada-landmark.jpg";
import ukLandmark from "@/assets/uk-landmark.jpg";
import russiaLandmark from "@/assets/russia-landmark.jpg";
import kyrgyzstanLandmark from "@/assets/kyrgyzstan-landmark.jpg";
import uzbekistanLandmark from "@/assets/uzbekistan-landmark.jpg";
import harvardUniversity from "@/assets/harvard-university.jpg";
import torontoUniversity from "@/assets/toronto-university.jpg";
import oxfordUniversity from "@/assets/oxford-university.jpg";
import computerScience from "@/assets/computer-science.jpg";
import businessAdmin from "@/assets/business-admin.jpg";
import medicine from "@/assets/medicine.jpg";
import articleStudyDestinations from "@/assets/article-study-destinations.jpg";
import articleStudentVisa from "@/assets/article-student-visa.jpg";
import articleScholarships from "@/assets/article-scholarships.jpg";

const Index = () => {
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    site_name: "StudyWay",
    hero_title: "ابدأ رحلتك التعليمية",
    hero_subtitle: "اكتشف أفضل الجامعات والبرامج الدراسية حول العالم",
    hero_image: heroBg
  });
  const navigate = useNavigate();

  // Helper function to get default images
  const getCountryImage = (countryName: string) => {
    const imageMap = {
      'United States': usaLandmark,
      'الولايات المتحدة': usaLandmark,
      'Canada': canadaLandmark,
      'كندا': canadaLandmark,
      'United Kingdom': ukLandmark,
      'المملكة المتحدة': ukLandmark,
      'Russia': russiaLandmark,
      'روسيا': russiaLandmark,
      'Kyrgyzstan': kyrgyzstanLandmark,
      'قيرغيزستان': kyrgyzstanLandmark,
      'Uzbekistan': uzbekistanLandmark,
      'أوزبكستان': uzbekistanLandmark,
    };
    return imageMap[countryName] || null;
  };

  const getUniversityImage = (universityName: string) => {
    const imageMap = {
      'Harvard University': harvardUniversity,
      'جامعة هارفارد': harvardUniversity,
      'University of Toronto': torontoUniversity,
      'جامعة تورونتو': torontoUniversity,
      'University of Oxford': oxfordUniversity,
      'جامعة أكسفورد': oxfordUniversity,
    };
    return imageMap[universityName] || null;
  };

  const getProgramImage = (programName: string) => {
    const imageMap = {
      'Computer Science': computerScience,
      'علوم الحاسب': computerScience,
      'Business Administration': businessAdmin,
      'إدارة الأعمال': businessAdmin,
      'Medicine': medicine,
      'الطب': medicine,
    };
    return imageMap[programName] || null;
  };

  const getArticleImage = (articleTitle: string) => {
    const imageMap = {
      'Top 10 Study Destinations for 2024': articleStudyDestinations,
      'أفضل 10 وجهات دراسية لعام 2024': articleStudyDestinations,
      'How to Get a Student Visa': articleStudentVisa,
      'كيفية الحصول على فيزا طالب': articleStudentVisa,
      'Scholarship Opportunities': articleScholarships,
      'فرص المنح الدراسية': articleScholarships,
    };
    return imageMap[articleTitle] || null;
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('site_name, hero_image')
        .maybeSingle();

      if (settings) {
        setSiteSettings(prev => ({ 
          ...prev, 
          site_name: settings.site_name || 'StudyWay',
          hero_image: settings.hero_image || heroBg
        }));
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
      <section 
        className="relative min-h-[80vh] flex items-center justify-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${siteSettings.hero_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {siteSettings.hero_title}
          </h1>
          <p className="text-xl md:text-3xl mb-8 max-w-3xl mx-auto drop-shadow-lg">
            {siteSettings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate('/universities')}>
              استكشف الجامعات
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => navigate('/contact')}>
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
                      <img 
                        src={country.image_url || getCountryImage(country.name_en) || getCountryImage(country.name_ar)} 
                        alt={country.name_ar} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">
                      {country.name_ar}
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
                      <img 
                        src={university.image_url || getUniversityImage(university.name_en) || getUniversityImage(university.name_ar)} 
                        alt={university.name_ar} 
                        className="w-full h-full object-cover" 
                      />
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
                      <img 
                        src={program.image_url || getProgramImage(program.name_en) || getProgramImage(program.name_ar)} 
                        alt={program.name_ar} 
                        className="w-full h-full object-cover" 
                      />
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
                      <img 
                        src={article.image_url || getArticleImage(article.title_en) || getArticleImage(article.title_ar)} 
                        alt={article.title_ar} 
                        className="w-full h-full object-cover" 
                      />
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
