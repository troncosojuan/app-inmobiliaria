"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle, X, Send, Bot, User, Loader2,
  MapPin, BedDouble, Bath, Maximize2, Sparkles,
} from "lucide-react";
import { formatPrice } from "@app-inmobiliaria/types";

interface ChatProperty {
  id: string;
  title: string;
  slug: string;
  type: string;
  operation: string;
  price: number;
  currency: string;
  city: string;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  totalArea: number | null;
  image?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: ChatProperty[];
  timestamp: Date;
}

interface ChatWidgetProps {
  tenantName: string;
  primaryColor: string;
}

const SUGGESTIONS = [
  "Departamentos en venta",
  "Casas con 3 dormitorios",
  "Alquiler hasta $200.000",
  "¿Qué propiedades tienen?",
];

export function ChatWidget({ tenantName, primaryColor }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0 && !hasInteracted) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: `¡Hola! Soy el asistente de **${tenantName}**. Contame qué tipo de propiedad estás buscando y te ayudo a encontrarla.`,
        timestamp: new Date(),
      }]);
      setHasInteracted(true);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages.length, hasInteracted, tenantName]);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.message,
        properties: data.properties,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Disculpá, hubo un error. Intentá de nuevo en unos segundos.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-4 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:right-6"
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Asistente {tenantName}</h3>
                <p className="text-xs text-white/70">Buscador inteligente de propiedades</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Cerrar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                    style={msg.role === "assistant" ? { backgroundColor: `${primaryColor}20`, color: primaryColor } : {}}
                  >
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <MessageContent content={msg.content} />
                    </div>

                    {msg.properties && msg.properties.length > 0 && (
                      <div className="space-y-2">
                        {msg.properties.map((prop) => (
                          <PropertyCard key={prop.id} property={prop} primaryColor={primaryColor} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEnd} />
            </div>

            {messages.length <= 1 && !loading && (
              <div className="border-t px-4 py-3">
                <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Sugerencias</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="border-t p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ej: Busco un depto de 2 ambientes..."
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 rounded-xl border-0 bg-muted px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Enviar"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-shadow hover:shadow-xl sm:right-6"
        style={{ backgroundColor: primaryColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <m.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </m.div>
          ) : (
            <m.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-6 w-6" />
            </m.div>
          )}
        </AnimatePresence>
      </m.button>
    </>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) return <strong key={`b-${i}-${boldMatch[1]}`}>{boldMatch[1]}</strong>;

        const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/);
        if (linkMatch) {
          return (
            <Link key={`l-${i}-${linkMatch[2]}`} href={linkMatch[2]} className="underline font-medium hover:opacity-80">
              {linkMatch[1]}
            </Link>
          );
        }

        return <span key={`t-${i}`}>{part}</span>;
      })}
    </>
  );
}

function PropertyCard({ property, primaryColor }: { property: ChatProperty; primaryColor: string }) {
  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className="flex gap-3 rounded-xl border bg-card p-2.5 transition-all hover:shadow-md"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        {property.image ? (
          <Image src={property.image} alt={property.title} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Maximize2 className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-semibold text-foreground line-clamp-1">{property.title}</h4>
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{property.neighborhood || property.city}</span>
        </div>
        <div className="mt-1 text-sm font-bold" style={{ color: primaryColor }}>
          {formatPrice(property.price, property.currency)}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          {property.bedrooms && (
            <span className="flex items-center gap-0.5"><BedDouble className="h-3 w-3" />{property.bedrooms}</span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-0.5"><Bath className="h-3 w-3" />{property.bathrooms}</span>
          )}
          {property.totalArea && (
            <span className="flex items-center gap-0.5"><Maximize2 className="h-3 w-3" />{property.totalArea}m²</span>
          )}
        </div>
      </div>
    </Link>
  );
}
