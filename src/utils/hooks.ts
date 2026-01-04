import { useState, useCallback } from "react";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  // Функция логина
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(data);
      sessionStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      return true;
    } else {
      alert(data.message);
      return false;
    }
  };

  /**
   * REGISTER
   */
  const register = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Вариант A: просто успешная регистрация
      return true;

      // 🔁 Вариант B (если хочешь сразу логинить):
      // await login(email, password);
      // return true;
    } else {
      alert(data.message);
      return false;
    }
  };

  // Функция обновления access token через refresh token
  const refreshAccessToken = useCallback(async () => {
    const res = await fetch("http://localhost:3000/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      setAccessToken(null);
      return null;
    }
  }, []);

  // Универсальная обёртка для fetch с автоматическим обновлением токена
  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit) => {
      const headers = new Headers(options.headers);

      // if (!options.headers) options.headers = {};

      // console.log(accessToken);
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      let res = await fetch(url, { ...options, headers });

      // Если 401 → access token истёк, пробуем обновить
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
          res = await fetch(url, { ...options, headers }); // повторяем запрос
        }
      }

      return res;
    },
    [accessToken, refreshAccessToken]
  );

  return { accessToken, login, refreshAccessToken, fetchWithAuth, register };
};
