import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// تأكد من تحميل Quill بعد تحميل الصفحة
let Quill: any = null;

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب هنا...',
  className 
}: RichTextEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && !Quill) {
        // تحميل Quill ديناميكياً
        const QuillModule = await import('quill');
        Quill = QuillModule.default;
      }

      if (Quill && containerRef.current && !quillRef.current) {
        // إعداد أدوات التحرير
        const toolbarOptions = [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean']
        ];

        quillRef.current = new Quill(containerRef.current, {
          theme: 'snow',
          placeholder,
          modules: {
            toolbar: toolbarOptions
          },
          formats: [
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'script',
            'list', 'bullet',
            'indent',
            'direction', 'align',
            'blockquote', 'code-block',
            'link', 'image', 'video'
          ]
        });

        // إضافة المحتوى المبدئي
        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        // الاستماع للتغييرات
        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          onChange?.(html);
        });
      }
    };

    loadQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // تحديث المحتوى عند تغيير القيمة من الخارج
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <link
        href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
        rel="stylesheet"
      />
      <div 
        ref={containerRef}
        className="min-h-[200px] bg-background border border-border rounded-md"
        style={{
          '--ql-primary': 'hsl(var(--primary))',
        } as React.CSSProperties}
      />
      <style jsx>{`
        .ql-toolbar {
          border-top: 1px solid hsl(var(--border)) !important;
          border-left: 1px solid hsl(var(--border)) !important;
          border-right: 1px solid hsl(var(--border)) !important;
          border-radius: 6px 6px 0 0 !important;
          background: hsl(var(--background)) !important;
        }
        .ql-container {
          border-bottom: 1px solid hsl(var(--border)) !important;
          border-left: 1px solid hsl(var(--border)) !important;
          border-right: 1px solid hsl(var(--border)) !important;
          border-radius: 0 0 6px 6px !important;
          background: hsl(var(--background)) !important;
        }
        .ql-editor {
          color: hsl(var(--foreground)) !important;
          font-family: inherit !important;
          direction: rtl !important;
          text-align: right !important;
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground)) !important;
          right: 15px !important;
          left: auto !important;
        }
        .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
        }
        .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground)) !important;
        }
        .ql-toolbar button:hover .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .ql-toolbar button:hover .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;