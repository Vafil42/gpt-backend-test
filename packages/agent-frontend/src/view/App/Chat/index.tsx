import { Button, Card, Flex, Input, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { SendOutlined } from "@ant-design/icons";
import { MainContext } from "..";
import { useCallback, useContext, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default observer(() => {
  const { data, addMessage, clear } = useContext(MainContext)!.dialogStore;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const auth = useAuth();

  const handleSubmit = useCallback(
    async (message: string) => {
      setMessage("");
      setLoading(true);
      await addMessage(message, auth.token);
      setLoading(false);
    },
    [addMessage, auth],
  );

  const handleClear = useCallback(async () => {
    setLoading(true);
    await clear(auth.token);
    setLoading(false);
  }, [clear, auth]);

  return (
    <Flex vertical style={{ width: 600 }}>
      <Card
        style={{ width: "100%" }}
        title={
          <Flex justify="space-between" align="center">
            <Typography.Title level={4} style={{ margin: 0 }}>
              Test dialog
            </Typography.Title>
            <Button type="text" size="small" onClick={handleClear}>
              clear
            </Button>
          </Flex>
        }
        bodyStyle={{ overflow: "auto", height: 450 }}
      >
        <Flex vertical>
          {data.messages.map((message, index) => (
            <Flex
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: 300,
              }}
              key={index}
            >
              <Typography.Text>{message.content}</Typography.Text>
            </Flex>
          ))}
        </Flex>
      </Card>
      <Flex style={{ marginTop: "auto" }}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          suffix={
            <Button
              type="text"
              loading={loading}
              onClick={() => handleSubmit(message)}
            >
              <SendOutlined />
            </Button>
          }
          style={{ position: "relative", top: -30 }}
          placeholder="Start typing..."
          onPressEnter={() => handleSubmit(message)}
        />
      </Flex>
    </Flex>
  );
});
