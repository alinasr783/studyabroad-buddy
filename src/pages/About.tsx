import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [content, setContent] = useState({
    title: "من نحن",
    description: "نحن منصة رائدة لمساعدة الطلاب في الحصول على فرص الدراسة في أفضل الجامعات العالمية",
    mission: "مساعدة الطلاب العرب في تحقيق أحلامهم الأكاديمية",
    vision: "أن نكون الجسر الذي يربط بين الطلاب وأفضل الجامعات العالمية"
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['about_title', 'about_description', 'about_mission', 'about_vision']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value_ar || setting.value_en;
          return acc;
        }, {} as Record<string, string>);

        setContent({
          title: settings.about_title || content.title,
          description: settings.about_description || content.description,
          mission: settings.about_mission || content.mission,
          vision: settings.about_vision || content.vision
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 text-primary">رؤيتنا</h2>
            <p className="text-muted-foreground leading-relaxed">
              {content.vision}
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 text-primary">مهمتنا</h2>
            <p className="text-muted-foreground leading-relaxed">
              {content.mission}
            </p>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">لماذا نحن؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">دقة في الاختيار</h3>
              <p className="text-muted-foreground">نساعدك في اختيار الجامعة والتخصص المناسب لك</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">خبرة واسعة</h3>
              <p className="text-muted-foreground">فريق من الخبراء في مجال التعليم الدولي</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">دعم شامل</h3>
              <p className="text-muted-foreground">نرافقك في كل خطوة من رحلة الدراسة في الخارج</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;