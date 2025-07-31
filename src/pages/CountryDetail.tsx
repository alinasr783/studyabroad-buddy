import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Users, GraduationCap, TrendingUp } from "lucide-react";

interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  flag_emoji: string;
  image_url: string;
  universities_count: number;
  students_count: string;
  featured: boolean;
}

interface University {
  id: string;
  name_ar: string;
  description_ar: string;
  image_url: string;
  ranking: number;
  students_count: string;
  featured: boolean;
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

const CountryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCountryData();
    }
  }, [id]);

  const fetchCountryData = async () => {
    try {
      // Fetch country details
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('id', id)
        .single();

      if (countryError) throw countryError;
      setCountry(countryData);

      // Fetch universities in this country
      const { data: universitiesData, error: universitiesError } = await supabase
        .from('universities')
        .select('*')
        .eq('country_id', id)
        .order('featured', { ascending: false })
        .order('ranking', { ascending: true });

      if (universitiesError) throw universitiesError;
      setUniversities(universitiesData || []);

      // Fetch programs in universities of this country
      const universityIds = universitiesData?.map(u => u.id) || [];
      if (universityIds.length > 0) {
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .in('university_id', universityIds)
          .order('featured', { ascending: false })
          .limit(6);

        if (programsError) throw programsError;
        setPrograms(programsData || []);
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
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

  if (!country) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">الدولة غير موجودة</h1>
          <Button onClick={() => navigate('/countries')}>
            العودة لصفحة الدول
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
        {country.image_url ? (
          <img 
            src={country.image_url} 
            alt={country.name_ar}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl">{country.flag_emoji || "🏛️"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl">{country.flag_emoji}</span>
              <h1 className="text-5xl font-bold">{country.name_ar}</h1>
            </div>
            {country.featured && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                دولة مميزة
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Country Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">نبذة عن {country.name_ar}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {country.description_ar}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  إحصائيات التعليم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">عدد الجامعات:</span>
                  <span className="font-bold text-lg">{country.universities_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">عدد الطلاب:</span>
                  <span className="font-bold text-lg">{country.students_count}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">وجهة دراسية مميزة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">مجتمع طلابي متنوع</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">نظام تعليمي متطور</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Universities */}
        {universities.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">الجامعات في {country.name_ar}</h2>
              <Button variant="outline" onClick={() => navigate('/universities')}>
                عرض جميع الجامعات
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <Card 
                  key={university.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/universities/${university.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      {university.image_url ? (
                        <img 
                          src={university.image_url} 
                          alt={university.name_ar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl">🏛️</span>
                        </div>
                      )}
                      {university.featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          مميز
                        </Badge>
                      )}
                      {university.ranking && (
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          ترتيب #{university.ranking}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{university.name_ar}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {university.description_ar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Programs */}
        {programs.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">أفضل البرامج الدراسية</h2>
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
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {program.description_ar}
                    </p>
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

export default CountryDetail;