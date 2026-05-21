import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const user = location.state;

  return (
    <div className="card shadow-lg border-0 p-5 text-center">
      <h1>
        Welcome {user?.firstName} {user?.lastName}
      </h1>
    </div>
  );
}