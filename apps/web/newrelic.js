"use strict";

/**
 * New Relic agent configuration.
 *
 * https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration/
 *
 * See `lib/config/default.js` in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  browser_monitoring: {
    /**
     * Generate JavaScript headers for browser instrumentation. If set to true the agent does not
     * automatically inject the browser JS code unless you have manually enabled browser monitoring.
     *
     * Even if you have enabled it and added the browser timing header, you can disable browser monitoring
     * for your app by setting this to `false`.
     *
     * @env NEW_RELIC_BROWSER_MONITOR_ENABLE
     */
    enable: true,
  },
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     *
     * @env NEW_RELIC_LOG_LEVEL
     */
    level: "info",

    /**
     * Complete path to the New Relic agent log, including the filename.
     *
     * Defaults to filepath: require('path').join(process.cwd(), 'newrelic_agent.log').
     *
     * The agent will shut down the process if it cannot create this file.
     * The agent creates a log file with the same permissions as the parent Node.js agent process.
     *
     * @env NEW_RELIC_LOG
     */
    filepath: "stdout",
  },
};
