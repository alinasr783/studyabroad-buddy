import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Users, GraduationCap, TrendingUp, Globe, Award } from "lucide-react";

interface University {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  ranking: number;
  students_count: string;
  website_url: string;
  featured: boolean;
  country_id: string;
}

interface Program {
  id: string;
  name_ar: string;
  description_ar: string;
  image_url: string;
  degree_level: string;
  duration: string;
  language: string;
  tuition_fee: string;
  featured: boolean;
}

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUniversityData();
    }
  }, [id]);

  const fetchUniversityData = async () => {
    try {
      // Fetch university details
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (universityError) throw universityError;
      setUniversity(universityData);

      // Fetch programs in this university
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .eq('university_id', id)
        .order('featured', { ascending: false })
        .order('name_ar');

      if (programsError) throw programsError;
      setPrograms(programsData || []);
    } catch (error) {
      console.error('Error fetching university data:', error);
    } finally {
      setLoading(false);
    }
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">الجامعة غير موجودة</h1>
          <Button onClick={() => navigate('/universities')}>
            العودة لصفحة الجامعات
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {university.image_url ? (
          <img 
            src={university.image_url} 
            alt={university.name_ar}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl">🏛️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{university.name_ar}</h1>
            <div className="flex items-center justify-center gap-4">
              {university.featured && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  جامعة مميزة
                </Badge>
              )}
              {university.ranking && (
                <Badge variant="default" className="text-lg px-4 py-2">
                  ترتيب عالمي #{university.ranking}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* University Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">نبذة عن {university.name_ar}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  {university.description_ar}
                </p>
                {university.website_url && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <a 
                      href={university.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      زيارة الموقع الرسمي
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  إحصائيات الجامعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.ranking && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الترتيب العالمي:</span>
                    <span className="font-bold text-lg">#{university.ranking}</span>
                  </div>
                )}
                {university.students_count && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">عدد الطلاب:</span>
                    <span className="font-bold text-lg">{university.students_count}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">عدد البرامج:</span>
                  <span className="font-bold text-lg">{programs.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مميزات الجامعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-sm">تعليم عالي الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">مجتمع أكاديمي متنوع</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">فرص وظيفية ممتازة</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">موقع استراتيجي</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Programs */}
        {programs.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">البرامج الدراسية</h2>
              <Button variant="outline" onClick={() => navigate('/programs')}>
                عرض جميع البرامج
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card 
                  key={program.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      {program.image_url ? (
                        <img 
                          src={program.image_url} 
                          alt={program.name_ar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                      {program.featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          مميز
                        </Badge>
                      )}
                      {program.degree_level && (
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          {program.degree_level}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{program.name_ar}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {program.description_ar}
                    </p>
                    <div className="space-y-2 text-sm">
                      {program.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">المدة:</span>
                          <span className="font-medium">{program.duration}</span>
                        </div>
                      )}
                      {program.language && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">لغة الدراسة:</span>
                          <span className="font-medium">{program.language}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UniversityDetail;