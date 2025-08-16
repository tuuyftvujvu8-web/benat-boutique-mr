-- Drop existing tables and create new game structure
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Create questions table for the puzzle game
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 answer options
  correct_answer INTEGER NOT NULL, -- Index of correct answer (0-3)
  stage INTEGER NOT NULL CHECK (stage IN (1, 2)),
  difficulty INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game sessions table to track player progress
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  current_stage INTEGER NOT NULL DEFAULT 1,
  current_question INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  completed_questions JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN NOT NULL DEFAULT false
);

-- Create high scores table
CREATE TABLE public.high_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  stage_reached INTEGER NOT NULL,
  completion_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.high_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions (public read access)
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions 
FOR SELECT 
USING (true);

-- RLS Policies for game sessions (players can only access their own sessions)
CREATE POLICY "Players can view their own sessions" 
ON public.game_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Players can create and update their own sessions" 
ON public.game_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- RLS Policies for high scores (public read access)
CREATE POLICY "High scores are viewable by everyone" 
ON public.high_scores 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create high scores" 
ON public.high_scores 
FOR INSERT 
WITH CHECK (true);

-- Add update triggers
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial questions for Stage 1 (Basic Mauritania)
INSERT INTO public.questions (question_text, options, correct_answer, stage, points) VALUES
('ما هو لون علم موريتانيا؟', '["أخضر وذهبي", "أحمر وأبيض", "أزرق وأبيض", "أسود وأحمر"]', 0, 1, 10),
('ما هي عاصمة موريتانيا؟', '["نواكشوط", "نواذيبو", "كيفة", "أطار"]', 0, 1, 10),
('ما هي العملة الرسمية لموريتانيا؟', '["الأوقية", "الدرهم", "الدينار", "الفرنك"]', 0, 1, 10),
('كم عدد اللغات الرسمية في موريتانيا؟', '["ثلاث لغات", "لغتان", "لغة واحدة", "أربع لغات"]', 0, 1, 10),
('ما هو الاسم القديم لنواكشوط؟', '["لم يكن لها اسم", "تيشيت", "شنقيط", "ولاته"]', 0, 1, 15),
('أي من هذه المدن تقع على الساحل الموريتاني؟', '["نواذيبو", "أطار", "كيفة", "تجكجة"]', 0, 1, 10),
('ما هو المحيط الذي يحد موريتانيا؟', '["الأطلسي", "الهندي", "الهادئ", "المتجمد الشمالي"]', 0, 1, 10),
('كم عدد الولايات في موريتانيا؟', '["13 ولاية", "12 ولاية", "15 ولاية", "14 ولاية"]', 0, 1, 15),
('ما هي أكبر مدينة في موريتانيا؟', '["نواكشوط", "نواذيبو", "كيفة", "زويرات"]', 0, 1, 10),
('أي من هذه الدول لا تحد موريتانيا؟', '["تونس", "المغرب", "الجزائر", "السنغال"]', 0, 1, 10),
('ما هو الرمز الذي يوجد في وسط العلم الموريتاني؟', '["الهلال والنجمة", "النسر", "الأسد", "النخلة"]', 0, 1, 15),
('متى استقلت موريتانيا؟', '["1960", "1956", "1962", "1958"]', 0, 1, 15),
('ما هي اللغة الرسمية الأولى في موريتانيا؟', '["العربية", "الفرنسية", "البولار", "الولوف"]', 0, 1, 10),
('أي من هذه المعادن يُستخرج بكثرة في موريتانيا؟', '["الحديد", "الذهب", "النحاس", "الفضة"]', 0, 1, 15),
('ما هو المناخ السائد في موريتانيا؟', '["صحراوي", "استوائي", "معتدل", "قطبي"]', 0, 1, 10),
('أي من هذه المدن تشتهر بالتمور؟', '["أطار", "نواكشوط", "نواذيبو", "تجكجة"]', 0, 1, 15),
('ما هو النهر الوحيد في موريتانيا؟', '["نهر السنغال", "نهر النيل", "نهر النيجر", "نهر الكونغو"]', 0, 1, 15),
('كم تبلغ مساحة موريتانيا تقريباً؟', '["مليون كم²", "500 ألف كم²", "1.5 مليون كم²", "2 مليون كم²"]', 0, 1, 20),
('ما هو أعلى جبل في موريتانيا؟', '["كدية إيجيل", "جبل أسود", "جبل تاغانت", "جبل العاصمة"]', 0, 1, 20),
('متى تم تغيير العلم الموريتاني لآخر مرة؟', '["2017", "2010", "2008", "2015"]', 0, 1, 20);

-- Insert initial questions for Stage 2 (Culture and History)
INSERT INTO public.questions (question_text, options, correct_answer, stage, points) VALUES
('من هو الشاعر الموريتاني المعروف بـ "شاعر المليون"؟', '["أحمدو ولد عبد القادر", "محمد ولد الطلبة", "سيدي محمد ولد الشيخ سيديا", "محمد محمود ولد التلاميد"]', 0, 2, 25),
('ما هي المدينة التي تُعرف بـ "منارة العلم"؟', '["شنقيط", "تيشيت", "ولاته", "وادان"]', 0, 2, 20),
('أي من هذه الأطباق يُعتبر طبقاً تقليدياً موريتانياً؟', '["الكسكس", "الملوخية", "المندي", "الكبسة"]', 0, 2, 15),
('من هو أول رئيس لموريتانيا؟', '["المختار ولد داداه", "معاوية ولد سيد أحمد الطايع", "صدام ولد بونعامة", "عثمان ولد صالح"]', 0, 2, 25),
('ما هي الآلة الموسيقية التقليدية في موريتانيا؟', '["التيدينيت", "العود", "الطبلة", "الناي"]', 0, 2, 20),
('أي من هذه القبائل تُعتبر من أكبر القبائل في موريتانيا؟', '["أولاد مبارك", "الرگيبات", "إدوعيش", "أولاد دليم"]', 0, 2, 30),
('ما هو الاسم التقليدي للخيمة الموريتانية؟', '["الخيمة الحسانية", "البيت الشعري", "الخيمة البدوية", "البيت القطني"]', 0, 2, 25),
('من هو العالم الموريتاني الذي أسس جامعة شنقيط؟', '["الشيخ سيديا الكبير", "الشيخ ماء العينين", "الشيخ سعد بوه", "المختار الكنتي"]', 0, 2, 30),
('ما هو المعلم التاريخي الأشهر في شنقيط؟', '["مكتبة الحبوت", "المسجد العتيق", "دار القرآن", "بيت الحكمة"]', 0, 2, 25),
('أي من هذه المهرجانات يُقام سنوياً في موريتانيا؟', '["مهرجان المدن القديمة", "مهرجان الشعر", "مهرجان الصحراء", "مهرجان البحر"]', 0, 2, 20),
('ما هو الشراب التقليدي في موريتانيا؟', '["أتاي (الشاي)", "القهوة", "اللبن", "العصير"]', 0, 2, 15),
('من هو الرحالة الذي زار موريتانيا في القرن 14؟', '["ابن بطوطة", "ابن خلدون", "المقريزي", "الإدريسي"]', 0, 2, 30),
('ما هي اللغة المحلية الأكثر انتشاراً في موريتانيا؟', '["الحسانية", "البولار", "الصوننكية", "الولوف"]', 0, 2, 20),
('أي من هذه المواقع مُدرج في قائمة اليونسكو للتراث العالمي؟', '["مدن شنقيط القديمة", "منتزه بانك دارغين الوطني", "جزر بناك", "وادي نهر السنغال"]', 0, 2, 35),
('ما هو الطقس التقليدي لاستقبال الضيوف في موريتانيا؟', '["تقديم الشاي", "تقديم القهوة", "تقديم التمر", "تقديم اللبن"]', 0, 2, 20),
('من هو الملك الذي حكم مملكة غانا القديمة؟', '["تونكا مانين", "سونياتا كيتا", "مانسا موسى", "علي بير"]', 0, 2, 35),
('ما هي الحرفة التقليدية الأشهر في موريتانيا؟', '["دباغة الجلود", "النسيج", "الخزف", "الحدادة"]', 0, 2, 25),
('أي من هذه الأماكن يُعتبر من أهم مراكز التجارة التاريخية؟', '["ولاته", "شنقيط", "تيشيت", "وادان"]', 0, 2, 30),
('ما هو الزي التقليدي للرجال في موريتانيا؟', '["الدراعة", "الجلابية", "القفطان", "العباءة"]', 0, 2, 20),
('من هو الشاعر الموريتاني الحديث الأشهر؟', '["أحمدو ولد عبد القادر", "محمد محمود ولد التلاميد", "سيدي محمد ولد الشيخ سيديا", "إبراهيم ولد المختار"]', 0, 2, 25);