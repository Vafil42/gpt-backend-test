import { Button, Flex, Input, InputNumber, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useEffect, useState } from "react";
import { MainContext } from "..";
import { useAuth } from "../../../hooks/useAuth";
import { useCookies } from "react-cookie";

export default observer(() => {
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const { loadAgent, editAgent, data, setPrompt, setPromptTempature } =
    useContext(MainContext)!.agentStore;

  const [, , removeCookies] = useCookies(["auth"]);

  const auth = useAuth();

  const handleLoad = useCallback(async () => {
    const ok = await loadAgent(auth.token);

    if (!ok) {
      removeCookies("auth");
    }
  }, [loadAgent, auth, removeCookies]);

  useEffect(() => void handleLoad(), [handleLoad]);

  const handleSubmit = useCallback(async () => {
    setLoadingButton(true);
    await editAgent(auth.token);
    await loadAgent(auth.token);
    setLoadingButton(false);
  }, [editAgent, auth]);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  if (loading) return <Spin size="large" />;

  return (
    <Flex align="center" vertical gap={16} flex="1">
      <Input.TextArea
        size="large"
        autoSize={{ minRows: 16, maxRows: 16 }}
        value={data!.prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: 600 }}
        placeholder="Enter prompt"
      />
      <InputNumber
        size="large"
        min={0}
        max={2}
        step={0.1}
        value={data!.promptTempature}
        onChange={(value) => {
          setPromptTempature(value!);
          return value;
        }}
        style={{ width: 600 }}
        placeholder="Enter prompt tempature"
      />
      <Button
        size="large"
        type="primary"
        onClick={handleSubmit}
        block
        loading={loadingButton}
      >
        Save
      </Button>
    </Flex>
  );
});
