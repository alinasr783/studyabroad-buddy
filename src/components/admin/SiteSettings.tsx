import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { Phone, Mail, MessageCircle, Globe, Palette } from "lucide-react";

interface SiteSettings {
  id?: string;
  site_name: string;
  site_logo: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  about_description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "StudyWay",
    site_logo: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    about_description: "",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    accent_color: "#F59E0B"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();

      if (existingData) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('site_settings')
          .insert([settings]);

        if (error) throw error;
      }
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الموقع بنجاح"
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إعدادات الموقع</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">اسم الموقع</label>
              <Input
                value={settings.site_name}
                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                placeholder="StudyWay"
              />
            </div>
            <div>
              <label className="text-sm font-medium">رابط الشعار</label>
              <Input
                value={settings.site_logo}
                onChange={(e) => setSettings({...settings, site_logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="text-sm font-medium">وصف صفحة من نحن</label>
              <Textarea
                value={settings.about_description}
                onChange={(e) => setSettings({...settings, about_description: e.target.value})}
                placeholder="وصف مفصل عن الموقع والخدمات..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              معلومات التواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                placeholder="info@studyway.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                رقم الواتساب
              </label>
              <Input
                value={settings.whatsapp}
                onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-medium">العنوان</label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                placeholder="العنوان الكامل للمكتب..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Theme */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              ألوان الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">اللون الأساسي</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">اللون الثانوي</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                    placeholder="#10B981"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">لون التمييز</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => setSettings({...settings, accent_color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.accent_color}
                    onChange={(e) => setSettings({...settings, accent_color: e.target.value})}
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">معاينة الألوان:</p>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: settings.primary_color }}
                  title="اللون الأساسي"
                ></div>
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: settings.secondary_color }}
                  title="اللون الثانوي"
                ></div>
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: settings.accent_color }}
                  title="لون التمييز"
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettings;