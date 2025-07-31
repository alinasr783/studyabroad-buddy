import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, Globe, DollarSign, BookOpen, MessageCircle, Phone, Mail } from "lucide-react";

interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  requirements_en: string;
  requirements_ar: string;
  image_url: string;
  language: string;
  tuition_fee: string;
  duration: string;
  degree_level: string;
  featured: boolean;
  university_id: string;
}

interface ContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    education_level: "",
    nationality: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProgramData();
      fetchContactInfo();
    }
  }, [id]);

  const fetchProgramData = async () => {
    try {
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (programError) throw programError;
      setProgram(programData);
    } catch (error) {
      console.error('Error fetching program data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('phone, email, whatsapp')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContactInfo({
          phone: data.phone || '',
          email: data.email || '',
          whatsapp: data.whatsapp || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `طلب استشارة للبرنامج: ${program?.name_ar}\n\nالمستوى التعليمي: ${formData.education_level}\nالجنسية: ${formData.nationality}\n\nالرسالة: ${formData.message}`,
          education_level: formData.education_level,
          nationality: formData.nationality,
          program_id: id,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنتواصل معك قريباً لمناقشة التفاصيل"
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        education_level: "",
        nationality: ""
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (contactInfo.whatsapp && program) {
      const message = `مرحباً، أريد الاستفسار عن البرنامج الدراسي: ${program.name_ar}`;
      const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
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

  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">البرنامج غير موجود</h1>
          <Button onClick={() => navigate('/programs')}>
            العودة لصفحة البرامج
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
        {program.image_url ? (
          <img 
            src={program.image_url} 
            alt={program.name_ar}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl">📚</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{program.name_ar}</h1>
            <div className="flex items-center justify-center gap-4">
              {program.featured && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  برنامج مميز
                </Badge>
              )}
              {program.degree_level && (
                <Badge variant="default" className="text-lg px-4 py-2">
                  {program.degree_level}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Program Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">نبذة عن البرنامج</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {program.description_ar}
                </p>
              </CardContent>
            </Card>

            {program.requirements_ar && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">متطلبات القبول</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: program.requirements_ar.replace(/\n/g, '<br>') 
                    }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  تفاصيل البرنامج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {program.duration && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">المدة:</span>
                    </div>
                    <span className="font-medium">{program.duration}</span>
                  </div>
                )}
                {program.language && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">لغة الدراسة:</span>
                    </div>
                    <span className="font-medium">{program.language}</span>
                  </div>
                )}
                {program.tuition_fee && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">الرسوم:</span>
                    </div>
                    <span className="font-medium">{program.tuition_fee}</span>
                  </div>
                )}
                {program.degree_level && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">الدرجة:</span>
                    </div>
                    <span className="font-medium">{program.degree_level}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>تواصل سريع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contactInfo.whatsapp && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    واتساب
                  </Button>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{contactInfo.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">طلب حجز / استشارة</CardTitle>
            <p className="text-muted-foreground">املأ النموذج أدناه وسنتواصل معك لمناقشة التفاصيل</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="الاسم الكامل *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="رقم الهاتف *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="الجنسية"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>
              <div>
                <Input
                  placeholder="المستوى التعليمي الحالي"
                  value={formData.education_level}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                />
              </div>
              <div></div>
              <div className="md:col-span-2">
                <Textarea
                  placeholder="رسالتك أو أسئلتك حول البرنامج"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "جاري الإرسال..." : "إرسال طلب الاستشارة"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramDetail;