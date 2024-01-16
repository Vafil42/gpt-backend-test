import { Alert, Button, Flex, Input } from "antd";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { AuthStore } from "../../store/auth";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default observer(() => {
  const [error, setError] = useState<string | null>(null);

  const authStore = useMemo(() => new AuthStore(), []);
  const [, setCookies] = useCookies(["auth"]);

  const redirect = useNavigate();

  const handleSubmit = async () => {
    const auth = await authStore.auth();

    if (auth) {
      setCookies("auth", auth);
      redirect("/");
      return;
    }

    setError("Invalid username or password");
  };

  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <Flex gap={16} vertical>
        <Input
          placeholder="Login"
          value={authStore.login}
          onChange={(e) => authStore.setLogin(e.target.value)}
          size="large"
        />
        <Input
          placeholder="Password"
          type="password"
          value={authStore.password}
          onChange={(e) => authStore.setPassword(e.target.value)}
          size="large"
        />
        <Button type="primary" onClick={handleSubmit} size="large">
          Login
        </Button>
        {error && <Alert type="error" message={error} />}
      </Flex>
    </Flex>
  );
});
