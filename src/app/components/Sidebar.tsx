export default function Sidebar() {
  return (
    <nav className="bg-black text-neon-green w-64 min-h-screen my-48 p-6 shadow-lg border-r border-neon-blue">
      <ul className="space-y-4">
        <li className="hover:text-neon-blue transition">
          <a href="#">Dashboard</a>
        </li>
        <li className="hover:text-neon-blue transition">
          <a href="#">Weather</a>
        </li>
        <li className="hover:text-neon-blue transition">
          <a href="#">Traffic</a>
        </li>
        <li className="hover:text-neon-blue transition">
          <a href="#">Air Quality</a>
        </li>
      </ul>
    </nav>
  );
}
