import { ArrowLeft, Search, Heart, Clock, Star, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { serviceCategories, ALL_SERVICES } from "@/data/services";
import { useFavourites } from "@/contexts/FavouritesContext";

const recentlyUsed = [
  { label: "Water", time: "2h ago" },
  { label: "Internet", time: "Yesterday" },
  { label: "Electricity", time: "2 days ago" },
];

const ServicesPage = () => {
  const [search, setSearch] = useState("");
  const { favouriteServices, toggleFavourite, isFavourite } = useFavourites();

  const recentItems = recentlyUsed
    .map((r) => {
      const svc = ALL_SERVICES.find((s) => s.label === r.label);
      return svc ? { ...svc, time: r.time } : null;
    })
    .filter(Boolean) as (typeof ALL_SERVICES[number] & { time: string })[];

  const filtered = search.trim()
    ? serviceCategories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter((cat) => cat.items.length > 0)
    : serviceCategories;

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors active:scale-95">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search all services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-card border border-input text-[13px] font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
        </div>
      </header>

      {/* Favourites & Recent */}
      <div className="px-5 mt-5 space-y-4 animate-slide-up">
        {/* Favourites */}
          <div className="surface-content overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 pt-4 pb-2.5">
            <Heart className="h-4 w-4 text-destructive" strokeWidth={2} fill="currentColor" />
            <h2 className="text-[13px] font-extrabold text-foreground tracking-tight">Favourites</h2>
            <span className="ml-auto text-[10px] font-semibold text-muted-foreground/80">Tap ★ to manage</span>
          </div>
          {favouriteServices.length > 0 ? (
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 px-4 pb-4">
              {favouriteServices.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="relative flex flex-col items-center gap-1.5 group">
                    <Link to={item.path} className="flex flex-col items-center gap-1.5">
                      <div className={`flex h-[48px] w-[48px] items-center justify-center rounded-2xl ${item.bg} transition-all duration-200 group-hover:shadow-card group-hover:scale-105 group-active:scale-[0.92]`}>
                        <Icon className={`h-5 w-5 ${item.color}`} strokeWidth={1.7} />
                      </div>
                      <span className="text-[10px] font-bold text-foreground/60 text-center leading-tight">{item.label}</span>
                    </Link>
                    <button
                      onClick={() => toggleFavourite(item.label)}
                      className="absolute -top-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border/60 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Star className="h-3 w-3 text-warning fill-warning" strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-4 text-xs font-semibold text-muted-foreground/80 px-4">
              Tap the ★ icon on any service below to add it here
            </p>
          )}
        </div>

        {/* Recently Used */}
        <div className="surface-content overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 pt-4 pb-2.5">
            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <h2 className="text-[13px] font-extrabold text-foreground tracking-tight">Recently Used</h2>
          </div>
          <div className="px-4 pb-3 space-y-0.5">
            {recentItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.path} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors group active:scale-[0.98]">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} transition-transform group-hover:scale-105`}>
                    <Icon className={`h-[18px] w-[18px] ${item.color}`} strokeWidth={1.7} />
                  </div>
                  <span className="flex-1 text-[12.5px] font-bold text-foreground">{item.label}</span>
                  <span className="text-[10.5px] font-semibold text-muted-foreground/80">{item.time}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 space-y-5 mt-4 animate-slide-up">
        {filtered.map((section, idx) => {
          const SectionIcon = section.sectionIcon;
          return (
            <div
              key={section.title}
              className="surface-content overflow-hidden"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/70">
                  <SectionIcon className={`h-[18px] w-[18px] ${section.sectionColor}`} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] font-extrabold text-foreground tracking-tight">{section.title}</h2>
                  <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">{section.subtitle}</p>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/80 bg-secondary/60 px-2 py-0.5 rounded-full">
                  {section.items.length}
                </span>
              </div>

              <div className="mx-5 h-px bg-border/40" />

              {/* Items grid */}
              <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-4 py-5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const fav = isFavourite(item.label);
                  return (
                    <div key={item.label} className="relative flex flex-col items-center gap-2 group">
                      <Link to={item.path} className="flex flex-col items-center gap-2">
                        <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${item.bg} transition-all duration-200 group-hover:shadow-card group-hover:scale-105 group-active:scale-[0.92]`}>
                          <Icon className={`h-[22px] w-[22px] ${item.color}`} strokeWidth={1.7} />
                        </div>
                        <span className="text-[10.5px] font-bold text-foreground/65 text-center leading-tight max-w-[68px]">{item.label}</span>
                      </Link>
                      <button
                        onClick={() => toggleFavourite(item.label)}
                        className="absolute -top-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border/60 shadow-sm hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-3 w-3 ${fav ? "text-warning fill-warning" : "text-muted-foreground/70"}`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default ServicesPage;
