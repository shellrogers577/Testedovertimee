import { useState } from "react";
import Icon from "./Icons";
import "./AccountPanel.css";

const localAccountsKey = "tested-over-time-local-accounts";
const localOnlyKey = "tested-over-time-local-only";

function bytesToBase64(bytes) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure browser account storage requires HTTPS or localhost.");
  }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(bits);
}

function getLocalAccounts() {
  const stored = localStorage.getItem(localAccountsKey);
  if (!stored) return [];
  try {
    const accounts = JSON.parse(stored);
    if (!Array.isArray(accounts)) throw new Error("Saved account data is not a list.");
    return accounts;
  } catch {
    throw new Error("Saved account data could not be read. Clear this site's saved data and try again.");
  }
}

async function createLocalAccount(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getLocalAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("An account with this email already exists in this browser. Try signing in instead.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const id = `local-${crypto.randomUUID()}`;
  const user = { id, name: name.trim(), email: normalizedEmail, role: "CUSTOMER" };
  accounts.push({
    ...user,
    salt: bytesToBase64(salt),
    passwordHash: bytesToBase64(await hashPassword(password, salt)),
  });
  localStorage.setItem(localAccountsKey, JSON.stringify(accounts));
  return { token: `local-${crypto.randomUUID()}`, user };
}

async function signInLocalAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = getLocalAccounts().find((saved) => saved.email === normalizedEmail);
  if (!account) throw new Error("No browser account was found for this email. Create an account first.");

  const actual = await hashPassword(password, base64ToBytes(account.salt));
  const expected = base64ToBytes(account.passwordHash);
  let difference = actual.length ^ expected.length;
  for (let index = 0; index < Math.min(actual.length, expected.length); index += 1) {
    difference |= actual[index] ^ expected[index];
  }
  if (difference !== 0) throw new Error("Email or password is incorrect.");
  return {
    token: `local-${crypto.randomUUID()}`,
    user: { id: account.id, name: account.name, email: account.email, role: "CUSTOMER" },
  };
}

function getSavedUser() {
  try {
    const saved = sessionStorage.getItem("tested-over-time-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    sessionStorage.removeItem("tested-over-time-user");
    sessionStorage.removeItem("tested-over-time-token");
    return null;
  }
}

export default function AccountPanel({ onClose }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState(getSavedUser);
  const [localOnly, setLocalOnly] = useState(() => sessionStorage.getItem(localOnlyKey) === "true");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      let payload;
      let usingLocalAccount = false;
      let response = null;
      try {
        response = await fetch(`/api/v1/auth/${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...(mode === "signup" ? { name } : {}), email, password }),
        });
      } catch {
        usingLocalAccount = true;
      }

      const contentType = response?.headers.get("content-type") ?? "";
      if (usingLocalAccount || !response || !contentType.includes("application/json")) {
        payload = mode === "signup"
          ? await createLocalAccount(name, email, password)
          : await signInLocalAccount(email, password);
        usingLocalAccount = true;
      } else {
        payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Unable to complete your request.");
      }

      sessionStorage.setItem("tested-over-time-token", payload.token);
      sessionStorage.setItem("tested-over-time-user", JSON.stringify(payload.user));
      if (usingLocalAccount) sessionStorage.setItem(localOnlyKey, "true");
      else sessionStorage.removeItem(localOnlyKey);
      setAccount(payload.user);
      setLocalOnly(usingLocalAccount);
      setMessage(
        usingLocalAccount
          ? mode === "signup"
            ? "Account created on this browser. It won't sync to other devices."
            : "Signed in on this browser. This account does not sync to other devices."
          : mode === "signup" ? "Your account is ready." : "Welcome back.",
      );
      setPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setMessage(
        message === "Failed to fetch" || message.includes("NetworkError")
          ? "Can't reach the account service. Start the API and configure PostgreSQL, then try again."
          : message || "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    sessionStorage.removeItem("tested-over-time-token");
    sessionStorage.removeItem("tested-over-time-user");
    setAccount(null);
    setMessage("You’ve signed out.");
  }

  return (
    <div className="overlay-backdrop account-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="account-panel" role="dialog" aria-modal="true" aria-label="Customer account">
        <button className="account-close" onClick={onClose} aria-label="Close account panel"><Icon name="close" /></button>
        <p className="account-kicker">TESTED OVER TIME</p>
        {account ? (
          <div className="account-welcome">
            <h2>Welcome, {account.name}.</h2><p>You’re signed in as {account.email}.</p>
            {localOnly && <p className="account-local-note">This account is saved only in this browser and won’t sync across devices.</p>}
            <button className="account-submit" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <>
            <h2>{mode === "login" ? "Welcome back." : "Join our community."}</h2>
            <p className="account-intro">{mode === "login" ? "Sign in to your account." : "Create an account to stay connected."}</p>
            {localOnly && <p className="account-local-note">You’re using a browser-only account. It won’t sync to other devices.</p>}
            <form onSubmit={submit}>
              {mode === "signup" && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} /></label>}
              <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>Password<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === "signup" ? 10 : 1} required /></label>
              <button className="account-submit" disabled={busy}>{busy ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}</button>
            </form>
            <button className="account-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>
              {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </>
        )}
        <p className="account-message" aria-live="polite">{message}</p>
      </section>
    </div>
  );
}
