import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export var security = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //verificamos la existencia del token ...se utiloiza el header
  var token: string = request.headers["authorization"];
  if (!token) {
    response.status(300).json({ serverResponse: "No tiene el acceso" });
    return;
  }
  try {
    const payload = jsonwebtoken.verify(token, "secret");
    if (payload) {
      console.log(payload);
      return next();
    }
    return response.json({ serverResponse: "Token invalido" });
  } catch (err) {
    return response.json({
      serverResponse: "Error, el token posiblemnte haya expirado",
      err,
    });
  }
};

//export default security;

/*




jsonwebtoken.verify(token, "secret", (err, success: any) => {
    if (err) {
      response
        .status(300)
        .json({ serverResponse: "Token no valido" + err.message });
      return;
    }
    var id = success.id;
  });*/
