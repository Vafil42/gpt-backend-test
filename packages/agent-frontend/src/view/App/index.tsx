import { observer } from "mobx-react-lite";
import { Divider, Flex, Typography } from "antd";
import "./style.css";
import Form from "./Form";
import { MainStore } from "../../store/main";
import { createContext } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import Chat from "./Chat";

export const MainContext = createContext<MainStore | null>(null);

export default observer(() => {
  const [cookies] = useCookies(["auth"]);
  const redirect = useNavigate();

  if (!cookies.auth) {
    redirect("/auth");
  }
  return (
    <MainContext.Provider value={new MainStore()}>
      <Flex align="center" vertical>
        <Typography.Title style={{ marginBottom: 0 }}>
          Prompt testing app
        </Typography.Title>
        <Divider />
        <Flex gap={80}>
          <Form />
          <Chat />
        </Flex>
      </Flex>
    </MainContext.Provider>
  );
});
