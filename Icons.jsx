const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2z" /></>,
  bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  left: <><path d="m15 18-6-6 6-6" /><path d="M20 12H9" /></>,
  right: <><path d="m9 18 6-6-6-6" /><path d="M4 12h11" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  minus: <path d="M5 12h14" />,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
};

export default function Icon({ name, ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
