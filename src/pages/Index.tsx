import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type GameScreen = 'welcome' | 'route-select' | 'map' | 'task' | 'finish';
type RouteType = 'historical' | 'cultural' | 'natural';

interface Landmark {
  id: number;
  name: string;
  description: string;
  route: RouteType;
  x: number;
  y: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  hint: string;
}

const landmarks: Landmark[] = [
  {
    id: 1,
    name: 'Площадь Ленина',
    description: 'Центральная площадь города, место проведения главных городских мероприятий.',
    route: 'historical',
    x: 50,
    y: 30,
    question: 'В каком году была основана площадь Ленина?',
    answers: ['1945', '1960', '1975', '1990'],
    correctAnswer: 1,
    hint: 'Это произошло в период активной застройки города.'
  },
  {
    id: 2,
    name: 'Краеведческий музей',
    description: 'Музей хранит историю Жлобина с древних времён до наших дней.',
    route: 'cultural',
    x: 35,
    y: 45,
    question: 'Сколько экспонатов хранится в краеведческом музее?',
    answers: ['Более 5000', 'Более 10000', 'Более 15000', 'Более 20000'],
    correctAnswer: 2,
    hint: 'Коллекция музея очень обширная.'
  },
  {
    id: 3,
    name: 'Набережная Днепра',
    description: 'Живописное место для прогулок вдоль реки Днепр.',
    route: 'natural',
    x: 70,
    y: 60,
    question: 'Какая длина набережной?',
    answers: ['1 км', '2 км', '3 км', '4 км'],
    correctAnswer: 1,
    hint: 'Прогулка занимает около 30 минут.'
  },
  {
    id: 4,
    name: 'Памятник воинам-освободителям',
    description: 'Мемориал в честь героев Великой Отечественной войны.',
    route: 'historical',
    x: 45,
    y: 50,
    question: 'Когда был установлен памятник?',
    answers: ['1965', '1975', '1985', '1995'],
    correctAnswer: 1,
    hint: 'Открытие состоялось к 30-летию Победы.'
  },
  {
    id: 5,
    name: 'Дворец культуры',
    description: 'Главная культурная площадка города с концертным залом.',
    route: 'cultural',
    x: 55,
    y: 35,
    question: 'Сколько зрителей вмещает концертный зал?',
    answers: ['300', '500', '700', '900'],
    correctAnswer: 1,
    hint: 'Это средний по размеру зал.'
  },
  {
    id: 6,
    name: 'Городской парк',
    description: 'Зелёная зона отдыха с аттракционами и спортивными площадками.',
    route: 'natural',
    x: 60,
    y: 70,
    question: 'Какая площадь городского парка?',
    answers: ['5 га', '10 га', '15 га', '20 га'],
    correctAnswer: 2,
    hint: 'Это один из крупнейших парков региона.'
  }
];

const routes = [
  {
    id: 'historical' as RouteType,
    name: 'Исторический маршрут',
    description: 'Узнай историю Жлобина через важные памятники и места',
    icon: 'Landmark'
  },
  {
    id: 'cultural' as RouteType,
    name: 'Культурный маршрут',
    description: 'Познакомься с культурным наследием города',
    icon: 'Palette'
  },
  {
    id: 'natural' as RouteType,
    name: 'Природный маршрут',
    description: 'Изучи природные красоты Жлобина',
    icon: 'Trees'
  }
];

export default function Index() {
  const [screen, setScreen] = useState<GameScreen>('welcome');
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const routeLandmarks = selectedRoute 
    ? landmarks.filter(l => l.route === selectedRoute)
    : [];

  const currentLandmark = routeLandmarks[currentLandmarkIndex];

  const startGame = () => {
    setScreen('route-select');
  };

  const selectRoute = (route: RouteType) => {
    setSelectedRoute(route);
    setScreen('map');
    setCurrentLandmarkIndex(0);
    setScore(0);
  };

  const openTask = () => {
    setScreen('task');
    setShowHint(false);
    setSelectedAnswer(null);
    setAnsweredCorrectly(null);
  };

  const checkAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentLandmark.correctAnswer;
    setAnsweredCorrectly(correct);
    
    if (correct) {
      setScore(score + 100);
    }
  };

  const nextLandmark = () => {
    if (currentLandmarkIndex < routeLandmarks.length - 1) {
      setCurrentLandmarkIndex(currentLandmarkIndex + 1);
      setScreen('map');
    } else {
      setScreen('finish');
    }
  };

  const restartGame = () => {
    setScreen('welcome');
    setSelectedRoute(null);
    setCurrentLandmarkIndex(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 md:p-12 text-center animate-fade-in shadow-md border">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                Город Жлобин
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-muted-foreground">как игра</p>
            </div>
            
            <div className="mb-8 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Добро пожаловать в игру <span className="font-semibold text-foreground">"Город Жлобин как игра"</span>! 
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Пройди по маршруту достопримечательностей, выполняй задания и узнай, насколько хорошо ты знаешь свой город!
              </p>
            </div>

            <Button 
              onClick={startGame}
              size="lg"
              className="text-xl px-12 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-md"
            >
              <Icon name="Play" className="mr-2" size={24} />
              Начать игру
            </Button>
          </Card>
        </div>
      )}

      {screen === 'route-select' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-5xl w-full animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
              Выбери маршрут
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Каждый маршрут откроет новые грани города Жлобина
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {routes.map((route) => (
                <Card 
                  key={route.id}
                  className="p-6 cursor-pointer hover:shadow-md transition-all border"
                  onClick={() => selectRoute(route.id)}
                >
                  <div className="h-32 rounded-xl bg-muted flex items-center justify-center mb-4 border">
                    <Icon name={route.icon as any} size={64} className="text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">{route.name}</h3>
                  <p className="text-muted-foreground mb-4">{route.description}</p>
                  <Badge variant="secondary">
                    {landmarks.filter(l => l.route === route.id).length} точек
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'map' && currentLandmark && (
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {routes.find(r => r.id === selectedRoute)?.name}
                </h2>
                <p className="text-muted-foreground">
                  Точка {currentLandmarkIndex + 1} из {routeLandmarks.length}
                </p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                <Icon name="Trophy" className="mr-2" size={20} />
                Очки: {score}
              </Badge>
            </div>

            <Card className="p-6 mb-6 border shadow-sm">
              <div className="relative w-full h-96 bg-muted rounded-xl overflow-hidden border">
                {routeLandmarks.map((landmark, index) => {
                  const isVisited = index < currentLandmarkIndex;
                  const isCurrent = index === currentLandmarkIndex;
                  
                  return (
                    <div
                      key={landmark.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                        isCurrent ? 'z-10' : 'z-0'
                      }`}
                      style={{
                        left: `${landmark.x}%`,
                        top: `${landmark.y}%`
                      }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? 'bg-foreground text-background border-foreground shadow-md scale-125'
                            : isVisited
                            ? 'bg-muted text-foreground border-border'
                            : 'bg-background text-muted-foreground border-border'
                        }`}
                      >
                        {isVisited ? (
                          <Icon name="Check" size={20} />
                        ) : (
                          <Icon name="MapPin" size={20} />
                        )}
                      </div>
                      {isCurrent && (
                        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <Badge variant="default" className="shadow-sm">
                            {landmark.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 border shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-muted rounded-xl border">
                  <Icon name="MapPin" size={32} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {currentLandmark.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentLandmark.description}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={openTask}
                size="lg"
                className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm"
              >
                <Icon name="Play" className="mr-2" size={20} />
                Начать задание
              </Button>
            </Card>
          </div>
        </div>
      )}

      {screen === 'task' && currentLandmark && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 animate-fade-in border shadow-md">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="secondary">
                Вопрос {currentLandmarkIndex + 1}/{routeLandmarks.length}
              </Badge>
              <Badge variant="default">
                <Icon name="Trophy" className="mr-2" size={16} />
                {score} очков
              </Badge>
            </div>

            <h3 className="text-2xl font-bold mb-6 text-foreground">
              {currentLandmark.question}
            </h3>

            <div className="space-y-3 mb-6">
              {currentLandmark.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => checkAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    selectedAnswer === null
                      ? 'bg-background hover:bg-muted hover:shadow-md'
                      : selectedAnswer === index
                      ? answeredCorrectly
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-muted text-foreground border-border'
                      : index === currentLandmark.correctAnswer && selectedAnswer !== null
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-muted text-muted-foreground border-border'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index
                        ? answeredCorrectly
                          ? 'border-background bg-background text-foreground'
                          : 'border-border bg-border text-foreground'
                        : index === currentLandmark.correctAnswer && selectedAnswer !== null
                        ? 'border-background bg-background text-foreground'
                        : 'border-border'
                    }`}>
                      {selectedAnswer !== null && (index === currentLandmark.correctAnswer || selectedAnswer === index) && (
                        <Icon 
                          name={index === currentLandmark.correctAnswer ? "Check" : "X"} 
                          size={16} 
                        />
                      )}
                    </div>
                    <span className="font-medium">{answer}</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedAnswer === null && (
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="w-full mb-4 border"
              >
                <Icon name="Lightbulb" className="mr-2" size={20} />
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </Button>
            )}

            {showHint && selectedAnswer === null && (
              <Card className="p-4 mb-4 bg-muted border">
                <p className="text-sm text-muted-foreground">
                  <Icon name="Info" className="inline mr-2" size={16} />
                  {currentLandmark.hint}
                </p>
              </Card>
            )}

            {selectedAnswer !== null && (
              <div className="space-y-4">
                <Card className={`p-4 border ${
                  answeredCorrectly ? 'bg-foreground text-background' : 'bg-muted'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      answeredCorrectly ? 'bg-background text-foreground' : 'bg-background text-foreground'
                    }`}>
                      <Icon 
                        name={answeredCorrectly ? "CheckCircle" : "XCircle"} 
                        size={24}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {answeredCorrectly ? 'Правильно!' : 'Неправильно'}
                      </p>
                      <p className={answeredCorrectly ? 'text-background/80' : 'text-muted-foreground'}>
                        {answeredCorrectly ? '+100 очков' : 'Попробуй в следующий раз'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Button 
                  onClick={nextLandmark}
                  size="lg"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                >
                  {currentLandmarkIndex < routeLandmarks.length - 1 ? (
                    <>
                      <Icon name="ArrowRight" className="mr-2" size={20} />
                      Следующая точка
                    </>
                  ) : (
                    <>
                      <Icon name="Flag" className="mr-2" size={20} />
                      Завершить маршрут
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {screen === 'finish' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 md:p-12 text-center animate-fade-in border shadow-md">
            <div className="mb-6">
              <div className="inline-block p-6 bg-muted rounded-3xl mb-4 border">
                <Icon name="Trophy" size={80} className="text-foreground" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Маршрут пройден!
              </h2>
              <p className="text-xl text-muted-foreground">
                {routes.find(r => r.id === selectedRoute)?.name}
              </p>
            </div>

            <Card className="p-6 mb-8 bg-muted border">
              <div className="flex justify-around items-center">
                <div>
                  <p className="text-muted-foreground mb-1">Твой результат</p>
                  <p className="text-4xl font-bold text-foreground">{score}</p>
                  <p className="text-sm text-muted-foreground">очков</p>
                </div>
                <div className="h-16 w-px bg-border"></div>
                <div>
                  <p className="text-muted-foreground mb-1">Пройдено точек</p>
                  <p className="text-4xl font-bold text-foreground">{routeLandmarks.length}</p>
                  <p className="text-sm text-muted-foreground">из {routeLandmarks.length}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={restartGame}
                size="lg"
                className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm"
              >
                <Icon name="RotateCcw" className="mr-2" size={20} />
                Играть снова
              </Button>
              <Button 
                onClick={() => setScreen('route-select')}
                variant="outline"
                size="lg"
                className="w-full border"
              >
                <Icon name="Map" className="mr-2" size={20} />
                Выбрать другой маршрут
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
