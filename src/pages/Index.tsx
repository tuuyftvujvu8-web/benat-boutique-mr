import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Trophy, Play, Clock, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  stage: number;
  points: number;
}

interface GameSession {
  id: string;
  player_name: string;
  current_stage: number;
  current_question: number;
  score: number;
  completed_questions: string[];
  is_completed: boolean;
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (gameStarted && !showResult && timer > 0 && !isAnswered) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timer, gameStarted, showResult, isAnswered]);

  const fetchQuestions = async (stage: number) => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('stage', stage)
      .order('created_at', { ascending: true });
    
    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الأسئلة",
        variant: "destructive"
      });
      return [];
    }
    
    return (data || []).map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : []
    })) as Question[];
  };

  const startGame = async () => {
    if (!playerName.trim()) {
      toast({
        title: "تنبيه",
        description: "يرجى إدخال اسمك أولاً",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Fetch stage 1 questions
    const stageQuestions = await fetchQuestions(1);
    setQuestions(stageQuestions);
    
    // Create new game session
    const { data: sessionData, error } = await supabase
      .from('game_sessions')
      .insert({
        player_name: playerName.trim(),
        current_stage: 1,
        current_question: 0,
        score: 0,
        completed_questions: []
      })
      .select()
      .single();

    if (error || !sessionData) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في بدء اللعبة",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    setCurrentSession({
      ...sessionData,
      completed_questions: Array.isArray(sessionData.completed_questions) ? sessionData.completed_questions : []
    } as GameSession);
    setCurrentQuestion(stageQuestions[0] || null);
    setGameStarted(true);
    setTimer(30);
    setLoading(false);
  };

  const handleAnswer = async (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion?.correct_answer;
    let newScore = currentSession?.score || 0;
    
    if (isCorrect) {
      newScore += currentQuestion?.points || 0;
      toast({
        title: "ممتاز! 🎉",
        description: `إجابة صحيحة! حصلت على ${currentQuestion?.points} نقطة`,
      });
    } else {
      toast({
        title: "إجابة خاطئة",
        description: `الإجابة الصحيحة هي: ${currentQuestion?.options[currentQuestion.correct_answer]}`,
        variant: "destructive"
      });
    }

    // Update session
    if (currentSession) {
      const updatedQuestions = [...(currentSession.completed_questions || []), currentQuestion?.id || ''];
      const nextQuestionIndex = currentSession.current_question + 1;
      
      await supabase
        .from('game_sessions')
        .update({
          score: newScore,
          current_question: nextQuestionIndex,
          completed_questions: updatedQuestions
        })
        .eq('id', currentSession.id);

      setCurrentSession(prev => prev ? {
        ...prev,
        score: newScore,
        current_question: nextQuestionIndex,
        completed_questions: updatedQuestions
      } : null);
    }

    // Wait 3 seconds then show next question or complete stage
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResult(true);
    toast({
      title: "انتهى الوقت ⏰",
      description: `الإجابة الصحيحة هي: ${currentQuestion?.options[currentQuestion.correct_answer]}`,
      variant: "destructive"
    });

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = async () => {
    if (!currentSession) return;

    const nextIndex = currentSession.current_question;
    
    if (nextIndex >= questions.length) {
      // Stage complete
      if (currentSession.current_stage === 1) {
        // Move to stage 2
        const stage2Questions = await fetchQuestions(2);
        setQuestions(stage2Questions);
        
        await supabase
          .from('game_sessions')
          .update({
            current_stage: 2,
            current_question: 0
          })
          .eq('id', currentSession.id);

        setCurrentSession(prev => prev ? {
          ...prev,
          current_stage: 2,
          current_question: 0
        } : null);
        
        setCurrentQuestion(stage2Questions[0] || null);
        toast({
          title: "مرحباً بك في المرحلة الثانية! 🚀",
          description: "الآن ستواجه أسئلة أكثر تحدياً",
        });
      } else {
        // Game complete
        await completeGame();
        return;
      }
    } else {
      setCurrentQuestion(questions[nextIndex] || null);
    }

    setSelectedAnswer(null);
    setShowResult(false);
    setIsAnswered(false);
    setTimer(30);
  };

  const completeGame = async () => {
    if (!currentSession) return;

    await supabase
      .from('game_sessions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', currentSession.id);

    // Add to high scores
    await supabase
      .from('high_scores')
      .insert({
        player_name: currentSession.player_name,
        total_score: currentSession.score,
        stage_reached: currentSession.current_stage
      });

    toast({
      title: "تهانينا! 🏆",
      description: `لقد أكملت اللعبة بنجاح! نقاطك النهائية: ${currentSession.score}`,
    });

    setGameStarted(false);
    setCurrentSession(null);
  };

  // SEO structured data
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ألغاز موريتانيا - لعبة الثقافة الموريتانية",
      "description": "لعبة ألغاز تفاعلية تختبر معرفتك بثقافة وتاريخ موريتانيا",
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "url": window.location.href,
      "author": {
        "@type": "Organization",
        "name": "ألغاز موريتانيا"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in">
              🇲🇷 ألغاز موريتانيا
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              اختبر معرفتك بثقافة وتاريخ موريتانيا الحبيبة في رحلة تفاعلية مليئة بالتحديات
            </p>
          </header>

          {/* Game Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>مرحلتان</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  20 سؤال في كل مرحلة - من الأساسيات إلى التحديات المتقدمة
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>30 ثانية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  لكل سؤال وقت محدد - فكر بسرعة وأجب بثقة
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>نقاط متدرجة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  10-35 نقطة حسب صعوبة السؤال - اجمع أكبر عدد من النقاط
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Start Game Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>ابدأ المغامرة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                  ما اسمك؟
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="أدخل اسمك هنا"
                  className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={50}
                />
              </div>
              <Button 
                onClick={startGame} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "جاري البدء..." : (
                  <>
                    <Play className="w-4 h-4 ml-2" />
                    ابدأ اللعبة
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Game Features */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-6">ماذا ستتعلم؟</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">🎯 المرحلة الأولى - الأساسيات</h3>
                <p className="text-sm text-muted-foreground">
                  العلم، العاصمة، العملة، الجغرافيا الأساسية
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">🏆 المرحلة الثانية - الثقافة والتاريخ</h3>
                <p className="text-sm text-muted-foreground">
                  الشعراء، التراث، التاريخ، الشخصيات المهمة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              المرحلة {currentSession?.current_stage}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              السؤال {(currentSession?.current_question || 0) + 1}/20
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-bold text-xl">{currentSession?.score || 0}</span>
            </div>
            <div className={`flex items-center gap-2 ${timer <= 10 ? 'text-destructive animate-pulse' : ''}`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-xl">{timer}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2 mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSession?.current_question || 0) / 20) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Badge className="text-sm">
                  {currentQuestion.points} نقطة
                </Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl leading-relaxed">
                {currentQuestion.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showResult 
                      ? index === currentQuestion.correct_answer 
                        ? "default" 
                        : selectedAnswer === index 
                          ? "destructive" 
                          : "outline"
                      : selectedAnswer === index 
                        ? "secondary" 
                        : "outline"
                  }
                  className="w-full p-6 text-right justify-start text-lg"
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                >
                  <span className="ml-auto">{option}</span>
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}</span>
                </Button>
              ))}
              
              {showResult && (
                <div className="text-center pt-4">
                  <p className="text-muted-foreground">
                    {selectedAnswer === currentQuestion.correct_answer 
                      ? "🎉 إجابة ممتازة!" 
                      : "❌ إجابة خاطئة - حاول مرة أخرى في السؤال التالي"
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;