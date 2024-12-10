import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (Component, roles = []) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Avoid redirect while session is loading
      if (
        !session ||
        (roles.length > 0 && !roles.includes(session.user.role.name))
      ) {
        router.push("/login");
      }
    }, [session, status]);

    if (
      status === "loading" ||
      !session ||
      (roles.length > 0 && !roles.includes(session.user.role.name))
    ) {
      return <p className="text-black">Loading...</p>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
