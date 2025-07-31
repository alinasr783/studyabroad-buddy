import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  capital: string | null;
  population: number | null;
  acceptance_rate: number | null;
  living_cost: number | null;
  featured: boolean;
  universities_count: number | null;
  students_count: string | null;
}

const CountriesManagement = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_en');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من جلب بيانات الدول",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدولة؟')) return;
    
    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الدولة بنجاح"
      });
      
      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف الدولة",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة الدول</h2>
        <Button onClick={() => navigate('/admin/countries/add')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة دولة جديدة
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <Card key={country.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{country.name_ar}</CardTitle>
                  <p className="text-sm text-muted-foreground">{country.name_en}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/countries/edit/${country.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(country.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={country.image_url} alt={country.name_ar} className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-sm mb-2">{country.description_ar?.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>العاصمة: {country.capital || 'غير محدد'}</p>
                <p>عدد السكان: {country.population ? country.population.toLocaleString() : 'غير محدد'}</p>
                <p>نسبة القبول: {country.acceptance_rate ? `${country.acceptance_rate}%` : 'غير محدد'}</p>
                <p>تكلفة المعيشة: {country.living_cost ? `$${country.living_cost.toLocaleString()}` : 'غير محدد'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CountriesManagement;