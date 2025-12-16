import { Search } from "lucide-react";

const TopSearchBar = () => {
  return (
    <div className="top-search">
      <div className="top-search-inner">
        <select className="top-search-select">
          <option>Nom</option>
          <option>Adresse</option>
        </select>

        <input
          className="top-search-input"
          placeholder="Rechercher une coloc..."
        />

        <button className="top-search-icon" title="Rechercher">
          <Search />
        </button>
      </div>
    </div>
  );
};

export default TopSearchBar;
