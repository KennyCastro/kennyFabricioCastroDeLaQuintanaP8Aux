import { Router, Request, Response } from "express";
import handlebars from "express-handlebars";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("../../public/index.html");
});

export default router;
