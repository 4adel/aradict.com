import { verify } from "jsonwebtoken";

const isAuth = (req, res, next) => {
  verify(req.cookies?.token, process.env.JWT_SECRET, (err, data) => {
    console.log(err);
    if (err) return res.status(403).send("NOT_AUTH");
    req.user = data;
    return next();
  });
};

const isAdmin = [
  isAuth,
  (req, res, next) => {
    if (req.user.role != "admin") return res.status(403).send("NO_ADMIN");
    return next();
  },
];

const isVoiceContributer = [
  (req, res, next) => {
    if (req.user.role != "voice-contributer")
      return res.status(403).send("NO_VOIVE_CONTRIBUTER");
    return next();
  },
];
const isVoiceReviwer = [
  isAuth,
  (req, res, next) => {
    if (req.user.role != "voice-reviwer")
      return res.status(403).send("NOT_VOIVE_REVIWER");
    return next();
  },
];

export { isAdmin, isVoiceContributer, isVoiceReviwer };
