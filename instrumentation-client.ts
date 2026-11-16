import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/register",
      method: "POST",
    },
    {
      path: "/api/participant/manage",
      method: "POST",
    },
  ],
});
