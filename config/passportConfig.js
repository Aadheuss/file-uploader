const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const strategy = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    if (user.password !== password) {
      return done(null, false, { message: "incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const serializeUser = (user, done) => {
  done(null, user.id);
};

const deserializeUserUser = async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = {
  strategy,
  serializeUser,
  deserializeUserUser,
};
