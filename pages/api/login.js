import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { createRouter } from "next-connect";
import * as Yup from "yup";
import { isAdmin } from "../../utils/Auth";

const Router = createRouter();

Router.use(async (req, res, next) => {
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required().min(8),
  });
  LoginSchema.validate(req.body, { abortEarly: false })
    .then(() => next())
    .catch((errors) => res.status(403).json(errors));
});

Router.post((req, res) => {
  const JWT_HASH = sign(
    { sss: 5555555, role: "voice-contributer" },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  res.setHeader(
    "Set-Cookie",
    serialize("token", JWT_HASH, { httpOnly: true, path: "/" })
  );
  return res.status(200).send("5345");
});

Router.use(...isAdmin).get((req, res) => {
  res.send("Dddddddddd");
});

export default Router.handler({
  onNoMatch: (req, res, next) => {
    return res.status(404).send("sssssssss");
  },
  onError: (req, res, next) => {
    return res.status(500).send("sssssssss");
  },
});
