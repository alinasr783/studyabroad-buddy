import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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

const Universities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('featured', { ascending: false })
        .order('ranking', { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-4xl font-bold mb-4">الجامعات المتاحة</h1>
        <p className="text-xl text-muted-foreground">اختر الجامعة المناسبة لك</p>
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
              <CardTitle className="text-xl mb-2">
                {university.name_ar}
              </CardTitle>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {university.description_ar}
              </p>
              <div className="space-y-2 text-sm">
                {university.students_count && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الطلاب:</span>
                    <span className="font-medium">{university.students_count}</span>
                  </div>
                )}
                {university.ranking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الترتيب العالمي:</span>
                    <span className="font-medium">#{university.ranking}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Universities;