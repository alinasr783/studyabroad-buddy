import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
}

interface SiteSettings {
  site_name?: string;
  site_description?: string;
}

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', [
          'contact_phone', 'contact_email', 'contact_address', 'contact_whatsapp',
          'site_name', 'site_description'
        ]);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value_ar || setting.value_en;
          return acc;
        }, {} as Record<string, string>);

        setContactInfo({
          phone: settings.contact_phone,
          email: settings.contact_email,
          address: settings.contact_address,
          whatsapp: settings.contact_whatsapp
        });

        setSiteSettings({
          site_name: settings.site_name,
          site_description: settings.site_description
        });
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (contactInfo.whatsapp) {
      const message = `مرحباً، أريد الاستفسار عن خدماتكم`;
      const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {siteSettings.site_name || "StudyWay"}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {siteSettings.site_description || "منصتك الموثوقة للدراسة في أفضل الجامعات العالمية"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/countries" className="text-muted-foreground hover:text-foreground transition-colors">
                  الدول
                </Link>
              </li>
              <li>
                <Link to="/universities" className="text-muted-foreground hover:text-foreground transition-colors">
                  الجامعات
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-muted-foreground hover:text-foreground transition-colors">
                  البرامج
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                  المقالات
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">خدماتنا</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  Are you the admin?
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات الاتصال</h3>
            <div className="space-y-3 text-sm">
              {contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{contactInfo.address}</span>
                </div>
              )}
              {contactInfo.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    واتساب
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {siteSettings.site_name || "StudyWay"}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;