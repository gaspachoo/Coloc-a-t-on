import { useState } from "react";
import { useUi } from "../../context/uiContext";
import type { Filters } from "../../types/filters";
import { DEFAULT_FILTERS } from "../../types/filters";


const SidebarFilters = () => {
  const { filters, setFilters } = useUi();
  const [draft, setDraft] = useState<Filters>(filters);

  const toNumberOrNull = (v: string) => {
    const trimmed = v.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <div>
      <h2>Filtres</h2>

      <section className="filter-block">
        <h3>Prix (€/mois)</h3>
        <div className="filter-row">
          <input
            placeholder="Min"
            inputMode="numeric"
            value={draft.priceMin ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, priceMin: toNumberOrNull(e.target.value) })
            }
          />
          <input
            placeholder="Max"
            inputMode="numeric"
            value={draft.priceMax ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, priceMax: toNumberOrNull(e.target.value) })
            }
          />
        </div>
      </section>

      <section className="filter-block">
        <h3>Surface (m²)</h3>
        <div className="filter-row">
          <input
            placeholder="Min"
            inputMode="numeric"
            value={draft.areaMin ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, areaMin: toNumberOrNull(e.target.value) })
            }
          />
          <input
            placeholder="Max"
            inputMode="numeric"
            value={draft.areaMax ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, areaMax: toNumberOrNull(e.target.value) })
            }
          />
        </div>
      </section>

      <section className="filter-block">
        <h3>Nombre de chambres</h3>

        <div className="filter-badges">
          {[2, 3, 4, 5].map((n) => {
            const isSelected = draft.rooms.includes(n);

            return (
              <button
                key={n}
                type="button"
                className={`filter-chip ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  const nextRooms = isSelected
                    ? draft.rooms.filter((x) => x !== n)
                    : [...draft.rooms, n].sort((a, b) => a - b);

                  setDraft({ ...draft, rooms: nextRooms });
                }}
                aria-pressed={isSelected}
              >
                {n}
              </button>
            );
          })}

          {/* Bouton 6+ */}
          <button
            type="button"
            className={`filter-chip ${draft.rooms6Plus ? "is-selected" : ""}`}
            onClick={() => setDraft({ ...draft, rooms6Plus: !draft.rooms6Plus })}
            aria-pressed={draft.rooms6Plus}
          >
            6+
          </button>
        </div>

        <p className="filter-hint">Sélection multiple possible</p>
      </section>


      <section className="filter-block">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={draft.ateufOnly}
            onChange={(e) => setDraft({ ...draft, ateufOnly: e.target.checked })}
          />
          <span>Coloc A-t&apos;euf</span>
        </label>
      </section>

      <button
        type="button"
        className="filter-reset-btn"
        onClick={() => {
          // reset uniquement des filtres du panneau (on garde la recherche topbar)
          const resetDraft = {
            ...draft,
            priceMin: DEFAULT_FILTERS.priceMin,
            priceMax: DEFAULT_FILTERS.priceMax,
            areaMin: DEFAULT_FILTERS.areaMin,
            areaMax: DEFAULT_FILTERS.areaMax,
            rooms: DEFAULT_FILTERS.rooms,
            rooms6Plus: DEFAULT_FILTERS.rooms6Plus,
            ateufOnly: DEFAULT_FILTERS.ateufOnly,
          };

          setDraft(resetDraft);
          setFilters(resetDraft); // applique immédiatement
        }}
      >
        Réinitialiser les filtres
      </button>

      <button
        type="button"
        className="filter-submit-btn"
        onClick={() => setFilters(draft)}  
      >
        Rechercher
      </button>
    </div>
  );
};

export default SidebarFilters;
