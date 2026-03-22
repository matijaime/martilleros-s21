'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Upload,
  List,
  LogOut,
  FileText,
  Video,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Loader2,
  Bell,
  AlertTriangle,
  ClipboardList,
  ExternalLink,
  PlusCircle,
  Images,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────
interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'archivo';
  url: string;
  created_at: string;
}

interface Test {
  id: string;
  name: string;
  link: string;
  subject: string;
  is_internal: boolean;
  created_at: string;
}

// ── Constants ──────────────────────────────────────────
const SUBJECTS = [
  'APRENDER EN EL SIGLO 21',
  'DERECHO PRIVADO CIVIL',
  'MARKETING I',
  'TECNOLOGÍA, HUMANIDADES Y MODELOS GLOBALES',
];

type ActiveSection = 'upload' | 'list' | 'alerts' | 'tests' | 'galeria';

const TOTAL_IMAGES = 43;

// ── Dashboard Page ─────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>('upload');

  // Upload form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<'pdf' | 'video'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Resources list state
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Alert state
  const [alertId, setAlertId] = useState<string | null>(null);
  const [alertActive, setAlertActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [savingAlert, setSavingAlert] = useState(false);
  const [alertSaveStatus, setAlertSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Tests state
  const [tests, setTests]               = useState<Test[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [testName, setTestName]         = useState('');
  const [testLink, setTestLink]         = useState('');
  const [testSubject, setTestSubject]   = useState('');
  const [isInternal, setIsInternal]     = useState(false);
  const [savingTest, setSavingTest]     = useState(false);
  const [testStatus, setTestStatus]     = useState<'idle' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage]   = useState('');
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);

  // ── Fetch resources ────────────────────────────────
  const fetchResources = useCallback(async () => {
    setLoadingResources(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setResources(data as Resource[]);
    setLoadingResources(false);
  }, []);

  useEffect(() => {
    if (activeSection === 'list') fetchResources();
    if (activeSection === 'alerts') fetchAlert();
    if (activeSection === 'tests') fetchTests();
  }, [activeSection, fetchResources]);

  // ── Fetch tests ────────────────────────────────────
  const fetchTests = async () => {
    setLoadingTests(true);
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTests(data as Test[]);
    setLoadingTests(false);
  };

  // ── Fetch alert ────────────────────────────────────
  const fetchAlert = async () => {
    const { data } = await supabase
      .from('site_alerts')
      .select('id, message, active')
      .limit(1)
      .single();
    if (data) {
      setAlertId(data.id);
      setAlertActive(data.active);
      setAlertMsg(data.message || '');
    }
  };

  // ── Save alert ─────────────────────────────────────
  const saveAlert = async () => {
    setSavingAlert(true);
    setAlertSaveStatus('idle');
    try {
      if (alertId) {
        const { error } = await supabase
          .from('site_alerts')
          .update({ message: alertMsg, active: alertActive, updated_at: new Date().toISOString() })
          .eq('id', alertId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('site_alerts')
          .insert({ message: alertMsg, active: alertActive })
          .select('id')
          .single();
        if (error) throw error;
        setAlertId(data.id);
      }
      setAlertSaveStatus('success');
    } catch {
      setAlertSaveStatus('error');
    } finally {
      setSavingAlert(false);
    }
  };

  // ── Upload handler ─────────────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('idle');
    setUploadMessage('');

    if (!title.trim()) return;
    if (!subject) {
      setUploadStatus('error');
      setUploadMessage('Seleccioná una materia antes de subir.');
      return;
    }

    setUploading(true);

    try {
      let resourceUrl = videoUrl;

      if (type === 'pdf') {
        if (!file) {
          setUploadStatus('error');
          setUploadMessage('Seleccioná un archivo.');
          setUploading(false);
          return;
        }

        const sanitizedName = file.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `${Date.now()}_${sanitizedName}`;
        const { error: uploadError } = await supabase.storage
          .from('materiales')
          .upload(fileName, file, { contentType: file.type || 'application/octet-stream', upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
          .from('materiales')
          .getPublicUrl(fileName);

        resourceUrl = urlData.publicUrl;
      } else {
        if (!videoUrl.trim()) {
          setUploadStatus('error');
          setUploadMessage('Ingresá el link del video.');
          setUploading(false);
          return;
        }
      }

      // Insert into resources table
      const { error: insertError } = await supabase.from('resources').insert({
        title: title.trim(),
        subject,
        type,
        url: resourceUrl,
      });

      if (insertError) throw new Error(insertError.message);

      setUploadStatus('success');
      setUploadMessage(`"${title}" fue agregado correctamente.`);
      setTitle('');
      setVideoUrl('');
      setFile(null);

      // Reset the file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: unknown) {
      const error = err as Error;
      setUploadStatus('error');
      setUploadMessage(error.message || 'Error al subir el recurso.');
    } finally {
      setUploading(false);
    }
  };

  // ── Delete handler ─────────────────────────────────
  const handleDelete = async (resource: Resource) => {
    setDeletingId(resource.id);

    try {
      // If file, delete from storage too
      if (resource.type !== 'video') {
        const parts = resource.url.split('/materiales/');
        if (parts[1]) {
          await supabase.storage.from('materiales').remove([parts[1]]);
        }
      }

      await supabase.from('resources').delete().eq('id', resource.id);
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
    } finally {
      setDeletingId(null);
    }
  };

  // ── Save test ──────────────────────────────────────
  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testSubject) {
      setTestStatus('error');
      setTestMessage('Completá el nombre y la materia.');
      return;
    }
    if (!isInternal && !testLink.trim()) {
      setTestStatus('error');
      setTestMessage('Ingresá el link del test externo.');
      return;
    }
    setSavingTest(true);
    setTestStatus('idle');
    const { error } = await supabase.from('tests').insert({
      name: testName.trim(),
      link: isInternal ? '' : testLink.trim(),
      subject: testSubject,
      is_internal: isInternal,
    });
    if (error) {
      setTestStatus('error');
      setTestMessage(error.message);
    } else {
      setTestStatus('success');
      setTestMessage(`"${testName}" guardado correctamente.`);
      setTestName('');
      setTestLink('');
      setTestSubject('');
      setIsInternal(false);
      fetchTests();
    }
    setSavingTest(false);
  };

  // ── Gallery navigation helpers ─────────────────────────────────
  const goPrev = () => setGalleryIndex(i => (i - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
  const goNext = () => setGalleryIndex(i => (i + 1) % TOTAL_IMAGES);

  useEffect(() => {
    if (activeSection !== 'galeria') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setGalleryIndex(i => (i - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
      if (e.key === 'ArrowRight') setGalleryIndex(i => (i + 1) % TOTAL_IMAGES);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeSection]);

  // ── Sidebar items ──────────────────────────────────────────────
  const navItems = [
    { id: 'upload'  as ActiveSection, label: 'Subir Material',        icon: Upload },
    { id: 'list'    as ActiveSection, label: 'Ver Recursos',           icon: List },
    { id: 'tests'   as ActiveSection, label: 'Gestionar Tests',        icon: ClipboardList },
    { id: 'alerts'  as ActiveSection, label: 'Alerta de Emergencia',   icon: Bell },
    { id: 'galeria' as ActiveSection, label: 'Galería de Imágenes',    icon: Images },
  ];

  // ── Delete test ────────────────────────────────────
  const handleDeleteTest = async (id: string) => {
    setDeletingTestId(id);
    await supabase.from('tests').delete().eq('id', id);
    setTests(prev => prev.filter(t => t.id !== id));
    setDeletingTestId(null);
  };

  // ── Sign out ───────────────────────────────────────
  const handleSignOut = async () => {
    await signOut(auth);
    document.cookie = 'firebase-auth-token=; path=/; max-age=0';
    router.push('/admin');
  };

  // ── Sidebar items ──────────────────────────────────
  const navItems = [
    { id: 'upload' as ActiveSection, label: 'Subir Material',        icon: Upload },
    { id: 'list'   as ActiveSection, label: 'Ver Recursos',           icon: List },
    { id: 'tests'  as ActiveSection, label: 'Gestionar Tests',        icon: ClipboardList },
    { id: 'alerts' as ActiveSection, label: 'Alerta de Emergencia',   icon: Bell },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-64 min-h-screen glass-dark border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Academic Hub Logo" className="h-10 w-auto mr-1" />
            <div>
              <p className="text-white font-semibold text-sm">Academic Hub</p>
              <p className="text-gold text-xs opacity-70">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`sidebar-${id}`}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === id
                  ? 'glass-gold text-gold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/5">
          <button
            id="signout-btn"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
          <a
            href="/"
            className="w-full flex items-center justify-center mt-2 py-2 text-xs text-slate-600 hover:text-gold transition-colors"
          >
            ← Ir al sitio público
          </a>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <main className="flex-1 overflow-auto p-8">
        {/* ── UPLOAD SECTION ─── */}
        {activeSection === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Subir Material
            </h1>
            <p className="text-slate-500 text-sm mb-8">Cargá documentos o links de video para los estudiantes.</p>

            <form onSubmit={handleUpload} className="glass rounded-2xl p-8 border border-white/5 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Título *
                </label>
                <input
                  id="upload-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej: Guía de estudio — Unidad 1"
                  required
                  className="input-dark"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Materia *
                </label>
                <div className="relative">
                  <select
                    id="upload-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="input-dark appearance-none pr-10"
                  >
                    <option value="" disabled className="bg-navy-800">— Seleccioná una materia —</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-navy-800">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Type toggle */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Tipo de recurso *
                </label>
                <div className="flex gap-3">
                  {(['pdf', 'video'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      id={`type-${t}`}
                      onClick={() => {
                        setType(t);
                        setUploadStatus('idle');
                      }}
                      className={`flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                        type === t
                          ? 'glass-gold text-gold border-gold/40'
                          : 'glass text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {t === 'pdf' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {t === 'pdf' ? 'DOCUMENTO' : t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional: PDF file vs Video URL */}
              {type === 'pdf' ? (
                <div>
                  <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                    Archivo *
                  </label>
                  <div className="relative">
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-navy hover:file:bg-gold-light file:transition-colors file:cursor-pointer cursor-pointer input-dark"
                    />
                  </div>
                  {file && (
                    <p className="text-xs text-emerald-400 mt-2">
                      ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                    Link del Video *
                  </label>
                  <input
                    id="video-url-input"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="input-dark"
                  />
                </div>
              )}

              {/* Status message */}
              {uploadStatus !== 'idle' && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl ${
                    uploadStatus === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  {uploadStatus === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${uploadStatus === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                    {uploadMessage}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="upload-submit-btn"
                disabled={uploading}
                className="btn-gold w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir Recurso
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── ALERTS SECTION ─── */}
        {activeSection === 'alerts' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Bell className="w-6 h-6 text-gold" />
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                Alerta de Emergencia
              </h1>
            </div>
            <p className="text-slate-500 text-sm mb-8">
              Mostrá un banner rojo en la parte superior del sitio para avisos urgentes.
            </p>

            <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">Estado del banner</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {alertActive ? 'El banner está activo y visible para todos.' : 'El banner está oculto.'}
                  </p>
                </div>
                <button
                  id="alert-toggle"
                  onClick={() => setAlertActive(!alertActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    alertActive ? 'bg-red-500' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                      alertActive ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Mensaje de alerta
                </label>
                <input
                  id="alert-message-input"
                  type="text"
                  value={alertMsg}
                  onChange={(e) => setAlertMsg(e.target.value)}
                  placeholder="ej: ¡Hoy vence el TP1! Entregá antes de las 23:59hs."
                  className="input-dark"
                />
                <p className="text-slate-600 text-xs mt-2">El mensaje se muestra en el banner rojo del sitio público.</p>
              </div>

              {/* Preview */}
              {alertMsg && (
                <div className="rounded-xl bg-red-600 px-4 py-3 flex items-center gap-3">
                  <Bell className="w-4 h-4 text-white flex-shrink-0 animate-pulse" />
                  <p className="text-white text-sm font-semibold">{alertMsg}</p>
                  <AlertTriangle className="w-4 h-4 text-white/60 ml-auto flex-shrink-0" />
                </div>
              )}

              {/* Status */}
              {alertSaveStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl ${
                  alertSaveStatus === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {alertSaveStatus === 'success'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <XCircle className="w-4 h-4 text-red-400" />}
                  <p className={`text-sm ${
                    alertSaveStatus === 'success' ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {alertSaveStatus === 'success' ? 'Alerta guardada correctamente.' : 'Error al guardar. Intentá de nuevo.'}
                  </p>
                </div>
              )}

              {/* Save button */}
              <button
                id="save-alert-btn"
                onClick={saveAlert}
                disabled={savingAlert}
                className="btn-gold w-full justify-center py-3 disabled:opacity-50"
              >
                {savingAlert ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>
                ) : (
                  <><Bell className="w-4 h-4" />Guardar Alerta</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── LIST SECTION ─── */}
        {activeSection === 'list' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Recursos Subidos
                </h1>
                <p className="text-slate-500 text-sm">{resources.length} recursos en total</p>
              </div>
              <button
                onClick={fetchResources}
                className="btn-outline-gold text-xs py-2 px-4"
              >
                Actualizar
              </button>
            </div>

            {loadingResources ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border border-white/5">
                <FileText className="w-12 h-12 text-gold/20 mx-auto mb-4" />
                <p className="text-slate-500">No hay recursos subidos aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="glass rounded-xl px-6 py-4 border border-white/5 flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-lg glass-gold flex items-center justify-center flex-shrink-0">
                      {resource.type !== 'video' ? (
                        <FileText className="w-4 h-4 text-gold" />
                      ) : (
                        <Video className="w-4 h-4 text-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{resource.title}</p>
                      <p className="text-slate-500 text-xs truncate">{resource.subject}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                      resource.type !== 'video'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {resource.type !== 'video' ? 'DOC' : resource.type.toUpperCase()}
                    </span>
                    <span className="text-slate-600 text-xs flex-shrink-0 hidden md:block">
                      {new Date(resource.created_at).toLocaleDateString('es-AR')}
                    </span>
                    <button
                      onClick={() => handleDelete(resource)}
                      disabled={deletingId === resource.id}
                      className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-30"
                    >
                      {deletingId === resource.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tests Section ─────────────────────────────── */}
        {activeSection === 'tests' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Gestionar Tests</h2>
              <p className="text-slate-500 text-sm">Agregá simulacros de Daypo u otros sitios externos para cada materia.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTest} className="glass rounded-2xl p-6 border border-white/5 space-y-5">
              <h3 className="text-sm font-semibold text-gold uppercase tracking-widest flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Nuevo Test
              </h3>

              {/* Name */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Nombre del Test *
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  placeholder="ej: Estatuto Martillero Público"
                  className="input-dark"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Materia *
                </label>
                <div className="relative">
                  <select
                    value={testSubject}
                    onChange={e => setTestSubject(e.target.value)}
                    required
                    className="input-dark appearance-none pr-10"
                  >
                    <option value="" disabled>— Seleccioná una materia —</option>
                    {SUBJECTS.map(s => (
                      <option key={s} value={s} className="bg-navy-800">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Type toggle: Internal quiz vs External link */}
              <div>
                <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                  Tipo de Simulacro
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInternal(false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      !isInternal
                        ? 'bg-gold/10 border-gold/40 text-gold'
                        : 'border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    🔗 Link externo (Daypo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternal(true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      isInternal
                        ? 'bg-purple-500/10 border-purple-500/40 text-purple-400'
                        : 'border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    🧠 Quiz interno (20 preguntas)
                  </button>
                </div>
                {isInternal && (
                  <p className="text-xs text-purple-400/70 mt-2">
                    Se mostrará el quiz interactivo con 20 preguntas mezcladas automáticamente.
                  </p>
                )}
              </div>

              {/* Link (only for external) */}
              {!isInternal && (
                <div>
                  <label className="block text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                    Link del Test (URL) *
                  </label>
                  <input
                    type="url"
                    value={testLink}
                    onChange={e => setTestLink(e.target.value)}
                    placeholder="https://www.daypo.com/tu-test.html"
                    className="input-dark"
                  />
                </div>
              )}

              {/* Status */}
              {testStatus !== 'idle' && (
                <div className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                  testStatus === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/20 text-red-300'
                }`}>
                  {testStatus === 'success'
                    ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    : <XCircle className="w-4 h-4 flex-shrink-0" />
                  }
                  {testMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={savingTest}
                className="btn-gold w-full justify-center py-3 text-sm disabled:opacity-50"
              >
                {savingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
                {savingTest ? 'Guardando...' : 'Guardar Test'}
              </button>
            </form>

            {/* Existing tests list */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Tests Guardados</h3>
              {loadingTests ? (
                <div className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ) : tests.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center">
                  <ClipboardList className="w-10 h-10 text-gold/20 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Todavía no hay tests guardados.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tests.map(test => (
                    <div key={test.id} className="glass rounded-xl px-5 py-4 border border-white/5 flex items-center gap-4">
                      <ClipboardList className="w-4 h-4 text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{test.name}</p>
                        <p className="text-slate-500 text-xs truncate">{test.subject}</p>
                      </div>
                      <a
                        href={test.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-slate-500 hover:text-gold transition-colors"
                        title="Abrir test"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        disabled={deletingTestId === test.id}
                        className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors disabled:opacity-30"
                      >
                        {deletingTestId === test.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GALLERY SECTION ─── */}
        {activeSection === 'galeria' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Images className="w-6 h-6 text-gold" />
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                Galería de Imágenes
              </h1>
            </div>
            <p className="text-slate-500 text-sm mb-8">
              {TOTAL_IMAGES} imágenes · Usá las flechas o las teclas ← → para navegar.
            </p>

            {/* Main viewer */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              {/* Image display */}
              <div className="relative bg-black/40 flex items-center justify-center" style={{ minHeight: '480px' }}>
                <img
                  key={galleryIndex}
                  src={`/galeria/${galleryIndex + 1}.jpeg`}
                  alt={`Imagen ${galleryIndex + 1} de ${TOTAL_IMAGES}`}
                  className="max-h-[480px] max-w-full object-contain"
                  style={{ display: 'block' }}
                />

                {/* Prev button */}
                <button
                  id="gallery-prev"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next button */}
                <button
                  id="gallery-next"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                  {galleryIndex + 1} / {TOTAL_IMAGES}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="p-4 border-t border-white/5 overflow-x-auto">
                <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                  {Array.from({ length: TOTAL_IMAGES }, (_, i) => (
                    <button
                      key={i}
                      id={`thumb-${i + 1}`}
                      onClick={() => setGalleryIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        galleryIndex === i
                          ? 'border-gold scale-105 shadow-lg shadow-gold/20'
                          : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                      }`}
                      title={`Imagen ${i + 1}`}
                    >
                      <img
                        src={`/galeria/${i + 1}.jpeg`}
                        alt={`Miniatura ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

