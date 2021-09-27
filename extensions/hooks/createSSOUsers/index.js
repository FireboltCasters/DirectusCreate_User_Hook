//const whitelistedDomains = ["..."];

const ROLE_ID = "fb9abf85-024b-4ea2-a088-a6183b267041";

module.exports = function registerHook({ services, database, getSchema }) {
  const { UsersService } = services;
  return {
    "oauth.*.login.before": async function (oauthProfile) {

      const { email } = oauthProfile.profile;
      const schema = await getSchema();
      const usersService = new UsersService({
        schema,
        knex: database
      });

      //const emailDomainIsWhitelisted = whitelistedDomains.some((d) =>
      //  email.includes(d)
      //);
      //if (!emailDomainIsWhitelisted) return;

      const existingUser = await database("directus_users")
        .where({ email })
        .first();
      if (existingUser) return;

      await usersService.createOne({
        email: email,
        role: ROLE_ID
      });
    }
  };
};
