import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  Gamepad2,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Sparkles,
  Menu,
  Moon,
  Sun,
  Rocket,
  ShieldCheck,
  Zap,
  Smartphone,
  Award,
  Heart,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Megaphone,
  CheckCircle2,
  BadgeCheck,
  Ban,
  Inbox,
} from "lucide-react";

const COLORS = ["#FF6B4A", "#2DD4A7", "#FFC145", "#7C6FF0", "#4A9DFF", "#F45B9C"];

const DEFAULT_CATALOG = {
  settings: {
    speed: 4.5,
    size: "md",
    admPassword: "admin123",
    pixKey: "",
  },
  plans: [
    { id: "p30", days: 30, price: 70, active: true },
    { id: "p60", days: 60, price: 100, active: true },
    { id: "p90", days: 90, price: 120, active: true },
  ],
  pendingSponsors: [],
  sponsors: [
    { id: "s1", name: "TechNova", tagline: "Hospedagem em nuvem sem enrolação", color: "#FF6B4A", link: "https://wa.me/5511999999999" },
    { id: "s2", name: "Pixel Ferramentas", tagline: "Kits de ícones para o seu projeto", color: "#2DD4A7", link: "https://example.com" },
    { id: "s3", name: "Bytebank", tagline: "Conta digital para criadores", color: "#FFC145", link: "https://wa.me/5511988888888" },
  ],
  games: [
    { id: "g1", name: "Bloco Rush", desc: "Quebra-cabeça de blocos contra o tempo", emoji: "🧩", color: "#FF6B4A", link: "https://example.com" },
    { id: "g2", name: "Corrida Neon", desc: "Arcade de corrida em pista infinita", emoji: "🏎️", color: "#7C6FF0", link: "https://example.com" },
    { id: "g3", name: "Memória Fruta", desc: "Jogo da memória com combos", emoji: "🍉", color: "#2DD4A7", link: "https://example.com" },
  ],
  apps: [
    { id: "a1", name: "Conversor PDF", desc: "Transforma imagens e textos em PDF", emoji: "📄", color: "#7C6FF0", link: "https://example.com" },
    { id: "a2", name: "Lista de Tarefas", desc: "Organize seu dia em poucos cliques", emoji: "✅", color: "#2DD4A7", link: "https://example.com" },
    { id: "a3", name: "Calculadora Pro", desc: "Cálculos rápidos e histórico salvo", emoji: "🧮", color: "#FF6B4A", link: "https://example.com" },
  ],
};

const FEATURES = [
  { icon: Rocket, label: "Acesso Rápido", sub: "Tudo online, sem instalação", color: "#7C6FF0" },
  { icon: ShieldCheck, label: "Seguro", sub: "Navegue com tranquilidade", color: "#2DD4A7" },
  { icon: Zap, label: "Leve e Rápido", sub: "Carrega rápido e funciona melhor", color: "#FFC145" },
  { icon: Smartphone, label: "100% Online", sub: "Funciona em qualquer dispositivo", color: "#4A9DFF" },
  { icon: Award, label: "Conteúdo Atualizado", sub: "Novos apps e jogos toda semana", color: "#F45B9C" },
];

function HamburgerMenu({ open, onClose, onNavigate, dark }) {
  if (!open) return null;
  const items = [
    { id: "home", label: "Início" },
    { id: "jogos", label: "Jogos" },
    { id: "apps", label: "Apps Úteis" },
    { id: "anuncie", label: "Divulgue seu negócio" },
    { id: "adm", label: "Painel ADM" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-64 h-full flex flex-col p-5 gap-1"
        style={{ backgroundColor: dark ? "#151533" : "#FFFFFF" }}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="font-bold font-display" style={{ color: dark ? "#F5F3FF" : "#2B2650" }}>
            Menu
          </p>
          <button onClick={onClose} className="p-1" style={{ color: dark ? "#A8A3D9" : "#7A759E" }}>
            <X size={20} />
          </button>
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose();
            }}
            className="text-left py-2.5 px-3 rounded-xl text-sm font-medium transition"
            style={{ color: dark ? "#E5E1F5" : "#2B2650" }}
            onTouchStart={(e) => (e.currentTarget.style.backgroundColor = dark ? "#1F1D45" : "#F7F5FF")}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureBadges({ dark }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {FEATURES.map((f) => (
        <div key={f.label} className="flex flex-col items-center text-center gap-1.5 py-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}22` }}>
            <f.icon size={18} style={{ color: f.color }} />
          </div>
          <p className="text-[11px] font-semibold" style={{ color: dark ? "#F5F3FF" : "#2B2650" }}>
            {f.label}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: dark ? "#7A75A8" : "#B6B0DA" }}>
            {f.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

const uid = () => Math.random().toString(36).slice(2, 9);

// Garante que o link sempre tenha http(s):// na frente, senão o navegador
// tenta abrir/carregar como caminho interno do próprio site e "não funciona".
const normalizeUrl = (link) => {
  if (!link) return "";
  const trimmed = link.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};
const openLink = (link) => {
  if (!link) return;
  window.open(normalizeUrl(link), "_blank", "noopener,noreferrer");
};

// Armazenamento compartilhado via Supabase — todo mundo que acessa a loja
// vê e edita o mesmo catálogo, sincronizado em tempo real entre dispositivos.
const storage = {
  async get(key) {
    if (key !== "catalog") return null;
    const { data, error } = await supabase.from("catalog").select("data").eq("id", 1).single();
    if (error || !data) return null;
    return { key, value: JSON.stringify(data.data) };
  },
  async set(key, value) {
    if (key !== "catalog") return null;
    const parsed = JSON.parse(value);
    const { error } = await supabase.from("catalog").update({ data: parsed }).eq("id", 1);
    if (error) return null;
    return { key, value };
  },
};

// Contador de visitas — cada visitante conta 1 vez por sessão de navegador.
// Guardado numa tabela separada no Supabase (visits), com total geral e por dia.
const todayKey = () => new Date().toISOString().slice(0, 10); // ex: "2026-08-17"

async function getVisitStats() {
  const { data, error } = await supabase.from("visits").select("total, daily").eq("id", 1).single();
  if (error || !data) return { total: 0, daily: {} };
  return { total: data.total || 0, daily: data.daily || {} };
}

async function registerVisit() {
  try {
    if (sessionStorage.getItem("loja_visit_counted")) return;
    const { total, daily } = await getVisitStats();
    const key = todayKey();
    const nextDaily = { ...daily, [key]: (daily[key] || 0) + 1 };
    await supabase.from("visits").update({ total: total + 1, daily: nextDaily }).eq("id", 1);
    sessionStorage.setItem("loja_visit_counted", "1");
  } catch (err) {
    // contador é só informativo — se falhar, não afeta o resto do site
  }
}

// Envia uma imagem para o Supabase Storage (bucket "banners") e retorna o link público
async function uploadBannerImage(file) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${uid()}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("banners").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("banners").getPublicUrl(path);
  return data.publicUrl;
}

const SIZE_CLASSES = {
  sm: "h-24 sm:h-28",
  md: "h-32 sm:h-36",
  lg: "h-40 sm:h-44",
};

const VISIBLE_COUNT = 3;

// ---------- Home: carrossel (mostra 3 patrocinadores por vez) ----------
function SponsorCard({ sponsor, heightClass }) {
  const hasImage = !!sponsor.image;
  return (
    <button
      type="button"
      onClick={() => openLink(sponsor.link)}
      aria-label={`Visitar ${sponsor.name}`}
      className={`relative flex-1 min-w-0 ${heightClass} rounded-2xl border-2 flex flex-col items-center justify-center px-2 text-center overflow-hidden transition active:scale-[0.97]`}
      style={{
        borderColor: "#EFEAFF",
        ...(hasImage ? {} : { background: `linear-gradient(135deg, ${sponsor.color}18, #FFFFFF 75%)` }),
      }}
    >
      {hasImage ? (
        <img src={sponsor.image} alt={sponsor.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <span
            className="relative text-[8px] tracking-[0.15em] uppercase mb-1 font-semibold px-1.5 py-0.5 rounded-full"
            style={{ color: sponsor.color, backgroundColor: `${sponsor.color}18` }}
          >
            Patrocinado
          </span>
          <p className="relative text-xs font-bold font-display truncate w-full" style={{ color: "#2B2650" }}>
            {sponsor.name}
          </p>
          <p className="relative text-[10px] mt-0.5 line-clamp-2 leading-tight" style={{ color: "#7A759E" }}>
            {sponsor.tagline}
          </p>
        </>
      )}
    </button>
  );
}

function SponsorCarousel({ sponsors, speed = 4.5, size = "md" }) {
  const [start, setStart] = useState(0);
  const timerRef = useRef(null);
  const heightClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const startAutoplay = () => {
    clearInterval(timerRef.current);
    if (sponsors.length <= VISIBLE_COUNT) return;
    timerRef.current = setInterval(() => {
      setStart((s) => (s + 1) % sponsors.length);
    }, Math.max(1, speed) * 1000);
  };

  useEffect(() => {
    setStart(0);
    startAutoplay();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors.length, speed]);

  const shift = (dir) => {
    setStart((s) => (s + dir + sponsors.length) % sponsors.length);
    startAutoplay();
  };

  if (sponsors.length === 0) {
    return (
      <div
        className={`w-full ${heightClass} rounded-3xl border-2 flex items-center justify-center text-sm text-[#B6B0DA]`}
        style={{ borderColor: "#EFEAFF" }}
      >
        Nenhum patrocinador cadastrado ainda
      </div>
    );
  }

  const visible = Array.from({ length: Math.min(VISIBLE_COUNT, sponsors.length) }, (_, i) => sponsors[(start + i) % sponsors.length]);

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        {visible.map((sponsor, i) => (
          <SponsorCard key={`${sponsor.id}-${i}`} sponsor={sponsor} heightClass={heightClass} />
        ))}
      </div>

      {sponsors.length > VISIBLE_COUNT && (
        <>
          <button
            aria-label="Patrocinadores anteriores"
            onClick={() => shift(-1)}
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[#2B2650] transition"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            aria-label="Próximos patrocinadores"
            onClick={() => shift(1)}
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[#2B2650] transition"
          >
            <ChevronRight size={14} />
          </button>
          <div className="flex justify-center gap-1.5 mt-2.5">
            {sponsors.map((s, i) => (
              <span
                key={s.id}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === start ? "16px" : "6px", backgroundColor: i === start ? "#7C6FF0" : "#E5E1F5" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CategoryButton({ icon: Icon, label, sublabel, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-1 rounded-2xl border-2 p-6 text-left overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:-translate-y-0.5"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}
    >
      <div
        className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}1F` }}>
        <Icon size={22} style={{ color }} strokeWidth={2.25} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#2B2650] font-display">{label}</h3>
      <p className="text-sm text-[#7A759E] mt-0.5">{sublabel}</p>
    </button>
  );
}

function AppCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen(item);
      }}
      className="w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}
    >
      <div
        className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl overflow-hidden"
        style={{ backgroundColor: `${item.color}1F` }}
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          item.emoji
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#2B2650] font-display truncate">{item.name}</p>
        <p className="text-xs text-[#7A759E] truncate">{item.desc}</p>
      </div>
      <ExternalLink size={16} className="text-[#B6B0DA] shrink-0" />
    </button>
  );
}

function ListView({ title, subtitle, items, accent, onBack, onOpen, sponsors, carouselSettings }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-[#7A759E] hover:text-[#2B2650] transition mb-4">
        <ArrowLeft size={16} /> Voltar
      </button>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#2B2650] font-display">{title}</h2>
        <p className="text-sm text-[#7A759E] mt-0.5">{subtitle}</p>
      </div>
      {sponsors && (
        <div className="mb-5">
          <SponsorCarousel sponsors={sponsors} speed={carouselSettings?.speed} size={carouselSettings?.size} />
        </div>
      )}
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 p-8 text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
          <p className="text-sm text-[#B6B0DA]">Nada cadastrado nessa categoria ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <AppCard key={item.id} item={item} onOpen={onOpen} />
          ))}
        </div>
      )}
      <p className="text-center text-xs mt-6" style={{ color: accent }}>
        Cadastre novos itens pelo painel ADM
      </p>
    </div>
  );
}

function AppViewer({ item, onClose }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [item]);

  if (!item) return null;

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#FAF8FF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
      `}</style>
      <div className="flex items-center gap-3 px-4 py-3 border-b-2" style={{ borderColor: "#EFEAFF" }}>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#7A759E] hover:text-[#2B2650] transition"
          style={{ backgroundColor: "#F0ECFF" }}
        >
          <X size={17} />
        </button>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${item.color}1F` }}>
          {item.emoji}
        </div>
        <p className="font-semibold text-[#2B2650] font-display truncate">{item.name}</p>
      </div>

      {item.embed && item.link ? (
        <div className="relative flex-1">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "#FAF8FF" }}>
              <Loader2 size={26} className="animate-spin text-[#7C6FF0]" />
            </div>
          )}
          <iframe
            src={normalizeUrl(item.link)}
            title={item.name}
            className="absolute inset-0 w-full h-full border-0"
            style={{ opacity: iframeLoaded ? 1 : 0 }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-pointer-lock allow-orientation-lock"
            allow="fullscreen; autoplay; clipboard-write; gamepad; accelerometer; gyroscope"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl overflow-hidden"
            style={{ backgroundColor: `${item.color}1F` }}
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              item.emoji
            )}
          </div>
          <div>
            <p className="font-bold text-[#2B2650] font-display text-lg">{item.name}</p>
            {item.desc && <p className="text-sm text-[#7A759E] mt-1 max-w-xs">{item.desc}</p>}
          </div>

          {item.link ? (
            <>
              {/* Usamos <a target="_blank"> em vez de window.open: funciona de forma mais
                  confiável em navegadores de celular e não substitui a aba da loja. */}
              <a
                href={normalizeUrl(item.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold px-6 py-3 rounded-xl text-white transition active:scale-[0.98] inline-block"
                style={{ backgroundColor: item.color }}
              >
                Abrir {item.name}
              </a>
              <p className="text-xs text-[#B6B0DA] max-w-xs">
                Vai abrir em uma nova aba, e a loja continua aberta aqui. Para voltar, é só trocar de aba
                ou tocar no botão abaixo.
              </p>
            </>
          ) : (
            <p className="text-sm text-[#B6B0DA]">Esse item ainda não tem um link cadastrado.</p>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl border-2 transition active:scale-[0.98]"
            style={{ borderColor: "#EFEAFF", color: "#7A759E" }}
          >
            <ArrowLeft size={16} /> Voltar para a loja
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- ADM ----------
const EMPTY_SPONSOR = {
  name: "",
  tagline: "",
  link: "",
  color: COLORS[0],
  image: "",
  startDate: "",
  endDate: "",
  showOnHome: true,
  showOnApps: true,
};
const EMPTY_ENTRY = { name: "", desc: "", emoji: "✨", link: "", color: COLORS[0], embed: false, image: "" };

// Um patrocinador está "ativo" se hoje está dentro do período contratado
// (campos em branco = sem limite naquele lado)
const isSponsorActive = (sponsor) => {
  const today = new Date().toISOString().slice(0, 10);
  if (sponsor.startDate && today < sponsor.startDate) return false;
  if (sponsor.endDate && today > sponsor.endDate) return false;
  return true;
};

// Filtra por período ativo E por onde o patrocinador deve aparecer (home / apps úteis)
const sponsorsFor = (sponsors, place) =>
  sponsors.filter((s) => isSponsorActive(s) && (place === "home" ? s.showOnHome !== false : s.showOnApps !== false));

function EntryForm({ kind, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const isSponsor = kind === "sponsors";
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadBannerImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError("Não foi possível enviar a imagem. Tente colar um link em vez disso.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Preencha ao menos o nome antes de salvar.");
      return;
    }
    setError("");
    onSave({ ...form, id: form.id || uid() });
  };

  return (
    <div
      className="rounded-2xl border-2 p-4 flex flex-col gap-3 mb-4"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#2B2650] font-display">
          {form.id ? "Editar item" : "Novo item"}
        </p>
        <button type="button" onClick={onCancel} className="text-[#B6B0DA] hover:text-[#2B2650] transition">
          <X size={16} />
        </button>
      </div>

      <input
        required
        placeholder="Nome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
        style={{ borderColor: "#EFEAFF" }}
      />

      {isSponsor ? (
        <>
          <input
            placeholder="Frase curta (tagline)"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />

          <div>
            <label className="block text-xs text-[#7A759E] mb-1.5">Imagem do banner (opcional)</label>

            {form.image && (
              <div className="relative rounded-xl overflow-hidden border-2 mb-2" style={{ borderColor: "#EFEAFF" }}>
                <img
                  src={form.image}
                  alt="Prévia do banner"
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#F45B9C] shadow-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full rounded-xl border-2 border-dashed py-2.5 text-xs font-medium text-[#7A759E] transition hover:border-[#D9D2F5] disabled:opacity-60"
              style={{ borderColor: "#EFEAFF" }}
            >
              {uploading ? "Enviando..." : form.image ? "Trocar imagem da galeria" : "Escolher imagem da galeria"}
            </button>

            <p className="text-[11px] text-[#B6B0DA] text-center my-1.5">ou</p>

            <input
              placeholder="Colar link direto de uma imagem"
              value={form.image && form.image.startsWith("http") ? form.image : ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
              style={{ borderColor: "#EFEAFF" }}
            />
            <p className="text-[11px] text-[#B6B0DA] mt-1">
              Se o botão da galeria não abrir nada, use o campo de link como alternativa.
            </p>
          </div>

          <div>
            <label className="block text-xs text-[#7A759E] mb-1.5">Período de divulgação (opcional)</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-[#B6B0DA] mb-1">Início</label>
                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-xl border-2 px-2.5 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
                  style={{ borderColor: "#EFEAFF" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-[#B6B0DA] mb-1">Fim</label>
                <input
                  type="date"
                  value={form.endDate || ""}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full rounded-xl border-2 px-2.5 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
                  style={{ borderColor: "#EFEAFF" }}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#B6B0DA] mt-1">
              Deixe em branco para não limitar. Ao passar da data final, o banner some sozinho do
              carrossel (fica salvo, só para de aparecer).
            </p>
          </div>

          <div>
            <label className="block text-xs text-[#7A759E] mb-1.5">Onde este banner aparece</label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 rounded-xl p-2 cursor-pointer" style={{ backgroundColor: "#F7F5FF" }}>
                <input
                  type="checkbox"
                  checked={form.showOnHome !== false}
                  onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                  className="w-4 h-4 accent-[#7C6FF0]"
                />
                <span className="text-xs text-[#7A759E]">
                  <strong className="text-[#2B2650]">Página inicial</strong> (Home)
                </span>
              </label>
              <label className="flex items-center gap-2 rounded-xl p-2 cursor-pointer" style={{ backgroundColor: "#F7F5FF" }}>
                <input
                  type="checkbox"
                  checked={form.showOnApps !== false}
                  onChange={(e) => setForm({ ...form, showOnApps: e.target.checked })}
                  className="w-4 h-4 accent-[#7C6FF0]"
                />
                <span className="text-xs text-[#7A759E]">
                  <strong className="text-[#2B2650]">Tela de Apps Úteis</strong>
                </span>
              </label>
            </div>
            <p className="text-[11px] text-[#B6B0DA] mt-1">
              Marque as duas para o pacote completo, ou só uma para cobrar por publicação avulsa.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              placeholder="Emoji"
              value={form.emoji}
              maxLength={4}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              className="w-16 rounded-xl border-2 px-3 py-2 text-sm text-center outline-none focus:border-[#7C6FF0] transition"
              style={{ borderColor: "#EFEAFF" }}
            />
            <input
              placeholder="Descrição curta"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="flex-1 rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
              style={{ borderColor: "#EFEAFF" }}
            />
          </div>

          <div>
            <label className="block text-xs text-[#7A759E] mb-1.5">Imagem/ícone (opcional — se não colocar, usa o emoji)</label>

            {form.image && (
              <div className="relative rounded-xl overflow-hidden border-2 mb-2" style={{ borderColor: "#EFEAFF" }}>
                <img
                  src={form.image}
                  alt="Prévia da imagem"
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#F45B9C] shadow-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full rounded-xl border-2 border-dashed py-2.5 text-xs font-medium text-[#7A759E] transition hover:border-[#D9D2F5] disabled:opacity-60"
              style={{ borderColor: "#EFEAFF" }}
            >
              {uploading ? "Enviando..." : form.image ? "Trocar imagem da galeria" : "Escolher imagem da galeria"}
            </button>

            <p className="text-[11px] text-[#B6B0DA] text-center my-1.5">ou</p>

            <input
              placeholder="Colar link direto de uma imagem"
              value={form.image && form.image.startsWith("http") ? form.image : ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
              style={{ borderColor: "#EFEAFF" }}
            />
          </div>
        </>
      )}

      <input
        placeholder={isSponsor ? "Link (site ou wa.me/...) — opcional por enquanto" : "Link do app/jogo — opcional por enquanto"}
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
        className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
        style={{ borderColor: "#EFEAFF" }}
      />

      {error && <p className="text-xs text-[#F45B9C]">{error}</p>}

      <div className="flex items-center gap-2">
        <span className="text-xs text-[#7A759E] mr-1">Cor</span>
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Cor ${c}`}
            onClick={() => setForm({ ...form, color: c })}
            className="w-6 h-6 rounded-full transition"
            style={{ backgroundColor: c, outline: form.color === c ? `2px solid ${c}` : "none", outlineOffset: "2px" }}
          />
        ))}
      </div>

      {!isSponsor && (
        <label className="flex items-start gap-2.5 rounded-xl p-2.5 cursor-pointer" style={{ backgroundColor: "#F7F5FF" }}>
          <input
            type="checkbox"
            checked={!!form.embed}
            onChange={(e) => setForm({ ...form, embed: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-[#7C6FF0]"
          />
          <span className="text-xs text-[#7A759E] leading-relaxed">
            <strong className="text-[#2B2650]">Tentar abrir dentro da loja.</strong> Só marque se você já
            testou e sabe que esse app permite ser embutido — senão pode aparecer uma tela de erro do
            navegador. Deixe desmarcado para abrir sempre pelo botão.
          </span>
        </label>
      )}

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: "#7C6FF0" }}
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-medium text-[#7A759E] border-2 transition"
          style={{ borderColor: "#EFEAFF" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function AdminList({ kind, label, items, onAdd, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const isSponsor = kind === "sponsors";

  const editingItem = items.find((i) => i.id === editingId);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#2B2650] font-display">{label}</p>
        {!adding && !editingId && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-white transition"
            style={{ backgroundColor: "#7C6FF0" }}
          >
            <Plus size={14} /> Adicionar
          </button>
        )}
      </div>

      {adding && (
        <EntryForm
          kind={kind}
          initial={isSponsor ? EMPTY_SPONSOR : EMPTY_ENTRY}
          onCancel={() => setAdding(false)}
          onSave={(entry) => {
            onAdd(entry);
            setAdding(false);
          }}
        />
      )}

      {editingItem && (
        <EntryForm
          kind={kind}
          initial={editingItem}
          onCancel={() => setEditingId(null)}
          onSave={(entry) => {
            onUpdate(entry);
            setEditingId(null);
          }}
        />
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border-2 p-3"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}
          >
            <div
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-lg overflow-hidden"
              style={{ backgroundColor: `${item.color}1F` }}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : isSponsor ? (
                "📣"
              ) : (
                item.emoji
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2B2650] truncate">{item.name}</p>
              <p className="text-xs text-[#B6B0DA] truncate">{item.link}</p>
              {isSponsor && (item.startDate || item.endDate) && (
                <p className={`text-[10px] font-semibold ${isSponsorActive(item) ? "text-[#2DD4A7]" : "text-[#F45B9C]"}`}>
                  {isSponsorActive(item) ? "● Ativo" : "● Fora do período"}
                  {item.endDate ? ` · até ${item.endDate.split("-").reverse().join("/")}` : ""}
                </p>
              )}
              {isSponsor && (
                <p className="text-[10px] text-[#B6B0DA]">
                  {item.showOnHome !== false && item.showOnApps !== false
                    ? "Home + Apps Úteis"
                    : item.showOnHome !== false
                    ? "Só na Home"
                    : item.showOnApps !== false
                    ? "Só em Apps Úteis"
                    : "Nenhum lugar (revise)"}
                </p>
              )}
            </div>
            <button onClick={() => setEditingId(item.id)} className="text-[#B6B0DA] hover:text-[#7C6FF0] transition p-1">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(item.id)} className="text-[#B6B0DA] hover:text-[#F45B9C] transition p-1">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {items.length === 0 && !adding && (
          <p className="text-xs text-[#B6B0DA] text-center py-2">Nada cadastrado ainda</p>
        )}
      </div>
    </div>
  );
}

const ADVANTAGES = [
  "Banner em destaque no carrossel da loja",
  "Link direto para seu site ou WhatsApp, a um toque de distância",
  "Alcance visitantes toda vez que abrem a loja de apps",
  "Escolha aparecer na Home, em Apps Úteis, ou nas duas páginas",
];

const EMPTY_AD_REQUEST = {
  name: "",
  tagline: "",
  link: "",
  image: "",
  showOnHome: true,
  showOnApps: true,
  startDate: "",
  planId: "",
};

function AdvertisePage({ plans, pixKey, onSubmit, onBack }) {
  const [form, setForm] = useState(EMPTY_AD_REQUEST);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleCopyPix = () => {
    if (!pixKey) return;

    const showCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Método moderno (funciona na maioria dos sites publicados)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pixKey).then(showCopied).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }

    // Método alternativo (mais compatível com ambientes restritos, ex: dentro do Claude)
    function fallbackCopy() {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = pixKey;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (ok) showCopied();
      } catch (err) {
        // se nada funcionar, o campo com a chave continua visível para copiar manualmente
      }
    }
  };

  const activePlans = plans.filter((p) => p.active);
  const selectedPlan = activePlans.find((p) => p.id === form.planId);
  const bothPages = form.showOnHome && form.showOnApps;
  const finalPrice = selectedPlan ? selectedPlan.price * (bothPages ? 2 : 1) : 0;

  const startDate = form.startDate || new Date().toISOString().slice(0, 10);
  const endDate = selectedPlan
    ? new Date(new Date(startDate).getTime() + selectedPlan.days * 86400000).toISOString().slice(0, 10)
    : "";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadBannerImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError("Não foi possível enviar a imagem. Tente colar um link em vez disso.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("Preencha o nome do negócio.");
    if (!form.planId) return setError("Escolha um plano.");
    if (!form.showOnHome && !form.showOnApps) return setError("Marque ao menos um local para o banner aparecer.");
    setError("");
    onSubmit({
      ...form,
      id: uid(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      startDate,
      endDate,
      planId: form.planId,
      planDays: selectedPlan.days,
      planPrice: finalPrice,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#2DD4A71F" }}>
          <CheckCircle2 size={26} className="text-[#2DD4A7]" />
        </div>
        <h2 className="text-lg font-bold text-[#2B2650] font-display">Solicitação enviada!</h2>
        <p className="text-sm text-[#7A759E] mt-2 max-w-xs">
          Recebemos seu cadastro para o plano de {selectedPlan?.days} dias (R$ {finalPrice.toFixed(2)}).
        </p>

        {pixKey ? (
          <div className="w-full max-w-xs rounded-2xl border-2 p-4 mt-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
            <p className="text-xs text-[#7A759E] mb-2">Pague com Pix para confirmar:</p>
            <p className="text-sm font-semibold text-[#2B2650] break-all mb-3">{pixKey}</p>
            <button
              onClick={handleCopyPix}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150 flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: copied ? "#2DD4A7" : "#7C6FF0",
                transform: copied ? "scale(0.96)" : "scale(1)",
                boxShadow: copied ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "0 2px 6px rgba(124,111,240,0.35)",
              }}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={16} /> Chave copiada!
                </>
              ) : (
                "Copiar chave Pix"
              )}
            </button>
            <p className="text-[11px] text-[#B6B0DA] mt-2">
              Depois de pagar, seu banner entra no ar assim que confirmarmos o recebimento.
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#B6B0DA] mt-3 max-w-xs">
            Assim que o pagamento for combinado e confirmado, seu banner entra no ar.
          </p>
        )}

        <button onClick={onBack} className="mt-6 text-sm font-semibold text-[#7C6FF0]">
          ← Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-[#7A759E] hover:text-[#2B2650] transition mb-4">
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #7C6FF0, #4A9DFF)" }}>
          <Megaphone size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#2B2650] font-display">Divulgue seu negócio aqui</h2>
        <p className="text-sm text-[#7A759E] mt-1">Apareça para quem já está de olho nos nossos apps e jogos</p>
      </div>

      <div className="rounded-2xl border-2 p-4 mb-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
        <p className="text-sm font-bold text-[#2B2650] font-display mb-2.5">Vantagens</p>
        <div className="flex flex-col gap-2">
          {ADVANTAGES.map((a) => (
            <div key={a} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-[#2DD4A7] shrink-0 mt-0.5" />
              <p className="text-xs text-[#7A759E]">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm font-bold text-[#2B2650] font-display mb-2.5">Escolha o plano</p>
      <div className="flex flex-col gap-2 mb-6">
        {activePlans.length === 0 && (
          <p className="text-xs text-[#B6B0DA] text-center py-3">Nenhum plano disponível no momento.</p>
        )}
        {activePlans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setForm({ ...form, planId: plan.id })}
            className="flex items-center justify-between rounded-2xl border-2 p-4 text-left transition"
            style={{
              borderColor: form.planId === plan.id ? "#7C6FF0" : "#EFEAFF",
              backgroundColor: form.planId === plan.id ? "#7C6FF00D" : "#FFFFFF",
            }}
          >
            <div>
              <p className="font-bold text-[#2B2650] font-display">{plan.days} dias</p>
              <p className="text-xs text-[#7A759E]">Banner rotativo no carrossel</p>
            </div>
            <p className="text-lg font-extrabold font-display" style={{ color: "#7C6FF0" }}>
              R$ {plan.price.toFixed(2)}
            </p>
          </button>
        ))}
      </div>

      <p className="text-sm font-bold text-[#2B2650] font-display mb-2.5">Dados do seu negócio</p>
      <div className="rounded-2xl border-2 p-4 flex flex-col gap-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
        <input
          placeholder="Nome do negócio"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
          style={{ borderColor: "#EFEAFF" }}
        />
        <input
          placeholder="Frase curta (tagline)"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
          style={{ borderColor: "#EFEAFF" }}
        />

        <div>
          <label className="block text-xs text-[#7A759E] mb-1.5">Imagem do banner (opcional)</label>
          {form.image && (
            <div className="relative rounded-xl overflow-hidden border-2 mb-2" style={{ borderColor: "#EFEAFF" }}>
              <img src={form.image} alt="Prévia" className="w-full h-24 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              <button
                type="button"
                onClick={() => setForm({ ...form, image: "" })}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#F45B9C] shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="w-full rounded-xl border-2 border-dashed py-2.5 text-xs font-medium text-[#7A759E] transition disabled:opacity-60"
            style={{ borderColor: "#EFEAFF" }}
          >
            {uploading ? "Enviando..." : form.image ? "Trocar imagem" : "Escolher imagem"}
          </button>
          <p className="text-[11px] text-[#B6B0DA] text-center my-1.5">ou</p>
          <input
            placeholder="Colar link direto de uma imagem"
            value={form.image && form.image.startsWith("http") ? form.image : ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />
        </div>

        <input
          placeholder="Link do site ou WhatsApp (ex: wa.me/55...)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
          style={{ borderColor: "#EFEAFF" }}
        />

        <div>
          <label className="block text-xs text-[#7A759E] mb-1.5">Onde este banner deve aparecer</label>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 rounded-xl p-2 cursor-pointer" style={{ backgroundColor: "#F7F5FF" }}>
              <input
                type="checkbox"
                checked={form.showOnHome}
                onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                className="w-4 h-4 accent-[#7C6FF0]"
              />
              <span className="text-xs text-[#7A759E]">
                <strong className="text-[#2B2650]">Página inicial</strong> (Home)
              </span>
            </label>
            <label className="flex items-center gap-2 rounded-xl p-2 cursor-pointer" style={{ backgroundColor: "#F7F5FF" }}>
              <input
                type="checkbox"
                checked={form.showOnApps}
                onChange={(e) => setForm({ ...form, showOnApps: e.target.checked })}
                className="w-4 h-4 accent-[#7C6FF0]"
              />
              <span className="text-xs text-[#7A759E]">
                <strong className="text-[#2B2650]">Tela de Apps Úteis</strong>
              </span>
            </label>
          </div>

          {selectedPlan && (
            <div className="mt-2.5 rounded-xl p-4 flex flex-col items-center text-center" style={{ backgroundColor: "#F45B9C0D", border: "2px solid #F45B9C33" }}>
              <p className="text-xs text-[#7A759E] mb-1">
                {bothPages ? "Home + Apps Úteis (valor em dobro)" : "Uma página selecionada"}
              </p>
              <p className="text-3xl font-extrabold font-display" style={{ color: "#F45B9C" }}>
                R$ {finalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-[#7A759E] mb-1.5">Data de início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full rounded-xl border-2 px-2.5 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />
          {selectedPlan && (
            <p className="text-[11px] text-[#B6B0DA] mt-1">
              Termina em {endDate.split("-").reverse().join("/")} ({selectedPlan.days} dias)
            </p>
          )}
        </div>

        {error && <p className="text-xs text-[#F45B9C]">{error}</p>}

        <button
          onClick={handleSubmit}
          className="rounded-xl py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: "#7C6FF0" }}
        >
          Enviar solicitação
        </button>
        <p className="text-[11px] text-[#B6B0DA] text-center">
          O banner só entra no ar depois que o pagamento for confirmado com a equipe.
        </p>
      </div>
    </div>
  );
}

function AdminLogin({ correctPassword, onUnlock, onBack }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (value === correctPassword) {
      onUnlock();
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-4 py-10">
      <button onClick={onBack} className="self-start flex items-center gap-1.5 text-sm font-medium text-[#7A759E] hover:text-[#2B2650] transition mb-6">
        <ArrowLeft size={16} /> Voltar
      </button>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#7C6FF01F" }}>
        <Lock size={24} className="text-[#7C6FF0]" />
      </div>
      <h2 className="text-lg font-bold text-[#2B2650] font-display">Painel ADM</h2>
      <p className="text-sm text-[#7A759E] mt-1 mb-5">Digite a senha para continuar</p>

      <div className="w-full max-w-xs relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Senha"
          autoFocus
          className="w-full rounded-xl border-2 px-3 py-2.5 pr-10 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition text-center"
          style={{ borderColor: "#EFEAFF" }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B6B0DA]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="text-xs text-[#F45B9C] mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full max-w-xs rounded-xl py-2.5 mt-4 text-sm font-semibold text-white transition active:scale-[0.98]"
        style={{ backgroundColor: "#7C6FF0" }}
      >
        Entrar
      </button>
    </div>
  );
}

function ChangePasswordBox({ currentPassword, onChangePassword }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (current !== currentPassword) {
      setError("Senha atual incorreta.");
      return;
    }
    if (!next.trim()) {
      setError("Digite a nova senha.");
      return;
    }
    if (next !== confirm) {
      setError("As senhas novas não coincidem.");
      return;
    }
    onChangePassword(next);
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    setOpen(false);
  };

  return (
    <div className="rounded-2xl border-2 p-4 mb-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-sm font-bold text-[#2B2650] font-display"
      >
        <span className="flex items-center gap-2">
          <KeyRound size={15} className="text-[#7C6FF0]" /> Trocar senha do ADM
        </span>
        <span className="text-[#B6B0DA] text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2 mt-3">
          <input
            type="password"
            placeholder="Senha atual"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
            style={{ borderColor: "#EFEAFF" }}
          />
          {error && <p className="text-xs text-[#F45B9C]">{error}</p>}
          <button
            onClick={handleSave}
            className="rounded-xl py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
            style={{ backgroundColor: "#7C6FF0" }}
          >
            Salvar nova senha
          </button>
        </div>
      )}
      {success && <p className="text-xs text-[#2DD4A7] mt-2">Senha alterada com sucesso!</p>}
    </div>
  );
}

function AdminPanel({ catalog, setCatalog, onBack }) {
  const [tab, setTab] = useState("sponsors");

  const update = (kind, next) => {
    setCatalog((prev) => ({ ...prev, [kind]: next }));
  };

  const updateSettings = (patch) => {
    setCatalog((prev) => ({ ...prev, settings: { ...(prev.settings || {}), ...patch } }));
  };

  const addItem = (kind) => (entry) => update(kind, [...catalog[kind], entry]);
  const updateItem = (kind) => (entry) => update(kind, catalog[kind].map((i) => (i.id === entry.id ? entry : i)));
  const deleteItem = (kind) => (id) => update(kind, catalog[kind].filter((i) => i.id !== id));

  const settings = catalog.settings || { speed: 4.5, size: "md" };

  const plans = catalog.plans || [];
  const pending = catalog.pendingSponsors || [];

  const updatePlans = (next) => setCatalog((prev) => ({ ...prev, plans: next }));
  const updatePlan = (id, patch) => updatePlans(plans.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addPlan = () =>
    updatePlans([...plans, { id: uid(), days: 30, price: 0, active: true }]);
  const deletePlan = (id) => updatePlans(plans.filter((p) => p.id !== id));

  const approveRequest = (req) => {
    const { planId, planDays, planPrice, ...sponsorData } = req;
    update("sponsors", [...catalog.sponsors, sponsorData]);
    update("pendingSponsors", pending.filter((r) => r.id !== req.id));
  };
  const rejectRequest = (id) => update("pendingSponsors", pending.filter((r) => r.id !== id));

  const TABS = [
    { id: "sponsors", label: "Patrocinadores" },
    { id: "games", label: "Jogos" },
    { id: "apps", label: "Apps Úteis" },
    { id: "ads", label: `Anúncios${pending.length ? ` (${pending.length})` : ""}` },
    { id: "visits", label: "Visitantes" },
  ];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-[#7A759E] hover:text-[#2B2650] transition mb-4">
        <ArrowLeft size={16} /> Voltar
      </button>

      <h2 className="text-xl font-bold text-[#2B2650] font-display mb-1">Painel ADM</h2>
      <p className="text-xs text-[#7A759E] mb-4">
        As alterações aqui aparecem na hora para quem acessar a loja.
      </p>

      <ChangePasswordBox
        currentPassword={settings.admPassword || "admin123"}
        onChangePassword={(newPass) => updateSettings({ admPassword: newPass })}
      />

      <div className="flex gap-1.5 mb-5 rounded-full p-1" style={{ backgroundColor: "#F0ECFF" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 rounded-full py-1.5 text-xs font-semibold transition"
            style={{
              backgroundColor: tab === t.id ? "#FFFFFF" : "transparent",
              color: tab === t.id ? "#2B2650" : "#7A759E",
              boxShadow: tab === t.id ? "0 1px 3px rgba(43,38,80,0.12)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "sponsors" && (
        <>
          <div className="rounded-2xl border-2 p-4 mb-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
            <p className="text-sm font-bold text-[#2B2650] font-display mb-3">Configurações do carrossel</p>

            <label className="block text-xs text-[#7A759E] mb-1.5">
              Velocidade (troca a cada {settings.speed}s)
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={settings.speed}
              onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
              className="w-full accent-[#7C6FF0] mb-4"
            />

            <label className="block text-xs text-[#7A759E] mb-1.5">Tamanho do banner</label>
            <div className="flex gap-2">
              {[
                { id: "sm", label: "Pequeno" },
                { id: "md", label: "Médio" },
                { id: "lg", label: "Grande" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSettings({ size: opt.id })}
                  className="flex-1 rounded-xl py-1.5 text-xs font-semibold transition"
                  style={{
                    backgroundColor: settings.size === opt.id ? "#7C6FF0" : "#F0ECFF",
                    color: settings.size === opt.id ? "#FFFFFF" : "#7A759E",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <AdminList
            kind="sponsors"
            label="Patrocinadores"
            items={catalog.sponsors}
            onAdd={addItem("sponsors")}
            onUpdate={updateItem("sponsors")}
            onDelete={deleteItem("sponsors")}
          />
        </>
      )}
      {tab === "games" && (
        <AdminList
          kind="games"
          label="Jogos"
          items={catalog.games}
          onAdd={addItem("games")}
          onUpdate={updateItem("games")}
          onDelete={deleteItem("games")}
        />
      )}
      {tab === "apps" && (
        <AdminList
          kind="apps"
          label="Apps Úteis"
          items={catalog.apps}
          onAdd={addItem("apps")}
          onUpdate={updateItem("apps")}
          onDelete={deleteItem("apps")}
        />
      )}

      {tab === "ads" && (
        <div>
          {/* Solicitações pendentes */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#2B2650] font-display mb-3 flex items-center gap-1.5">
              <Inbox size={15} className="text-[#7C6FF0]" /> Solicitações pendentes
            </p>
            {pending.length === 0 ? (
              <p className="text-xs text-[#B6B0DA] text-center py-3">Nenhuma solicitação por enquanto</p>
            ) : (
              <div className="flex flex-col gap-2">
                {pending.map((req) => (
                  <div key={req.id} className="rounded-xl border-2 p-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
                    <div className="flex items-center gap-3 mb-2">
                      {req.image ? (
                        <img src={req.image} alt={req.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${req.color}1F` }}>
                          📣
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2B2650] truncate">{req.name}</p>
                        <p className="text-xs text-[#B6B0DA] truncate">{req.link}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#7A759E] mb-2">
                      Plano de {req.planDays} dias · R$ {Number(req.planPrice).toFixed(2)} ·{" "}
                      {req.startDate?.split("-").reverse().join("/")} a {req.endDate?.split("-").reverse().join("/")}
                      <br />
                      {req.showOnHome !== false && req.showOnApps !== false
                        ? "Home + Apps Úteis"
                        : req.showOnHome !== false
                        ? "Só na Home"
                        : "Só em Apps Úteis"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest(req)}
                        className="flex-1 rounded-lg py-1.5 text-xs font-semibold text-white transition"
                        style={{ backgroundColor: "#2DD4A7" }}
                      >
                        Aprovar (pagamento confirmado)
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#F45B9C] border-2"
                        style={{ borderColor: "#F45B9C33" }}
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chave Pix */}
          <div className="rounded-2xl border-2 p-4 mb-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
            <p className="text-sm font-bold text-[#2B2650] font-display mb-2">Chave Pix para recebimento</p>
            <input
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              value={settings.pixKey || ""}
              onChange={(e) => updateSettings({ pixKey: e.target.value })}
              className="w-full rounded-xl border-2 px-3 py-2 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0] transition"
              style={{ borderColor: "#EFEAFF" }}
            />
            <p className="text-[11px] text-[#B6B0DA] mt-1.5">
              Essa chave aparece com um botão de copiar para o anunciante na tela de confirmação do pedido.
            </p>
          </div>

          {/* Gestão de planos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-[#2B2650] font-display">Planos de divulgação</p>
              <button
                onClick={addPlan}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-white transition"
                style={{ backgroundColor: "#7C6FF0" }}
              >
                <Plus size={14} /> Novo plano
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {plans.map((plan) => (
                <div key={plan.id} className="flex items-center gap-2 rounded-xl border-2 p-3" style={{ backgroundColor: "#FFFFFF", borderColor: plan.active ? "#EFEAFF" : "#F4C6D6" }}>
                  <div className="flex-1 flex items-center gap-2">
                    <div>
                      <label className="block text-[10px] text-[#B6B0DA]">Dias</label>
                      <input
                        type="number"
                        min="1"
                        value={plan.days}
                        onChange={(e) => updatePlan(plan.id, { days: parseInt(e.target.value) || 0 })}
                        className="w-16 rounded-lg border-2 px-2 py-1 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0]"
                        style={{ borderColor: "#EFEAFF" }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#B6B0DA]">Preço (R$)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={plan.price}
                        onChange={(e) => updatePlan(plan.id, { price: parseFloat(e.target.value) || 0 })}
                        className="w-20 rounded-lg border-2 px-2 py-1 text-sm text-[#2B2650] outline-none focus:border-[#7C6FF0]"
                        style={{ borderColor: "#EFEAFF" }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => updatePlan(plan.id, { active: !plan.active })}
                    aria-label={plan.active ? "Bloquear plano" : "Ativar plano"}
                    className="p-2 rounded-lg transition"
                    style={{ color: plan.active ? "#2DD4A7" : "#F45B9C", backgroundColor: plan.active ? "#2DD4A71A" : "#F45B9C1A" }}
                  >
                    {plan.active ? <BadgeCheck size={16} /> : <Ban size={16} />}
                  </button>
                  <button onClick={() => deletePlan(plan.id)} className="p-2 text-[#B6B0DA] hover:text-[#F45B9C] transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#B6B0DA] mt-2">
              Planos bloqueados (🚫) não aparecem mais para novos anunciantes, mas continuam salvos.
            </p>
          </div>
        </div>
      )}

      {tab === "visits" && <VisitsPanel />}
    </div>
  );
}

// ---------- Painel ADM: contador de visitantes ----------
function VisitsPanel() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getVisitStats();
        setStats(result);
      } catch (err) {
        setError(true);
      }
    })();
  }, []);

  if (error) {
    return (
      <p className="text-xs text-[#B6B0DA] text-center py-6">
        Não foi possível carregar os dados de visitas agora.
      </p>
    );
  }

  if (!stats) {
    return <p className="text-xs text-[#B6B0DA] text-center py-6">Carregando...</p>;
  }

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    return { key, count: stats.daily[key] || 0 };
  });
  const maxCount = Math.max(1, ...last7.map((d) => d.count));

  return (
    <div>
      <div
        className="rounded-2xl border-2 p-5 mb-5 text-center"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}
      >
        <p className="text-xs text-[#7A759E] mb-1">Total de visitas desde o início</p>
        <p className="text-4xl font-bold text-[#2B2650] font-display">{stats.total}</p>
      </div>

      <div className="rounded-2xl border-2 p-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#EFEAFF" }}>
        <p className="text-sm font-bold text-[#2B2650] font-display mb-3">Últimos 7 dias</p>
        <div className="flex flex-col gap-2">
          {last7.reverse().map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="text-xs text-[#7A759E] w-16 shrink-0">
                {d.key.split("-").reverse().slice(0, 2).join("/")}
              </span>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: "#F0ECFF" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: "#7C6FF0" }}
                />
              </div>
              <span className="text-xs font-semibold text-[#2B2650] w-6 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#B6B0DA] mt-3 text-center">
        Cada pessoa é contada 1 vez por visita à loja (mesmo se navegar entre várias páginas).
      </p>
    </div>
  );
}

// ---------- App raiz ----------
export default function LojaHome() {
  const [view, setView] = useState("home");
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [openItem, setOpenItem] = useState(null);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  // carrega catálogo salvo (compartilhado — visível para todos que acessarem a loja)
  useEffect(() => {
    (async () => {
      try {
        const result = await storage.get("catalog");
        if (result && result.value) {
          setCatalog(JSON.parse(result.value));
        }
      } catch (err) {
        // ainda não existe catálogo salvo — usa os dados de exemplo
      } finally {
        setLoading(false);
      }
    })();
    registerVisit();
  }, []);

  // salva automaticamente quando o catálogo muda (depois do carregamento inicial)
  const firstRun = useRef(true);
  const saveCatalog = async (data, attempt = 1) => {
    setSaveState("saving");
    try {
      const result = await storage.set("catalog", JSON.stringify(data));
      if (result) {
        setSaveState("saved");
      } else if (attempt < 3) {
        setTimeout(() => saveCatalog(data, attempt + 1), 800 * attempt);
      } else {
        setSaveState("error");
      }
    } catch (err) {
      if (attempt < 3) {
        setTimeout(() => saveCatalog(data, attempt + 1), 800 * attempt);
      } else {
        setSaveState("error");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    saveCatalog(catalog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, loading]);

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "#FAF8FF" }}
      >
        <Loader2 size={28} className="animate-spin text-[#7C6FF0]" />
      </div>
    );
  }

  if (openItem) {
    return <AppViewer item={openItem} onClose={() => setOpenItem(null)} />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-8 sm:py-12 transition-colors duration-300"
      style={{
        backgroundColor: view === "home" ? (dark ? "#0B0B1E" : "#FAF8FF") : "#FAF8FF",
        backgroundImage:
          view === "home" && dark
            ? "radial-gradient(circle at 20% 0%, rgba(124,111,240,0.25), transparent 45%), radial-gradient(circle at 85% 15%, rgba(45,212,167,0.15), transparent 40%)"
            : "none",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
      `}</style>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={setView} dark={view === "home" && dark} />

      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl transition-[max-width]">
        <div className="flex items-center justify-between mb-6">
          {view === "home" ? (
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #7C6FF0, #4A9DFF, #2DD4A7)" }}
              >
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold font-display leading-tight" style={{ color: dark ? "#F5F3FF" : "#2B2650" }}>
                  Central de Mini Apps
                </h1>
                <p className="text-[10px]" style={{ color: dark ? "#7A75A8" : "#7A759E" }}>
                  Tudo em um só lugar. Rápido, leve e online!
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#7C6FF0] font-semibold">Loja de Apps</p>
              <h1 className="text-2xl font-bold text-[#2B2650] font-display -mt-0.5">O que vamos abrir hoje?</h1>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {view === "home" && (
              <button
                aria-label="Alternar tema"
                onClick={() => setDark((d) => !d)}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition"
                style={{
                  backgroundColor: dark ? "#151533" : "#FFFFFF",
                  borderColor: dark ? "#2A2A55" : "#EFEAFF",
                  color: dark ? "#F5F3FF" : "#7A759E",
                }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition"
              style={{
                backgroundColor: view === "home" && dark ? "#151533" : "#FFFFFF",
                borderColor: view === "home" && dark ? "#2A2A55" : "#EFEAFF",
                color: view === "home" && dark ? "#F5F3FF" : "#7A759E",
              }}
            >
              <Menu size={16} />
            </button>
            <button
              aria-label="Painel do administrador"
              onClick={() => setView(view === "adm" ? "home" : "adm")}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition"
              style={{
                backgroundColor: view === "home" && dark ? "#151533" : "#FFFFFF",
                borderColor: view === "home" && dark ? "#2A2A55" : "#EFEAFF",
                color: view === "home" && dark ? "#F5F3FF" : "#7A759E",
              }}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {view === "home" && (
          <div key="home">
            {/* Ícone e título de destaque */}
            <div className="flex flex-col items-center text-center mb-7">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: "linear-gradient(135deg, #7C6FF0, #4A9DFF 55%, #2DD4A7)" }}
              >
                <Sparkles size={34} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold font-display leading-tight" style={{ color: dark ? "#F5F3FF" : "#2B2650" }}>
                Central de{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #7C6FF0, #4A9DFF, #2DD4A7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Mini Apps
                </span>
              </h2>
              <p className="text-sm mt-2" style={{ color: dark ? "#A8A3D9" : "#7A759E" }}>
                Jogos e aplicativos úteis direto no seu navegador.
              </p>
              <p className="text-xs font-semibold mt-1" style={{ color: "#2DD4A7" }}>
                Sem instalação, sem complicação.
              </p>
            </div>

            {/* Botões de categoria estilo cartão grande */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setView("jogos")}
                className="rounded-2xl p-5 text-left flex items-center gap-4 transition active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #6D5BE8, #4634B8)" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Gamepad2 size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold font-display text-lg">Jogos</p>
                  <p className="text-white/70 text-xs">Diversão garantida!</p>
                </div>
                <ChevronRight size={20} className="text-white/80" />
              </button>

              <button
                onClick={() => setView("apps")}
                className="rounded-2xl p-5 text-left flex items-center gap-4 transition active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #1FAE85, #0E8064)" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Wrench size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold font-display text-lg">Apps Úteis</p>
                  <p className="text-white/70 text-xs">Ferramentas para o dia a dia!</p>
                </div>
                <ChevronRight size={20} className="text-white/80" />
              </button>
            </div>

            {/* Carrossel de patrocinadores */}
            <div className="mt-5">
              <SponsorCarousel sponsors={sponsorsFor(catalog.sponsors, "home")} speed={catalog.settings?.speed} size={catalog.settings?.size} />
            </div>

            {/* Divulgue seu negócio */}
            <button
              onClick={() => setView("anuncie")}
              className="w-full mt-4 rounded-2xl p-4 flex items-center gap-3 text-left transition active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #FFC145, #FF8A45)" }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                <Megaphone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold font-display text-sm">Divulgue seu negócio aqui</p>
                <p className="text-white/80 text-xs">Planos a partir de R$ 70,00</p>
              </div>
              <ChevronRight size={18} className="text-white/90" />
            </button>

            {/* Selos de confiança */}
            <FeatureBadges dark={dark} />

            <p
              className="text-center text-xs mt-8 flex items-center justify-center gap-1.5"
              style={{ color: dark ? "#7A75A8" : "#B6B0DA" }}
            >
              Feito para você <Heart size={12} className="text-[#F45B9C]" fill="#F45B9C" /> Prático, moderno e sempre ao seu alcance.
            </p>
          </div>
        )}

        {view === "jogos" && (
          <div key="jogos">
            <ListView title="Jogos" subtitle="Escolha um e divirta-se agora mesmo" items={catalog.games} accent="#FF6B4A" onBack={() => setView("home")} onOpen={setOpenItem} />
          </div>
        )}

        {view === "apps" && (
          <div key="apps">
            <ListView
              title="Apps Úteis"
              subtitle="Ferramentas prontas para usar"
              items={catalog.apps}
              accent="#2DD4A7"
              onBack={() => setView("home")}
              onOpen={setOpenItem}
              sponsors={sponsorsFor(catalog.sponsors, "apps")}
              carouselSettings={catalog.settings}
            />
          </div>
        )}

        {view === "anuncie" && (
          <div key="anuncie">
            <AdvertisePage
              plans={catalog.plans || []}
              pixKey={catalog.settings?.pixKey}
              onSubmit={(request) => {
                setCatalog((prev) => ({
                  ...prev,
                  pendingSponsors: [...(prev.pendingSponsors || []), request],
                }));
              }}
              onBack={() => setView("home")}
            />
          </div>
        )}

        {view === "adm" && (
          <div key="adm">
            {!adminUnlocked ? (
              <AdminLogin
                correctPassword={catalog.settings?.admPassword || "admin123"}
                onUnlock={() => setAdminUnlocked(true)}
                onBack={() => setView("home")}
              />
            ) : (
              <AdminPanel catalog={catalog} setCatalog={setCatalog} onBack={() => setView("home")} />
            )}
          </div>
        )}

        {saveState === "saving" && (
          <p className="text-center text-[11px] mt-4" style={{ color: view === "home" && dark ? "#7A75A8" : "#B6B0DA" }}>
            Salvando…
          </p>
        )}
        {saveState === "error" && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <p className="text-[11px] text-[#F45B9C]">Não foi possível salvar agora.</p>
            <button
              onClick={() => saveCatalog(catalog)}
              className="text-[11px] font-semibold underline text-[#7C6FF0]"
            >
              Tentar de novo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}