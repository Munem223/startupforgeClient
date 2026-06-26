import { initials } from "../lib/format";

export default function Avatar({ user, size = "md" }) {
  if (user?.image) {
    return <img className={`avatar avatar-${size}`} src={user.image} alt={user.name || "User"} />;
  }
  return <span className={`avatar avatar-${size} avatar-fallback`}>{initials(user?.name)}</span>;
}
