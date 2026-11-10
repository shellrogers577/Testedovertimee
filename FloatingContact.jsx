import Icon from "./Icons";
import "./FloatingContact.css";

export default function FloatingContact() {
  return (
    <div className="floating-contact" aria-label="Contact us">
      <a className="floating-whatsapp" href="https://wa.me/13032574241" target="_blank" rel="noreferrer" aria-label="Message us on WhatsApp">
        <Icon name="message" /><span>WhatsApp</span>
      </a>
      <a className="floating-text" href="sms:+13032574241" aria-label="Text us at +1 303 257 4241">
        <Icon name="message" /><span>Text us</span>
      </a>
    </div>
  );
}
