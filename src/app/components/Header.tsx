import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <select className="bg-gray-800">
          <option>Choose City</option>
          <option value="">New York</option>
          <option value="">Tokyo</option>
          <option value="">Los Angeles</option>
        </select>
      </div>
      <div>
        {session ? (
          <button onClick={() => signOut} className="text-blue-500">
            Sign Out
          </button>
        ) : (
          <button onClick={() => signIn("google")}>Sign In</button>
        )}
      </div>
    </header>
  );
}
