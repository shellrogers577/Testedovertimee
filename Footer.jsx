import { useState } from "react";
import "./Footer.css";

const paymentMethods = [
  ["CashApp", "cashapp"],
  ["Apple Pay", "applepay"],
  ["Google Pay", "googlepay"],
  ["Visa", "visa"],
  ["Mastercard", "mastercard"],
  ["American Express", "americanexpress"],
  ["Discover", "discover"],
  ["JCB", "jcb"],
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter signup",
          email,
          message: "Please add me to the Tested Over Time mailing list.",
        }),
      });
      if (!response.ok) throw new Error("We couldn't save your signup. Please try again.");
      setEmail("");
      setStatus("Thank you for signing up.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer className="site-footer">
      <section className="footer-scam-alert" aria-labelledby="scam-alert-title">
        <h2 className="alert-script" id="scam-alert-title">Scam<br />Alert</h2>
        <div className="footer-alert-copy">
          <h3>Official Scam &amp; Impersonation Notice</h3>
          <p>
            We are proud to build Test Over Time. A brand rooted in faith,
            quality, authenticity, and trust. Unfortunately, fake social media
            accounts and impersonators sometimes try to deceive others by
            pretending to be the founder, including outreach about personal
            relationships or requests for money.
          </p>
          <p>
            <strong>Please note:</strong> I <em>never</em> contact customers or
            followers privately for dating or financial requests, and I{" "}
            <em>never</em> ask anyone for money outside of official purchases on
            this website. If someone claims otherwise, it is a scam. Always
            verify accounts by looking for our official links and handles.
            Thank you for supporting Tested Over Time.
          </p>
        </div>
      </section>

      <div className="footer-shop">
        <a className="footer-wordmark" href="#" aria-label="Tested Over Time home">
          TESTED OVER TIME
        </a>
        <nav aria-label="Footer navigation">
          <a href="#collections">Shop all</a>
        </nav>
      </div>

      <div className="footer-lower">
        <form className="newsletter" onSubmit={submit}>
          <label htmlFor="newsletter-email">Stay in the Loop</label>
          <div className="newsletter-field">
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={busy}>{busy ? "Sending…" : "Sign Up"}</button>
          </div>
          <p className="newsletter-privacy">
            This form is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
            {" "}and{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a>
            {" "}apply.
          </p>
          <p className="newsletter-status" aria-live="polite">{status}</p>
        </form>

        <div className="footer-payments" aria-label="Accepted payment methods">
          <div className="payment-icons">
            {paymentMethods.map(([name, icon]) => (
              <img
                key={icon}
                src={`https://www.testedovertime.net/static/icons/payment-methods/${icon}.svg`}
                alt={name}
                loading="lazy"
              />
            ))}
          </div>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
