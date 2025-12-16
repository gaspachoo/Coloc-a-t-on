const SidebarFilters = () => {
  return (
    <div>
      <h2>Filtres</h2>

      <section className="filter-block">
        <h3>Prix</h3>
        <div className="filter-row">
          <input placeholder="Min" />
          <input placeholder="Max" />
        </div>
      </section>

      <section className="filter-block">
        <h3>Surface</h3>
        <div className="filter-row">
          <input placeholder="Min" />
          <input placeholder="Max" />
        </div>
      </section>

      <section className="filter-block">
        <h3>Nombre de chambres</h3>
        <div className="filter-badges">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5+</button>
        </div>
      </section>

      <section className="filter-block">
        <label className="filter-checkbox">
          <input type="checkbox" />
          <span>Coloc A-t&apos;euf</span>
        </label>
      </section>

      <button type="button" className="filter-submit-btn">
        Rechercher
      </button>
    </div>
  );
};

export default SidebarFilters;
