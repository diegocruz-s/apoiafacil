import { useEffect, useState } from "react";
import { useAppSelector } from "../store/store";
import { api } from "./api";

export const useAuth = () => {
  const { datasStorage } = useAppSelector(state => state.auth);
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    setLoading(true);

    if(datasStorage?.datas && datasStorage?.datas.user && datasStorage?.datas.token) {
      api.defaults.headers.authorization = `Bearer ${datasStorage?.datas.token}`; 
      setAuth(true);
    } else {
      setAuth(false);
    };

    setLoading(false);
  }, [datasStorage?.datas]);

  return { auth, loading };

};