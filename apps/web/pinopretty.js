module.exports = {
  colorize: true,
  colorizeObjects: true, //--colorizeObjects
  messageKey: "msg", // --messageKey
  levelKey: "level", // --levelKey
  timestampKey: "time", // --timestampKey
  translateTime: "SYS:hh:mm:ss", // --translateTime
  ignore: "pid,hostname,severity,prefix,correlationId", // --ignore
  messageFormat: "{if prefix}[{prefix}] {end}{msg}",
  customPrettifiers: {
    // Add emoji before line starts
    time: (timestamp) => `🇺🇸 ${timestamp}`,
  },
};
