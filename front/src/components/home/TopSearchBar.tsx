import { useState } from "react";
import { Search } from "lucide-react";
import { useUi } from "../../context/uiContext";
import type { SearchField } from "../../types/filters";

const TopSearchBar = () => {
  const { filters, setFilters } = useUi();
  const [field, setField] = useState<SearchField>(filters.searchField);
  const [query, setQuery] = useState(filters.query);

  const applySearch = () => {
    setFilters({ ...filters, searchField: field, query });
  };

  return (
    <div className="top-search">
      <div className="top-search-inner">
        <select
          className="top-search-select"
          value={field}
          onChange={(e) => setField(e.target.value as SearchField)}
        >
          <option value="name">Nom</option>
          <option value="address">Adresse</option>
        </select>

        <input
          className="top-search-input"
          placeholder="Rechercher une coloc..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applySearch();
          }}
        />

        <button className="top-search-icon" title="Rechercher" onClick={applySearch}>
          <Search />
        </button>
      </div>
    </div>
  );
};

export default TopSearchBar;
