import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  capital: string;
  population: number;
  acceptance_rate: number;
  living_cost: number;
  featured: boolean;
}

const CountriesManagement = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    image_url: "",
    capital: "",
    population: 0,
    acceptance_rate: 0,
    living_cost: 0,
    featured: false
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCountry) {
        const { error } = await supabase
          .from('countries')
          .update(formData)
          .eq('id', editingCountry.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الدولة بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة الدولة بنجاح"
        });
      }
      
      fetchCountries();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ الدولة",
        variant: "destructive"
      });
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

  const resetForm = () => {
    setFormData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      image_url: "",
      capital: "",
      population: 0,
      acceptance_rate: 0,
      living_cost: 0,
      featured: false
    });
    setEditingCountry(null);
  };

  const openEditDialog = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name_en: country.name_en,
      name_ar: country.name_ar,
      description_en: country.description_en,
      description_ar: country.description_ar,
      image_url: country.image_url,
      capital: country.capital,
      population: country.population,
      acceptance_rate: country.acceptance_rate,
      living_cost: country.living_cost,
      featured: country.featured
    });
    setShowDialog(true);
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة الدول</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowDialog(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة دولة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الاسم بالإنجليزية</label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الاسم بالعربية</label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">الوصف بالإنجليزية</label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">الوصف بالعربية</label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">رابط الصورة</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">العاصمة</label>
                  <Input
                    value={formData.capital}
                    onChange={(e) => setFormData({...formData, capital: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">عدد السكان</label>
                  <Input
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData({...formData, population: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نسبة القبول (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acceptance_rate}
                    onChange={(e) => setFormData({...formData, acceptance_rate: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">تكلفة المعيشة السنوية (USD)</label>
                  <Input
                    type="number"
                    value={formData.living_cost}
                    onChange={(e) => setFormData({...formData, living_cost: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <label className="text-sm font-medium">دولة مميزة</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingCountry ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(country)}>
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
              <p className="text-sm mb-2">{country.description_ar.substring(0, 100)}...</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>العاصمة: {country.capital}</p>
                <p>عدد السكان: {country.population.toLocaleString()}</p>
                <p>نسبة القبول: {country.acceptance_rate}%</p>
                <p>تكلفة المعيشة: ${country.living_cost.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CountriesManagement;