import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

// ── Context ──────────────────────────────────────────────────────────────────

const RouterContext = createContext(null);

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside <Router>");
  return ctx;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const getHash = () => window.location.hash.slice(1) || "/";

const normalizePath = (path) => {
  if (!path.startsWith("/")) path = "/" + path;
  return path;
};

// ── Main ─────────────────────────────────────────────────────────────────────

/**
 * Router — hash-based client-side router
 *
 * Usage (render-prop, backward-compatible):
 *   <Router>
 *     {({ currentPath, navigate, goBack, goForward, history }) => ...}
 *   </Router>
 *
 * Usage (context — preferred):
 *   const { currentPath, navigate } = useRouter();
 */
const Router = ({
  children,
  onNavigate,        // optional callback fired on every route change
  notFoundPath = "/",// fallback for unknown routes
  validPaths,        // optional whitelist of known paths
}) => {
  const [currentPath, setCurrentPath] = useState(getHash);
  const [history, setHistory] = useState([getHash()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const navigatingRef = useRef(false);

  // Sync from external hash changes (back/forward browser button, link clicks)
  useEffect(() => {
    const handleHashChange = () => {
      if (navigatingRef.current) { navigatingRef.current = false; return; }
      const path = getHash();
      setCurrentPath(path);
      setHistory(prev => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, path];
      });
      setHistoryIndex(i => i + 1);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [historyIndex]);

  const navigate = useCallback((path, { replace = false } = {}) => {
    path = normalizePath(path);

    // Guard against invalid paths if whitelist provided
    if (validPaths && !validPaths.includes(path)) {
      console.warn(`[Router] Unknown path "${path}", redirecting to "${notFoundPath}"`);
      path = notFoundPath;
    }

    // No-op if already on the same path
    if (path === currentPath) return;

    navigatingRef.current = true;
    window.location.hash = path;
    setCurrentPath(path);
    onNavigate?.(path);

    if (replace) {
      setHistory(prev => {
        const next = [...prev];
        next[historyIndex] = path;
        return next;
      });
    } else {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), path]);
      setHistoryIndex(i => i + 1);
    }
  }, [currentPath, historyIndex, validPaths, notFoundPath, onNavigate]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setHistoryIndex(i => i - 1);
      navigatingRef.current = true;
      window.location.hash = target;
      setCurrentPath(target);
      onNavigate?.(target);
    }
  }, [history, historyIndex, onNavigate]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setHistoryIndex(i => i + 1);
      navigatingRef.current = true;
      window.location.hash = target;
      setCurrentPath(target);
      onNavigate?.(target);
    }
  }, [history, historyIndex, onNavigate]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const value = {
    currentPath,
    navigate,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    history,
    historyIndex,
  };

  return (
    <RouterContext.Provider value={value}>
      {typeof children === "function"
        ? children(value)   // render-prop (backward-compatible)
        : children          // JSX children (context usage)
      }
    </RouterContext.Provider>
  );
};

// ── <Route> component ────────────────────────────────────────────────────────

/**
 * Renders children only when currentPath matches.
 *
 * <Route path="/dashboard">
 *   <Dashboard />
 * </Route>
 */
export const Route = ({ path, children, exact = true }) => {
  const { currentPath } = useRouter();
  const matches = exact ? currentPath === path : currentPath.startsWith(path);
  return matches ? children : null;
};

// ── <Link> component ─────────────────────────────────────────────────────────

/**
 * <Link to="/orders" className="..." activeClassName="active">Orders</Link>
 */
export const Link = ({ to, children, className = "", activeClassName = "", onClick, ...rest }) => {
  const { currentPath, navigate } = useRouter();
  const isActive = currentPath === normalizePath(to);

  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      href={`#${normalizePath(to)}`}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};

// ── <Redirect> component ─────────────────────────────────────────────────────

/**
 * Immediately redirects to another path when rendered.
 * <Redirect to="/dashboard" />
 */
export const Redirect = ({ to }) => {
  const { navigate } = useRouter();
  useEffect(() => { navigate(to, { replace: true }); }, []);
  return null;
};

export default Router;