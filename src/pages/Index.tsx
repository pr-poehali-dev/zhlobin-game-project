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
    icon: 'Landmark',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'cultural' as RouteType,
    name: 'Культурный маршрут',
    description: 'Познакомься с культурным наследием города',
    icon: 'Palette',
    color: 'from-pink-500 to-orange-500'
  },
  {
    id: 'natural' as RouteType,
    name: 'Природный маршрут',
    description: 'Изучи природные красоты Жлобина',
    icon: 'Trees',
    color: 'from-blue-500 to-cyan-500'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {screen === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 md:p-12 text-center animate-fade-in shadow-2xl">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
                🏛️ Город Жлобин
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-700">как игра</p>
            </div>
            
            <div className="mb-8 space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                Добро пожаловать в игру <span className="font-semibold">"Город Жлобин как игра"</span>! 
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Пройди по маршруту достопримечательностей, выполняй задания и узнай, насколько хорошо ты знаешь свой город!
              </p>
            </div>

            <Button 
              onClick={startGame}
              size="lg"
              className="text-xl px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
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
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
              Выбери маршрут
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Каждый маршрут откроет новые грани города Жлобина
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {routes.map((route) => (
                <Card 
                  key={route.id}
                  className="p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
                  onClick={() => selectRoute(route.id)}
                >
                  <div className={`h-32 rounded-lg bg-gradient-to-br ${route.color} flex items-center justify-center mb-4`}>
                    <Icon name={route.icon as any} size={64} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{route.name}</h3>
                  <p className="text-gray-600 mb-4">{route.description}</p>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
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
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setScreen('route-select')}
                  className="gap-2"
                >
                  <Icon name="ArrowLeft" size={20} />
                  Назад
                </Button>
                <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Icon name="Star" size={20} className="mr-2" />
                  Очки: {score}
                </Badge>
              </div>
              <Badge className="text-lg px-4 py-2 bg-purple-100 text-purple-700">
                Точка {currentLandmarkIndex + 1} из {routeLandmarks.length}
              </Badge>
            </div>

            <Card className="p-6 md:p-8 animate-scale-in">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                🗺 Карта маршрута
              </h2>
              
              <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 mb-6 min-h-[400px] border-4 border-blue-200">
                {routeLandmarks.map((landmark, index) => (
                  <div
                    key={landmark.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      index === currentLandmarkIndex 
                        ? 'scale-125 z-10' 
                        : index < currentLandmarkIndex 
                        ? 'opacity-50' 
                        : ''
                    }`}
                    style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                    onClick={() => index === currentLandmarkIndex && openTask()}
                  >
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
                      ${index === currentLandmarkIndex 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse' 
                        : index < currentLandmarkIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                      }
                    `}>
                      {index < currentLandmarkIndex ? '✓' : index + 1}
                    </div>
                    {index === currentLandmarkIndex && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <Badge className="bg-white text-gray-800 shadow-lg">
                          {landmark.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {currentLandmark.name}
                </h3>
                <p className="text-gray-600 mb-6">{currentLandmark.description}</p>
                <Button 
                  onClick={openTask}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                >
                  <Icon name="Play" className="mr-2" />
                  Начать задание
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {screen === 'task' && currentLandmark && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-3xl w-full p-8 animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <Badge className="mb-3 bg-purple-100 text-purple-700">
                  Вопрос {currentLandmarkIndex + 1} из {routeLandmarks.length}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentLandmark.name}
                </h2>
              </div>
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                <Icon name="Star" size={20} className="mr-2" />
                {score}
              </Badge>
            </div>

            <p className="text-xl mb-8 text-gray-700 font-medium">
              {currentLandmark.question}
            </p>

            <div className="space-y-3 mb-6">
              {currentLandmark.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => selectedAnswer === null && checkAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-4 rounded-lg text-left text-lg font-medium transition-all
                    ${selectedAnswer === null 
                      ? 'bg-gray-100 hover:bg-purple-100 hover:border-purple-300 border-2 border-transparent' 
                      : selectedAnswer === index
                      ? answeredCorrectly
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                      : index === currentLandmark.correctAnswer
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-100 opacity-50'
                    }
                  `}
                >
                  {answer}
                  {selectedAnswer === index && answeredCorrectly && (
                    <span className="ml-2">✓</span>
                  )}
                  {selectedAnswer === index && !answeredCorrectly && (
                    <span className="ml-2">✗</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              {!showHint && selectedAnswer === null && (
                <Button 
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  className="gap-2"
                >
                  <Icon name="Lightbulb" size={20} />
                  Подсказка
                </Button>
              )}
              
              {selectedAnswer !== null && (
                <Button 
                  onClick={nextLandmark}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
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
              <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200 animate-slide-up">
                <div className="flex gap-3">
                  <Icon name="Lightbulb" size={24} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-gray-700">{currentLandmark.hint}</p>
                </div>
              </Card>
            )}

            {selectedAnswer !== null && (
              <Card className={`mt-6 p-4 animate-slide-up ${
                answeredCorrectly ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-lg font-medium">
                  {answeredCorrectly 
                    ? '🎉 Правильно! +100 очков' 
                    : '❌ Неправильно. Попробуй в следующий раз!'
                  }
                </p>
              </Card>
            )}
          </Card>
        </div>
      )}

      {screen === 'finish' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-12 text-center animate-scale-in">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Поздравляем!
            </h2>
            <p className="text-2xl mb-6 text-gray-700">
              Ты прошёл маршрут Жлобина!
            </p>
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-8">
              <p className="text-white text-lg mb-2">Твой результат:</p>
              <p className="text-6xl font-bold text-white mb-2">{score}</p>
              <p className="text-white text-lg">очков</p>
            </div>

            <Badge className="text-2xl px-6 py-3 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {score >= 500 ? '🌟 Знаток Жлобина' : score >= 300 ? '⭐ Исследователь' : '✨ Новичок'}
            </Badge>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={restartGame}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Icon name="RotateCcw" className="mr-2" />
                Играть снова
              </Button>
              <Button 
                onClick={() => setScreen('route-select')}
                size="lg"
                variant="outline"
              >
                <Icon name="Map" className="mr-2" />
                Выбрать другой маршрут
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
