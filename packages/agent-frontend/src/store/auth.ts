import { makeAutoObservable } from "mobx";
import { apiRequest } from "../common/apiRequest";

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  login!: string;
  password!: string;

  setLogin = (value: string) => (this.login = value);
  setPassword = (value: string) => (this.password = value);

  auth = async () => {
    const { ok, data } = await apiRequest({
      additionalUrl: "auth/login",
      method: "POST",
      body: {
        login: this.login,
        password: this.password,
      },
    });

    if (ok) return data;

    return null;
  };
}
