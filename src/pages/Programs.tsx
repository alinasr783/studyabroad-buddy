import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  language: string;
  tuition_fee: string;
  duration: string;
  degree_level: string;
  featured: boolean;
  university_id: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('featured', { ascending: false })
        .order('name_ar');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
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
        <h1 className="text-4xl font-bold mb-4">البرامج الدراسية المتاحة</h1>
        <p className="text-xl text-muted-foreground">اختر البرنامج الدراسي المناسب لك</p>
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
              <CardTitle className="text-xl mb-2">
                {program.name_ar}
              </CardTitle>
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
                {program.tuition_fee && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرسوم:</span>
                    <span className="font-medium">{program.tuition_fee}</span>
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

export default Programs;