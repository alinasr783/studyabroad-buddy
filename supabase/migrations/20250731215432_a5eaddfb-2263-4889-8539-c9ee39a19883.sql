-- Update countries with landmark images
UPDATE public.countries 
SET image_url = '/src/assets/usa-landmark.jpg'
WHERE name_en = 'United States';

UPDATE public.countries 
SET image_url = '/src/assets/canada-landmark.jpg'
WHERE name_en = 'Canada';

UPDATE public.countries 
SET image_url = '/src/assets/uk-landmark.jpg'
WHERE name_en = 'United Kingdom';

UPDATE public.countries 
SET image_url = '/src/assets/russia-landmark.jpg'
WHERE name_en = 'Russia';

UPDATE public.countries 
SET image_url = '/src/assets/kyrgyzstan-landmark.jpg'
WHERE name_en = 'Kyrgyzstan';

UPDATE public.countries 
SET image_url = '/src/assets/uzbekistan-landmark.jpg'
WHERE name_en = 'Uzbekistan';

-- Update universities with campus images
UPDATE public.universities 
SET image_url = '/src/assets/harvard-university.jpg'
WHERE name_en = 'Harvard University';

UPDATE public.universities 
SET image_url = '/src/assets/toronto-university.jpg'
WHERE name_en = 'University of Toronto';

UPDATE public.universities 
SET image_url = '/src/assets/oxford-university.jpg'
WHERE name_en = 'University of Oxford';

-- Update programs with subject images
UPDATE public.programs 
SET image_url = '/src/assets/computer-science.jpg'
WHERE name_en = 'Computer Science';

UPDATE public.programs 
SET image_url = '/src/assets/business-admin.jpg'
WHERE name_en = 'Business Administration';

UPDATE public.programs 
SET image_url = '/src/assets/medicine.jpg'
WHERE name_en = 'Medicine';

-- Update articles with relevant images
UPDATE public.articles 
SET image_url = '/src/assets/article-study-destinations.jpg'
WHERE title_en = 'Top 10 Study Destinations for 2024';

UPDATE public.articles 
SET image_url = '/src/assets/article-student-visa.jpg'
WHERE title_en = 'How to Get a Student Visa';

UPDATE public.articles 
SET image_url = '/src/assets/article-scholarships.jpg'
WHERE title_en = 'Scholarship Opportunities';