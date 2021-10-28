const authorization = (req, res, next) => {
  // console.log("checking authorization");
  const { token } = req.body;
  console.log({ token });
  if (!token || token !== process.env.SECRET_TOKEN) {
    return res.status(401).send("You are not authorized to do this action");
  }
  next();
};

module.exports = authorization;
