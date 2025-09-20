import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Star, Sparkles } from 'lucide-react';

/* =========================================================================
   Helper: mede a imagem e detecta orientação (portrait x landscape)
   ========================================================================= */
function useImageMeta(src) {
  const [meta, setMeta] = useState({ loaded: false, error: false, w: 0, h: 0 });

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setMeta({ loaded: true, error: false, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => setMeta({ loaded: true, error: true, w: 0, h: 0 });
    img.src = src;
  }, [src]);

  return meta;
}

/* =========================================================================
   Card de Imagem Adaptativa (sem altura fixa)
   - portrait: largura automática, centralizada, sem cortes (max-height 80vh)
   - landscape: largura 100%, altura automática
   ========================================================================= */
const AdaptiveImageCard = ({ src, alt }) => {
  const { loaded, error, w, h } = useImageMeta(src);
  const isPortrait = loaded && !error ? h > w : false;

  if (!loaded) {
    return (
      <div
        className="w-full rounded-2xl shadow-xl bg-emerald-50 animate-pulse"
        style={{ minHeight: 200 }}
      />
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-2xl shadow-xl bg-emerald-100 p-6 text-center text-emerald-700">
        Não foi possível carregar a imagem
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl shadow-xl overflow-hidden ${isPortrait ? 'bg-black/60' : ''}`}>
      {/* portrait: largura auto, centralizada; landscape: 100% largura */}
      <div className="w-full flex items-center justify-center p-2">
        <img
          src={src}
          alt={alt}
          className={isPortrait ? 'h-auto max-h-[80vh] w-auto max-w-full' : 'w-full h-auto'}
        />
      </div>
    </div>
  );
};

/* =========================================================================
   Floating hearts (efeito visual)
   ========================================================================= */
const FloatingHearts = () => {
  const hearts = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <Heart
          key={heart}
          className="absolute text-emerald-300/30 animate-float"
          size={Math.random() * 20 + 10}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 15}s`,
          }}
        />
      ))}
    </div>
  );
};

/* =========================================================================
   Photo Carousel – altura fluida (o card cresce/diminui conforme a foto)
   ========================================================================= */
const PhotoCarousel = () => {
  const photos = [
    'https://imgur.com/nmyMzTC.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://imgur.com/GY7J8dc.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://imgur.com/eYBdG6o.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://imgur.com/HVX83tj.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
      {photos.map((photo, index) => (
        <div
          key={index}
          className={`${index === currentPhoto ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-700`}
        >
          <AdaptiveImageCard src={photo} alt={`Momento especial ${index + 1}`} />
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform flex space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPhoto(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentPhoto ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   Love Counter – contadores (anos/meses/dias/…)
   ========================================================================= */
const LoveCounter = () => {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date('2022-05-20T00:00:00');
    
    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { value: timeElapsed.years, label: 'anos', color: 'from-emerald-600 to-teal-600' },
    { value: timeElapsed.months, label: 'meses', color: 'from-teal-600 to-cyan-600' },
    { value: timeElapsed.days, label: 'dias', color: 'from-cyan-600 to-blue-600' },
    { value: timeElapsed.hours, label: 'horas', color: 'from-blue-600 to-indigo-600' },
    { value: timeElapsed.minutes, label: 'minutos', color: 'from-indigo-600 to-purple-600' },
    { value: timeElapsed.seconds, label: 'segundos', color: 'from-purple-600 to-pink-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.label}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${unit.color} bg-clip-text text-transparent mb-2 animate-pulse-gentle`}>
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-emerald-700 text-sm font-medium capitalize">{unit.label}</div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
   Memory Timeline – usa o AdaptiveImageCard sem altura fixa
   ========================================================================= */
const MemoryTimeline = () => {
  const memories = [
    {
      date: '03 Jul 2022',
      title: 'Um dos nossos Primeiros Encontros',
      description: 'O dia em que começamos a fazer mais coisas juntos, sair e conhecer lugares.',
      image: 'https://imgur.com/c9qeESc.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      date: '02 Abr 2023',
      title: 'Mais de um ano Juntos',
      description: 'Vivendo coisas incríveis ao seu lado.',
      image: 'https://imgur.com/uxRNi0V.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      date: '14 Jan 2024',
      title: 'Nossa Primeira Viagem de Moto',
      description: 'Descobrindo o mundo juntos, criando memórias que durarão para sempre.',
      image: 'https://imgur.com/f2cijHe.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      date: '24 Abr 2024',
      title: 'A tão esperada viagem de Avião',
      description: 'Uma celebração do amor, a distância.',
      image: 'https://imgur.com/r1aoQf2.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      date: '14 Set 2025',
      title: 'Aproveitando sempre que possível os bons momentos contigo',
      description: 'Sempre planejando cada passeio ao seu lado.',
      image: 'https://imgur.com/cdk0KzK.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ];

  return (
    <div className="space-y-8">
      {memories.map((memory, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center gap-8 animate-fade-in ${
            index % 2 === 1 ? 'md:flex-row-reverse' : ''
          }`}
          style={{ animationDelay: `${index * 0.3}s` }}
        >
          <div className="flex-1">
            <AdaptiveImageCard src={memory.image} alt={memory.title} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Calendar size={20} />
              <span className="font-medium">{memory.date}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-800">{memory.title}</h3>
            <p className="text-emerald-700 leading-relaxed">{memory.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
   Romantic Quotes – frases com fade
   ========================================================================= */
const RomanticQuotes = () => {
  const quotes = [
    "O amor é a poesia dos sentidos.",
    "Você é meu lugar favorito.",
    "Em todos os mundos, eu escolheria você.",
    "Nosso amor é uma história sem fim.",
    "Com você, cada momento é mágico.",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center h-20 flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl">
        {quotes.map((quote, index) => (
          <p
            key={index}
            className={`absolute inset-0 text-lg md:text-2xl italic text-emerald-800 font-medium transition-opacity duration-1000 flex items-center justify-center text-center ${
              index === currentQuote ? 'opacity-100' : 'opacity-0'
            }`}
          >
            "{quote}"
          </p>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   App
   ========================================================================= */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 relative overflow-x-hidden">
      <FloatingHearts />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Nossa História de Amor
            </h1>
            <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl text-emerald-700 mb-8">
              <Heart className="animate-pulse" />
              <span>Desde 20/05/2022, nossa história começou a ser escrita</span>
              <Heart className="animate-pulse" />
            </div>
          </div>
          
          <PhotoCarousel />
          
          <div className="mt-12">
            <RomanticQuotes />
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6 flex items-center justify-center gap-4">
              <Clock className="text-emerald-600" />
              Nosso tempo Juntos
              <Sparkles className="text-teal-600" />
            </h2>
            <p className="text-xl text-emerald-700">Cada segundo conta na nossa jornada</p>
          </div>
          
          <LoveCounter />
        </div>
      </section>

      {/* Memories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6 flex items-center justify-center gap-4">
              <Star className="text-emerald-600" />
              Nossas Memórias
              <Star className="text-emerald-600" />
            </h2>
            <p className="text-xl text-emerald-700">Momentos especiais que marcaram nossa jornada</p>
          </div>
          
          <MemoryTimeline />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="text-emerald-600">
          <Heart className="inline-block mx-2 text-emerald-500 animate-pulse" />
        </div>
      </footer>
    </div>
  );
}

export default App;
