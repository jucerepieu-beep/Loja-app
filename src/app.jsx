import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

const COLORS = ["#FF6B4A", "#2DD4A7", "#FFC145", "#7C6FF0", "#4A9DFF", "#F45B9C"];

const DEFAULT_CATALOG = {
  settings: { speed: 4.5, size: "md" },
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

const uid = () => Math.random().toString(36).slice(2, 9);

const storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value ? { key, value } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
};

const SIZE_CLASSES = {
  sm: "h-28 sm:h-32",
  md: "h-40 sm:h-48",
  lg: "h-52 sm:h-60",
};

function SponsorCarousel({ sponsors, speed = 4.5, size = "md" }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startAutoplay = () => {
    clearInterval(timerRef.current);
    if (sponsors.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % sponsors.length);
    }, Math.max(1, speed) * 1000);
  };

  useEffect(() => {
    setIndex(0);
    startAutoplay();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors.length, speed]);

  const goTo = (i) => {
    setIndex((i + sponsors.length) % sponsors.length);
    startAutoplay();
  };

  const heightClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

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

  const sponsor = sponsors[index];
  const hasImage = !!sponsor.image;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2" style={{ borderColor: "#EFEAFF" }}>
      <button
        type="button"
        onClick={() => sponsor.link && window.open(sponsor.link, "_blank", "noopener,noreferrer")}
        aria-label={`Visitar ${sponsor.name}`}
        className={`relative w-full ${heightClass} flex flex-col items-center justify-center px-6 text-center transition-colors duration-700 cursor-pointer overflow-hidden`}
        style={
          hasImage
            ? {}
            : { background: `linear-gradient(135deg, ${sponsor.color}18, #FFFFFF 75%)` }
        }
      >
        {hasImage && (
          <>
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55))" }}
            />
          </>
        )}
        <span
          className="relative text-[11px] tracking-[0.25em] uppercase mb-2 font-semibold px-3 py-1 rounded-full"
          style={
            hasImage
              ? { color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.2)" }
              : { color: sponsor.color, backgroundColor: `${sponsor.color}18` }
          }
        >
          Patrocinado
        </span>
        <h3
          className="relative text-2xl sm:text-3xl font-bold font-display"
          style={{ color: hasImage ? "#FFFFFF" : "#2B2650" }}
        >
          {sponsor.name}
        </h3>
        <p className="relative text-sm mt-1" style={{ color: hasImage ? "#F0ECFF" : "#7A759E" }}>
          {sponsor.tagline}
        </p>
        <span
          className="relative text-xs font-medium mt-2 underline decoration-dotted"
          style={{ color: hasImage ? "#FFFFFF" : sponsor.color }}
        >
          Visitar
        </span>
      </button>

      {sponsors.length > 1 && (
        <>
          <button
            aria-label="Patrocinador anterior"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-[#2B2650] backdrop-blur-sm transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Próximo patrocinador"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-[#2B2650] backdrop-blur-sm transition"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {sponsors.map((s, i) => (
              <span
                key={s.id}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === index ? "20px" : "6px", backgroundColor: i === index ? sponsor.color : "#E5E1F5" }}
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
      <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${item.color}1F` }}>
        {item.emoji}
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
            src={item.link}
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
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${item.color}1F` }}
          >
            {item.emoji}
          </div>
          <div>
            <p className="font-bold text-[#2B2650] font-display text-lg">{item.name}</p>
            {item.desc && <p className="text-sm text-[#7A759E] mt-1 max-w-xs">{item.desc}</p>}
          </div>

          {item.link ? (
            <button
              type="button"
              onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
              className="text-sm font-semibold px-6 py-3 rounded-xl text-white transition active:scale-[0.98]"
              style={{ backgroundColor: item.color }}
            >
              Abrir {item.name}
            </button>
          ) : (
            <p className="text-sm text-[#B6B0DA]">Esse item ainda não tem um link cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

const EMPTY_SPONSOR = { name: "", tagline: "", link: "", color: COLORS[0], image: "" };
const EMPTY_ENTRY = { name: "", desc: "", emoji: "✨", link: "", color: COLORS[0], embed: false };

function EntryForm({ kind, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const isSponsor = kind === "sponsors";
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
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
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full rounded-xl border-2 border-dashed py-2.5 text-xs font-medium text-[#7A759E] transition hover:border-[#D9D2F5]"
              style={{ borderColor: "#EFEAFF" }}
            >
              {form.image ? "Trocar imagem da galeria" : "Escolher imagem da galeria"}
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
        </>
      ) : (
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
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${item.color}1F` }}
            >
              {isSponsor ? "📣" : item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2B2650] truncate">{item.name}</p>
              <p className="text-xs text-[#B6B0DA] truncate">{item.link}</p>
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

  const TABS = [
    { id: "sponsors", label: "Patrocinadores" },
    { id: "games", label: "Jogos" },
    { id: "apps", label: "Apps Úteis" },
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
    </div>
  );
}

export default function LojaHome() {
  const [view, setView] = useState("home");
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [openItem, setOpenItem] = useState(null);

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
  }, []);

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
      className="min-h-screen w-full flex flex-col items-center px-4 py-8 sm:py-12"
      style={{ backgroundColor: "#FAF8FF", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
      `}</style>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#7C6FF0] font-semibold">Loja de Apps</p>
            <h1 className="text-2xl font-bold text-[#2B2650] font-display -mt-0.5">O que vamos abrir hoje?</h1>
          </div>
          <button
            aria-label="Painel do administrador"
            onClick={() => setView(view === "adm" ? "home" : "adm")}
            className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center text-[#7A759E] hover:text-[#2B2650] hover:border-[#D9D2F5] transition shrink-0"
            style={{ borderColor: "#EFEAFF" }}
          >
            <Settings size={18} />
          </button>
        </div>

        {view === "home" && (
          <div key="home">
            <SponsorCarousel sponsors={catalog.sponsors} speed={catalog.settings?.speed} size={catalog.settings?.size} />
            <div className="flex gap-3 mt-5">
              <CategoryButton icon={Gamepad2} label="Jogos" sublabel="Diversão rápida, no navegador" color="#FF6B4A" onClick={() => setView("jogos")} />
              <CategoryButton icon={Wrench} label="Apps Úteis" sublabel="Ferramentas do dia a dia" color="#2DD4A7" onClick={() => setView("apps")} />
            </div>
            <p className="text-center text-xs text-[#B6B0DA] mt-8">Novos apps chegam toda semana</p>
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
              sponsors={catalog.sponsors}
              carouselSettings={catalog.settings}
            />
          </div>
        )}

        {view === "adm" && (
          <div key="adm">
            <AdminPanel catalog={catalog} setCatalog={setCatalog} onBack={() => setView("home")} />
          </div>
        )}

        {saveState === "saving" && (
          <p className="text-center text-[11px] text-[#B6B0DA] mt-4">Salvando…</p>
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
