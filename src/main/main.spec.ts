import { agentApiTest } from "src/agent-api/agent-api.test";
import { agentTest } from "src/agent/agent.test";
import { refreshTest } from "src/token/refresh.test";
import { tokenTest } from "src/token/token.test";

agentTest();
refreshTest();
tokenTest();
agentApiTest();
