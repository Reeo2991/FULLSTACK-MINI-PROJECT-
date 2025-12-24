import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  console.log("PROTECTED token:", localStorage.getItem("auth_token"));
  console.log("PROTECTED ROUTE isAuthed =", isAuthed()); 

  if (!isAuthed()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
