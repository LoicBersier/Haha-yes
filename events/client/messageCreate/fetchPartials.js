export default {
  name: "messageCreate",
  async execute(message, _client) {
    if (message.partials) {
      await message.fetch();
    }
  },
};
