import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Activity, Profile, GalleryImage, Area } from '../types';
import ActivityCard from './ActivityCard';
import AdminPanel from './AdminPanel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Book, 
  Terminal, 
  Dumbbell, 
  Clapperboard, 
  Bike, 
  Gamepad2, 
  Trophy,
  ChevronDown,
  Monitor,
  Search,
  User,
  Plus
} from 'lucide-react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'ensino-medio' | 'tdes'>('inicio');
  const [activeArea, setActiveArea] = useState<Area>('Matemática');
  const [activeTrimester, setActiveTrimester] = useState<number>(2);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [profile, setProfile] = useState<Profile>({
    name: "Arthur Gabriel",
    age: 16,
    city: "Florianópolis - SC",
    personality: "Extrovertido e hiperativo",
    bio: "Salve! Me chamo Arthur Gabriel, tenho 16 anos, nasci e estou até hoje em Florianópolis - SC. Moro perto de boa parte da minha família, meus pais, primos, avós, tios, e também com meu cachorro Rock. Sempre fui muito extrovertido e hiperativo, amo esportes, os meu preferidos são musculação, futebol e ciclismo. Também gosto muito de jogar videogames quando não tenho nada pra fazer. Eu aproveito muito o tempo que passo com meus amigos que sempre fazem meu dia melhor. Sou uma pessoa que se dedica muito pra fazer qualquer atividade mesmo que seja uma que eu não goste. Tenho um objetivo escolar de conseguir bons conceitos e habilidades, já meu objetivo profissional é conseguir um emprego no ramo da tecnologia em home office.",
    goals: "Concluir o ensino médio com excelência, adquirir certificações em tecnologia e dominar ferramentas de edição profissional de vídeo.",
    professionalGoals: "Trabalhar com Desenvolvimento Full Stack ou Edição de Vídeo Profissional em regime Home Office para empresas globais.",
    hobbies: ["Musculação", "Futebol", "Ciclismo", "Videogames", "Edição de Vídeo", "Passar tempo com amigos"]
  });

  const fetchData = async () => {
    // Activities
    const actSnap = await getDocs(query(collection(db, "activities"), orderBy("createdAt", "desc")));
    setActivities(actSnap.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));

    // Profile
    const profSnap = await getDoc(doc(db, "profiles", "main"));
    if (profSnap.exists()) setProfile(profSnap.data() as Profile);

    // Gallery
    const galSnap = await getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc")));
    setGallery(galSnap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage)));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    // Note: window.confirm might fail in some iframe environments. 
    // Using a simpler approach for now to ensure functionality.
    try {
      await deleteDoc(doc(db, "activities", id));
      fetchData();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const areas: Area[] = ['Matemática', 'Humanas', 'Linguagens', 'Natureza'];
  const trimesters = [1, 2, 3];

  const filteredActivities = activities.filter(a => {
    if (activeTab === 'tdes') return a.area === 'TDES' && a.trimester === activeTrimester;
    if (activeTab === 'ensino-medio') return a.area === activeArea && a.trimester === activeTrimester;
    return false;
  });

  return (
    <div className="dv-grid">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="flex items-center gap-6 h-full">
          <span className="text-[10px] font-black text-white/30 tracking-tighter uppercase whitespace-nowrap">DV Portfolio v3.0</span>
          
          <nav className="flex h-full border-l border-resolve-border">
            <button 
              onClick={() => setActiveTab('inicio')}
              className={`resolve-tab ${activeTab === 'inicio' ? 'active' : ''}`}
            >
              Início
            </button>
            <button 
              onClick={() => setActiveTab('ensino-medio')}
              className={`resolve-tab ${activeTab === 'ensino-medio' ? 'active' : ''}`}
            >
              Ensino Médio
            </button>
            <button 
              onClick={() => setActiveTab('tdes')}
              className={`resolve-tab ${activeTab === 'tdes' ? 'active' : ''}`}
            >
              TDES
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => setEditingActivity({ title: "" } as Activity)}
              className="resolve-button-primary flex items-center gap-2"
            >
              <Plus size={12} /> New Activity
            </button>
          )}
          <div className="flex items-center gap-3 border-l border-resolve-border pl-4 h-6">
            <span className="text-[10px] text-white/40 font-bold uppercase">{profile.name} • 3º Ano</span>
            <div className="w-6 h-6 rounded-sm bg-[#1a1a1f] border border-white/10 flex items-center justify-center p-1 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white/80">
                <circle cx="50" cy="28" r="18" fill="#e8b84b" />
                <circle cx="28" cy="65" r="18" fill="#4ecdc4" />
                <circle cx="72" cy="65" r="18" fill="#ff4d4d" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="main-workspace">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="mb-6">
            <label className="track-label">Navegação Local</label>
            <div className="space-y-1">
              {activeTab === 'ensino-medio' ? (
                areas.map(area => (
                  <button
                    key={area}
                    onClick={() => setActiveArea(area)}
                    className={`w-full text-left p-2 rounded-sm text-[11px] font-medium transition-all flex items-center gap-2 ${
                      activeArea === area ? 'bg-resolve-gold text-resolve-bg' : 'text-white/50 hover:bg-white/5'
                    }`}
                  >
                    <span className="opacity-50">
                      {area === 'Matemática' && '📐'}
                      {area === 'Humanas' && '📘'}
                      {area === 'Linguagens' && '🎨'}
                      {area === 'Natureza' && '🧬'}
                    </span>
                    {area}
                  </button>
                ))
              ) : activeTab === 'tdes' ? (
                <div className="p-2 bg-resolve-teal/10 text-resolve-teal border border-resolve-teal/20 rounded-sm text-[11px] font-bold flex items-center gap-2">
                  <Terminal size={14} /> TDES Ativo
                </div>
              ) : (
                <div className="p-2 bg-white/5 text-white/50 rounded-sm text-[11px]">
                  Página de Perfil
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <AdminPanel 
            isAdmin={isAdmin} 
            setIsAdmin={setIsAdmin} 
            profile={profile} 
            onRefresh={fetchData}
            editingActivity={editingActivity}
            setEditingActivity={setEditingActivity}
            activeTrimester={activeTrimester}
            activeArea={activeArea}
            activeTab={activeTab}
          />
          
          <div className="max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'inicio' && (
                <motion.div 
                  key="inicio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <section className="resolve-panel p-6 border-resolve-gold/30">
                    <div className="flex gap-6 items-start">
                      <div className="w-32 h-32 bg-[#0a0a0d] border border-resolve-gold/30 rounded-sm flex items-center justify-center overflow-hidden group">
                        <img 
                          src="/eu.png" 
                          alt={profile.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="tag mb-2 bg-resolve-gold text-black inline-block">Editor</span>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">
                          {profile.name}
                        </h1>
                        <p className="text-[11px] text-white/40 uppercase font-black tracking-widest">{profile.city} • {profile.age} ANOS</p>
                        <div className="mt-4 p-3 bg-white/5 border-l-2 border-resolve-gold text-[11px] text-resolve-gold font-bold animate-pulse">
                          // BEM-VINDO AO MEU WORKSPACE CRIATIVO
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="resolve-panel p-4 md:col-span-2">
                      <label className="track-label border-b border-resolve-border pb-1 mb-3">Quem sou eu</label>
                      <div className="space-y-4">
                        <p className="text-gray-400 leading-relaxed text-[12px]">{profile.bio}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="aspect-[4/3] bg-black rounded-sm overflow-hidden border border-white/5 relative group">
                              <img 
                                src="/rock.png" 
                                alt="Rock" 
                                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110" 
                              />
                            </div>
                            <p className="text-[9px] text-white/30 uppercase text-center font-bold tracking-widest">Meu cachorro Rock</p>
                          </div>
                          <div className="space-y-2">
                            <div className="aspect-[4/3] bg-black rounded-sm overflow-hidden border border-white/5 relative group">
                              <img 
                                src="/meus amigos.jpg" 
                                alt="Amigos" 
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                              />
                            </div>
                            <p className="text-[9px] text-white/30 uppercase text-center font-bold tracking-widest">Eu e meus amigos</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="space-y-6">
                      <section className="resolve-panel p-4">
                        <label className="track-label border-b border-resolve-border pb-1 mb-2">Objetivos</label>
                        <p className="text-gray-400 leading-relaxed text-[11px]">{profile.goals}</p>
                      </section>
                      <section className="resolve-panel p-4">
                        <label className="track-label border-b border-resolve-border pb-1 mb-2">Plano Profissional</label>
                        <p className="text-gray-400 leading-relaxed text-[11px]">{profile.professionalGoals}</p>
                      </section>
                    </div>
                  </div>

                  <section>
                    <label className="track-label mb-4">Galeria de Mídia</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {gallery.map(img => (
                        <div key={img.id} className="aspect-square bg-resolve-panel border border-resolve-border overflow-hidden rounded-sm hover:border-resolve-gold transition-all group">
                          <img src={img.url} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all border-none" />
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {(activeTab === 'ensino-medio' || activeTab === 'tdes') && (
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between border-b border-resolve-border pb-4 mb-4">
                    <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                      {activeTab === 'tdes' ? 'Project: Technical Development' : `Area: ${activeArea}`}
                    </h2>
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] uppercase font-bold text-resolve-gold bg-resolve-gold/10 px-2 py-0.5 border border-resolve-gold/20">
                        {activeTrimester}º Trimestre
                      </span>
                      <span className="bg-white/5 px-3 py-1 text-[10px] font-mono text-resolve-teal border border-white/10">0{activeTrimester}:00:23:14</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="track-label flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-resolve-gold rounded-full"></span>
                      Clip List: Trimestre {activeTrimester}
                    </label>
                    {filteredActivities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredActivities.map(activity => (
                          <ActivityCard 
                            key={activity.id} 
                            activity={activity} 
                            isAdmin={isAdmin}
                            onDelete={handleDelete}
                            onEdit={setEditingActivity}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="resolve-panel p-12 text-center border-dashed border-white/5">
                        <p className="text-white/20 uppercase font-black tracking-widest text-xs">Nenhum clipe encontrado neste trimestre</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Inspector (Right Sidebar) */}
        <aside className="inspector">
          <label className="track-label border-b border-resolve-border pb-2 mb-2">Inspector</label>
          
          <section className="space-y-4">
            <div>
              <label className="text-[9px] text-white/30 block mb-1 uppercase font-bold">Metadata Profile</label>
              <div className="bg-[#0a0a0d] border border-resolve-border p-3 rounded-sm space-y-2">
                <div>
                  <label className="text-[8px] text-white/20 block uppercase">Bio</label>
                  <p className="text-[10px] text-white/70 leading-tight">{profile.bio}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[9px] text-white/30 block mb-1 uppercase font-bold">Interesses / Tags</label>
              <div className="flex flex-wrap gap-1">
                {profile.hobbies.map(hobby => (
                  <span key={hobby} className="text-[8px] px-2 py-0.5 border border-resolve-border text-white/40 uppercase font-black tracking-tighter">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-resolve-border">
              <label className="text-[9px] text-white/30 block mb-2 uppercase font-bold">Resumo do Arquivo</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded-sm">
                  <span className="block text-[8px] text-white/30">ATIVIDADES</span>
                  <span className="text-xs font-mono text-resolve-teal font-bold">{activities.length}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-sm">
                  <span className="block text-[8px] text-white/30">STATUS</span>
                  <span className="text-xs font-mono text-resolve-teal font-bold">FINAL</span>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-4 border-t border-resolve-border">
            <p className="text-[8px] text-white/20 uppercase font-black text-center tracking-widest tracking-tighter">
              A.Gabriel Portfolio v2026.04
            </p>
          </footer>
        </aside>
      </div>

      {/* Timeline (Bottom Bar) */}
      <footer className="timeline">
        <div className="flex justify-between items-center px-1">
          <label className="track-label m-0">Master Academic Timeline</label>
          <div className="flex gap-4 font-mono text-xs text-resolve-gold">
            <span>0{activeTrimester}:00:23:14</span>
            <span className="text-white/20">/</span>
            <span>03:00:00:00</span>
          </div>
        </div>
        
        <div className="flex-grow bg-[#050507] rounded-sm p-3 border border-resolve-border relative overflow-hidden flex gap-1">
          {trimesters.map(tri => (
            <button
              key={tri}
              onClick={() => setActiveTrimester(tri)}
              className={`timeline-clip flex-1 transition-all flex flex-col justify-center px-3 group relative overflow-hidden ${
                activeTrimester === tri 
                  ? 'bg-resolve-gold text-resolve-bg font-black scale-y-105 z-10' 
                  : 'bg-white/5 text-white/30 hover:bg-white/10 font-medium'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] uppercase tracking-tighter">Trimester_0{tri}.seq</span>
                {activeTrimester === tri && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full" />
            </button>
          ))}
          
          {/* Playhead indicator */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_10px_#fff] z-20 transition-all duration-500 ease-out pointer-events-none"
            style={{ left: `${(activeTrimester - 1) * 33.33 + 16.66}%` }}
          />
        </div>

        <div className="flex justify-between px-1">
          {trimesters.map(tri => (
            <span 
              key={tri} 
              className={`text-[8px] font-black uppercase tracking-widest ${activeTrimester === tri ? 'text-resolve-gold' : 'text-white/20'}`}
            >
              {tri === activeTrimester ? `0${tri}_TRI_ACTIVE` : `0${tri}_TRI_LOCKED`}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
