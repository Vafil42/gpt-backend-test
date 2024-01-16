import { makeAutoObservable } from "mobx";

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  login!: string;
  password!: string;

  setLogin = (value: string) => (this.login = value);
  setPassword = (value: string) => (this.password = value);

  auth = async () => {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: this.login,
        password: this.password,
      }),
    });

    if (res.ok) {
      const auth = await res.json();
      return auth;
    }

    return null;
  };
}
