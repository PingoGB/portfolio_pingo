import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Activity, Area, ContentType, OriginTag, Profile } from '../types';
import { X, Plus, Save, Lock, LogOut, Upload, Loader2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_PASSWORD = "arthur2026"; // Easy to change as requested

interface AdminPanelProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  profile?: Profile;
  onRefresh: () => void;
  editingActivity: Activity | null;
  setEditingActivity: (a: Activity | null) => void;
  activeTrimester: number;
  activeArea: Area;
  activeTab: 'inicio' | 'ensino-medio' | 'tdes';
}

export default function AdminPanel({ 
  isAdmin, 
  setIsAdmin, 
  profile, 
  onRefresh, 
  editingActivity, 
  setEditingActivity,
  activeTrimester,
  activeArea,
  activeTab
}: AdminPanelProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State for Activity
  const defaultFormData: Partial<Activity> = {
    title: "",
    trimester: activeTrimester,
    description: "",
    contentUrl: "",
    contentType: "other",
    originTag: "Escolha do estudante",
    area: activeTab === 'ensino-medio' ? activeArea : 'TDES'
  };

  const [formData, setFormData] = useState<Partial<Activity>>(defaultFormData);

  // Effect to populate form when editing
  useEffect(() => {
    if (editingActivity) {
      setFormData({
        ...defaultFormData,
        ...editingActivity,
        // Ensure values are never undefined for controlled inputs
        title: editingActivity.title || "",
        description: editingActivity.description || "",
        contentUrl: editingActivity.contentUrl || "",
        trimester: editingActivity.trimester || activeTrimester,
        area: editingActivity.area || (activeTab === 'ensino-medio' ? activeArea : 'TDES'),
        contentType: editingActivity.contentType || "other",
        originTag: editingActivity.originTag || "Escolha do estudante"
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingActivity, activeTrimester, activeArea, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'activity' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `${type}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (type === 'activity') {
        setFormData(prev => ({ ...prev, contentUrl: url, contentType: 'image' }));
        alert("Imagem carregada! Agora preencha os detalhes e clique em 'Salvar Clipe'.");
      } else {
        await addDoc(collection(db, "gallery"), {
          url,
          description: "Foto da galeria",
          createdAt: new Date().toISOString()
        });
        onRefresh();
        alert("Sucesso! Foto adicionada à sua Galeria na aba Início.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingActivity?.id) {
        await updateDoc(doc(db, "activities", editingActivity.id), formData);
      } else {
        await addDoc(collection(db, "activities"), {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      setEditingActivity(null);
      setFormData({
        title: "",
        trimester: 1,
        description: "",
        contentUrl: "",
        contentType: "other",
        originTag: "Escolha do estudante",
        area: "Matemática"
      });
      onRefresh();
      alert("Sucesso!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfile: Partial<Profile>) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "profiles", "main"), newProfile, { merge: true });
      onRefresh();
    } catch (error) {
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowLogin(true)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-500 hover:text-resolve-gold transition-all"
          title="Login Admin"
        >
          <Lock size={18} />
        </button>

        <AnimatePresence>
          {showLogin && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="resolve-panel p-8 w-full max-w-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-resolve-gold font-bold uppercase tracking-widest flex items-center gap-2 text-sm">
                    <Lock size={16} /> Acesso Restrito
                  </h2>
                  <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Senha de Acesso</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="resolve-input w-full"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="resolve-button-primary w-full py-3 flex justify-center items-center gap-2">
                    Entrar no Painel <Plus size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-resolve-panel/50 border-b border-white/5 p-3 mb-6 rounded-sm backdrop-blur-sm">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-resolve-gold pr-3 border-r border-white/10">
            <Lock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
          </div>
          
          <button 
            onClick={() => setEditingActivity({ title: "", trimester: activeTrimester, area: activeTab === 'ensino-medio' ? activeArea : 'TDES' } as Activity)}
            className="resolve-button-primary flex items-center gap-2"
          >
            <Plus size={12} /> Novo Clipe
          </button>

          <label className="resolve-button-secondary cursor-pointer flex items-center gap-2 relative">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
            {uploading ? 'Enviando...' : 'Adicionar Foto à Galeria'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'gallery')} 
              disabled={uploading}
            />
          </label>
        </div>

        <button 
          onClick={() => setIsAdmin(false)}
          className="resolve-button-secondary flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>

      <AnimatePresence>
        {editingActivity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto flex justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="resolve-panel p-6 w-full max-w-xl my-auto shadow-2xl relative border-resolve-gold/20"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                <div>
                  <h2 className="text-resolve-gold font-black uppercase tracking-[0.2em] flex items-center gap-2 text-xs">
                    {editingActivity?.id ? 'Edit Sequence' : 'New Sequence'}
                  </h2>
                  <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">Status: Rendering Form_v1.0</p>
                </div>
                <button onClick={() => setEditingActivity(null)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">
                      Título do Clipe <span className="text-resolve-gold">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="resolve-input w-full py-2"
                      placeholder="Ex: Trabalho de Álgebra"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">Área</label>
                    <select 
                      value={formData.area} 
                      onChange={(e) => setFormData({...formData, area: e.target.value as Area})}
                      className="resolve-input w-full py-2"
                    >
                      <option value="Matemática">Matemática</option>
                      <option value="Humanas">Humanas</option>
                      <option value="Linguagens">Linguagens</option>
                      <option value="Natureza">Natureza</option>
                      <option value="TDES">TDES (Técnico)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">Trimestre</label>
                    <select 
                      value={formData.trimester} 
                      onChange={(e) => setFormData({...formData, trimester: Number(e.target.value)})}
                      className="resolve-input w-full py-2"
                    >
                      <option value={1}>1º Trimestre</option>
                      <option value={2}>2º Trimestre</option>
                      <option value={3}>3º Trimestre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">Tipo de Conteúdo</label>
                    <select 
                      value={formData.contentType} 
                      onChange={(e) => setFormData({...formData, contentType: e.target.value as ContentType})}
                      className="resolve-input w-full py-2"
                    >
                      <option value="other">Outro / Geral</option>
                      <option value="image">Imagem (Foto/Desenho)</option>
                      <option value="docs">Documento (Google Docs/PDF)</option>
                      <option value="canva">Canva (Design/Apresentação)</option>
                      <option value="video">Vídeo (YouTube/Drive)</option>
                      <option value="code">Código (GitHub/Replit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">Origem</label>
                    <select 
                      value={formData.originTag} 
                      onChange={(e) => setFormData({...formData, originTag: e.target.value as OriginTag})}
                      className="resolve-input w-full py-2"
                    >
                      <option value="Indicada pelo professor">Professor</option>
                      <option value="Escolha do estudante">Estudante</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">
                      URL ou Upload <span className="text-resolve-gold">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        required
                        value={formData.contentUrl} 
                        onChange={(e) => setFormData({...formData, contentUrl: e.target.value})} 
                        className="resolve-input flex-grow py-2"
                        placeholder="https://..."
                        disabled={uploading}
                      />
                      <label className="resolve-button-secondary cursor-pointer flex items-center gap-2 whitespace-nowrap text-[10px] px-3">
                        {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                        {uploading ? '...' : 'Upload'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'activity')} />
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase font-black text-white/30 mb-1 tracking-widest">
                      Descrição / Justificativa <span className="text-resolve-gold">*</span>
                    </label>
                    <textarea 
                      required
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      className="resolve-input w-full h-24 resize-none py-2 text-[11px]"
                      placeholder="Descreva o que foi feito nesta atividade..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-white/5">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="resolve-button-primary flex-grow h-10 flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {editingActivity?.id ? 'Atualizar Clipe' : 'Gravar Clipe'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingActivity(null)}
                    className="resolve-button-secondary px-6 h-10 text-xs font-black uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
