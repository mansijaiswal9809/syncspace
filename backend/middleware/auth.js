import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)
  if (!token) {
    return res.status(401).json({ error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized, token invalid" });
  }
};

export const authorized = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)
  if (!token) {
    return res.status(401).json({ error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ error: "Not authorized, Only admin can create project" });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized, token invalid" });
  }
};
