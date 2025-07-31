-- إنشاء سياسات مفتوحة تماماً لجميع buckets الموجودة
-- السماح للجميع بالقراءة من جميع الـ buckets
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (true);

-- السماح للجميع برفع الملفات في جميع الـ buckets
CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT WITH CHECK (true);

-- السماح للجميع بتحديث الملفات
CREATE POLICY "Anyone can update files" ON storage.objects
  FOR UPDATE USING (true);

-- السماح للجميع بحذف الملفات
CREATE POLICY "Anyone can delete files" ON storage.objects
  FOR DELETE USING (true);