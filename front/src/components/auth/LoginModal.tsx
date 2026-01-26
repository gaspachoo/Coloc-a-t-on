import { useState } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/authContext";
import "./LoginModal.css";

type LoginMode = "login" | "signup";

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login, signup, isLoading, error } = useAuth();
  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      await login(email, password);
    } else {
      await signup(email, password, first_name, last_name);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="login-modal-overlay" onClick={closeLoginModal}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-modal-close"
          onClick={closeLoginModal}
          title="Fermer"
        >
          <X size={24} />
        </button>

        <div className="login-modal-header">
          <h2>
            {mode === "login" ? (
              <>
                <LogIn className="login-modal-icon" />
                Connexion
              </>
            ) : (
              <>
                <UserPlus className="login-modal-icon" />
                Inscription
              </>
            )}
          </h2>
          <p className="login-modal-subtitle">
            {mode === "login"
              ? "Connectez-vous à votre compte"
              : "Créez un nouveau compte"}
          </p>
        </div>

        {error && <div className="login-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-modal-form">
          {mode === "signup" && (
            <>
              <div className="login-form-group">
                <label htmlFor="first_name">Prénom</label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="Jean"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={mode === "signup"}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="last_name">Nom</label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Dupont"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required={mode === "signup"}
                />
              </div>
            </>
          )}

          <div className="login-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-modal-submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Chargement..."
              : mode === "login"
                ? "Se connecter"
                : "S'inscrire"}
          </button>
        </form>

        <div className="login-modal-footer">
          <p>
            {mode === "login" ? "Pas encore de compte ?" : "Vous avez un compte ?"}
          </p>
          <button
            type="button"
            className="login-modal-toggle"
            onClick={toggleMode}
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
