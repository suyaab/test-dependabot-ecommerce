import { app, HttpResponseInit } from "@azure/functions";

export function healthCheck(): HttpResponseInit {
  return {
    status: 200,
  };
}

app.http("health-check", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: healthCheck,
});
