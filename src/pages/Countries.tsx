import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('featured', { ascending: false })
        .order('name_en');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
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
        <h1 className="text-4xl font-bold mb-4">الدول المتاحة للدراسة</h1>
        <p className="text-xl text-muted-foreground">اختر الدولة التي تريد الدراسة فيها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card 
            key={country.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/countries/${country.id}`)}
          >
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                {country.image_url ? (
                  <img 
                    src={country.image_url} 
                    alt={country.name_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-6xl">{country.flag_emoji || "🏛️"}</span>
                  </div>
                )}
                {country.featured && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    مميز
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <span>{country.flag_emoji}</span>
                <span>{country.name_ar}</span>
              </CardTitle>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {country.description_ar}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الجامعات:</span>
                  <span className="font-medium">{country.universities_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الطلاب:</span>
                  <span className="font-medium">{country.students_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Countries;