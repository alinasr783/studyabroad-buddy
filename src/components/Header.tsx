import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SiteSettings {
  site_name?: string;
  site_logo?: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['site_name', 'site_logo']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value_ar || setting.value_en;
          return acc;
        }, {} as SiteSettings);

        setSiteSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const navItems = [
    { name: "الرئيسية", path: "/" },
    { name: "الدول", path: "/countries" },
    { name: "الجامعات", path: "/universities" },
    { name: "البرامج", path: "/programs" },
    { name: "المقالات", path: "/articles" },
    { name: "من نحن", path: "/about" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {siteSettings.site_logo ? (
              <img 
                src={siteSettings.site_logo} 
                alt={siteSettings.site_name || "StudyWay"}
                className="h-8 w-auto"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
            )}
            <span className="text-xl font-bold text-foreground">
              {siteSettings.site_name || "StudyWay"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 px-4 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;