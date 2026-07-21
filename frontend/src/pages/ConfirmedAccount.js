import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useConfirmAccount } from "../hooks/useConfirmAccount";
import { useLogout } from "../hooks/useLogout";

export default function ConfirmedAccount() {
  const { accountConfirmationToken } = useParams();
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const confirmAndLogout = async () => {
      await confirmAccount(accountConfirmationToken);
      await logout();
    };

    confirmAndLogout();
    const delayRedirect = setTimeout(() => {
      setRedirect(true);
    }, 300);

    return () => clearTimeout(delayRedirect);

  }, [confirmAccount, logout, accountConfirmationToken]);

  return (
    <div className="confirmed--container">
      {redirect && <Navigate to="/login" />}
    </div>
  );
}
