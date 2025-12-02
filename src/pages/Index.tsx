import { useState, useRef, useEffect } from 'react';
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
    icon: 'Landmark',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'cultural' as RouteType,
    name: 'Культурный маршрут',
    description: 'Познакомься с культурным наследием города',
    icon: 'Palette',
    gradient: 'from-pink-500 to-orange-400'
  },
  {
    id: 'natural' as RouteType,
    name: 'Природный маршрут',
    description: 'Изучи природные красоты Жлобина',
    icon: 'Trees',
    gradient: 'from-blue-500 to-cyan-400'
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

  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

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
    setMapPosition({ x: 0, y: 0 });
    setMapScale(1);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(mapScale * delta, 0.5), 3);
    setMapScale(newScale);
  };

  const resetMapView = () => {
    setMapPosition({ x: 0, y: 0 });
    setMapScale(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {screen === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-12 md:p-16 text-center animate-fade-in shadow-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <div className="mb-8 animate-scale-in">
              <div className="inline-flex p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-lg mb-6">
                <Icon name="Map" size={64} className="text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
                Жлобин
              </h1>
              <p className="text-3xl font-semibold text-gray-600">как игра</p>
            </div>
            
            <div className="mb-10 space-y-4 max-w-lg mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed">
                Выбери маршрут и пройди по достопримечательностям города
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Отвечай на вопросы и узнай, насколько хорошо ты знаешь Жлобин
              </p>
            </div>

            <Button 
              onClick={startGame}
              size="lg"
              className="text-xl px-14 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Icon name="Play" className="mr-3" size={28} />
              Начать игру
            </Button>
          </Card>
        </div>
      )}

      {screen === 'route-select' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-6xl w-full space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Выбери маршрут
              </h2>
              <p className="text-gray-600 text-xl">
                Каждый маршрут откроет новые грани города
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {routes.map((route, index) => (
                <Card 
                  key={route.id}
                  className="group p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2"
                  onClick={() => selectRoute(route.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-40 rounded-2xl bg-gradient-to-br ${route.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon name={route.icon as any} size={72} className="text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors">{route.name}</h3>
                  <p className="text-gray-600 mb-5 leading-relaxed">{route.description}</p>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-base px-4 py-1">
                    {landmarks.filter(l => l.route === route.id).length} точек
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'map' && currentLandmark && (
        <div className="min-h-screen p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => setScreen('route-select')}
                className="gap-2 hover:bg-purple-100 border-2 border-purple-200"
              >
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
              <div className="flex items-center gap-4">
                <Badge className="text-lg px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  Точка {currentLandmarkIndex + 1} / {routeLandmarks.length}
                </Badge>
                <Badge className="text-lg px-5 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg">
                  <Icon name="Star" size={20} className="mr-2" />
                  {score} очков
                </Badge>
              </div>
            </div>

            <Card className="p-8 md:p-12 space-y-8 animate-fade-in shadow-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Карта маршрута
                </h2>
                <p className="text-gray-600 text-lg">Перемещай карту мышью, масштабируй колесиком</p>
              </div>
              
              <div className="relative bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-3xl p-4 min-h-[550px] border-4 border-purple-200 shadow-inner overflow-hidden">
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMapScale(Math.min(mapScale * 1.2, 3))}
                    className="bg-white/90 hover:bg-white border-2"
                  >
                    <Icon name="ZoomIn" size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMapScale(Math.max(mapScale * 0.8, 0.5))}
                    className="bg-white/90 hover:bg-white border-2"
                  >
                    <Icon name="ZoomOut" size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetMapView}
                    className="bg-white/90 hover:bg-white border-2"
                  >
                    <Icon name="Maximize" size={18} />
                  </Button>
                </div>

                <div 
                  ref={mapRef}
                  className={`relative w-full h-[500px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  <div 
                    className="absolute inset-0 transition-transform duration-200"
                    style={{ 
                      transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
                      transformOrigin: 'center'
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      {routeLandmarks.map((landmark, index) => {
                        if (index === 0) return null;
                        const prevLandmark = routeLandmarks[index - 1];
                        return (
                          <line
                            key={`line-${landmark.id}`}
                            x1={`${prevLandmark.x}%`}
                            y1={`${prevLandmark.y}%`}
                            x2={`${landmark.x}%`}
                            y2={`${landmark.y}%`}
                            stroke={index <= currentLandmarkIndex ? "#a855f7" : "#d1d5db"}
                            strokeWidth="3"
                            strokeDasharray="8,4"
                            className="transition-all duration-500"
                          />
                        );
                      })}
                    </svg>

                    {routeLandmarks.map((landmark, index) => (
                      <div
                        key={landmark.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
                          index === currentLandmarkIndex ? 'scale-125 z-20' : 'z-10'
                        }`}
                        style={{ 
                          left: `${landmark.x}%`, 
                          top: `${landmark.y}%`,
                        }}
                        onClick={() => index === currentLandmarkIndex && openTask()}
                      >
                        <div className={`
                          w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                          shadow-2xl border-4 transition-all duration-500 relative
                          ${index === currentLandmarkIndex 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-white animate-pulse shadow-purple-500/50' 
                            : index < currentLandmarkIndex
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-white'
                            : 'bg-white text-gray-400 border-gray-300'
                          }
                        `}>
                          {index < currentLandmarkIndex ? (
                            <Icon name="Check" size={32} />
                          ) : (
                            index + 1
                          )}
                          {index === currentLandmarkIndex && (
                            <div className="absolute -inset-2 bg-purple-400 rounded-full animate-ping opacity-30"></div>
                          )}
                        </div>
                        {index === currentLandmarkIndex && (
                          <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                            <Badge className="shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base px-4 py-2">
                              {landmark.name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-5 pt-4">
                <h3 className="text-3xl font-bold text-gray-800">
                  {currentLandmark.name}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">{currentLandmark.description}</p>
                <Button 
                  onClick={openTask}
                  size="lg"
                  className="mt-4 text-xl px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Icon name="Play" className="mr-3" size={24} />
                  Начать задание
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {screen === 'task' && currentLandmark && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-3xl w-full p-10 md:p-14 space-y-8 animate-fade-in shadow-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-3">
                <Badge className="bg-purple-100 text-purple-700 text-base px-4 py-1.5">
                  Вопрос {currentLandmarkIndex + 1} из {routeLandmarks.length}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentLandmark.name}
                </h2>
              </div>
              <Badge className="text-lg px-5 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg">
                <Icon name="Star" size={20} className="mr-2" />
                {score}
              </Badge>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {currentLandmark.question}
            </p>

            <div className="space-y-3">
              {currentLandmark.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => selectedAnswer === null && checkAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-5 rounded-2xl text-left text-lg font-medium transition-all duration-300 border-2
                    ${selectedAnswer === null 
                      ? 'bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-400 hover:shadow-lg transform hover:-translate-y-1' 
                      : selectedAnswer === index
                      ? answeredCorrectly
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg scale-105'
                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white border-red-500 shadow-lg'
                      : index === currentLandmark.correctAnswer
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg'
                      : 'bg-gray-100 border-gray-200 opacity-50'
                    }
                  `}
                >
                  <span className="flex items-center justify-between">
                    {answer}
                    {selectedAnswer === index && answeredCorrectly && (
                      <Icon name="Check" size={24} className="text-white" />
                    )}
                    {selectedAnswer === index && !answeredCorrectly && (
                      <Icon name="X" size={24} className="text-white" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              {!showHint && selectedAnswer === null && (
                <Button 
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  className="gap-2 border-2 border-yellow-300 hover:bg-yellow-50"
                >
                  <Icon name="Lightbulb" size={20} />
                  Подсказка
                </Button>
              )}
              
              {selectedAnswer !== null && (
                <Button 
                  onClick={nextLandmark}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                  {currentLandmarkIndex < routeLandmarks.length - 1 ? (
                    <>
                      Далее
                      <Icon name="ArrowRight" size={20} />
                    </>
                  ) : (
                    <>
                      Завершить
                      <Icon name="Trophy" size={20} />
                    </>
                  )}
                </Button>
              )}
            </div>

            {showHint && (
              <Card className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg animate-scale-in">
                <div className="flex gap-3">
                  <Icon name="Lightbulb" size={28} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{currentLandmark.hint}</p>
                </div>
              </Card>
            )}

            {selectedAnswer !== null && (
              <Card className={`p-5 shadow-lg animate-scale-in ${
                answeredCorrectly 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-green-500' 
                  : 'bg-gradient-to-r from-red-400 to-pink-500 text-white border-2 border-red-500'
              }`}>
                <p className="text-lg font-bold flex items-center gap-3">
                  {answeredCorrectly ? (
                    <>
                      <Icon name="Trophy" size={24} />
                      Правильно! +100 очков
                    </>
                  ) : (
                    <>
                      <Icon name="X" size={24} />
                      Неправильно. Попробуй в следующий раз
                    </>
                  )}
                </p>
              </Card>
            )}
          </Card>
        </div>
      )}

      {screen === 'finish' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-12 animate-fade-in">
            <Card className="p-16 shadow-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200">
              <div className="space-y-8">
                <div className="inline-flex p-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl animate-scale-in">
                  <Icon name="Trophy" size={80} className="text-white" />
                </div>
                <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Поздравляем!
                </h2>
                <p className="text-2xl text-gray-600 font-medium">
                  Ты прошёл маршрут Жлобина
                </p>
              </div>
              
              <div className="my-10 inline-block bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl px-16 py-12 shadow-2xl">
                <p className="text-lg font-medium mb-3 opacity-90">Твой результат</p>
                <p className="text-7xl font-bold mb-3">{score}</p>
                <p className="text-lg opacity-90">очков</p>
              </div>

              <Badge className="text-2xl px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl">
                {score >= 500 ? '🌟 Знаток Жлобина' : score >= 300 ? '⭐ Исследователь' : '✨ Новичок'}
              </Badge>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button 
                  onClick={restartGame}
                  size="lg"
                  className="text-xl px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Icon name="RotateCcw" className="mr-3" size={24} />
                  Играть снова
                </Button>
                <Button 
                  onClick={() => setScreen('route-select')}
                  size="lg"
                  variant="outline"
                  className="text-xl px-10 py-6 border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Icon name="Map" className="mr-3" size={24} />
                  Другой маршрут
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
