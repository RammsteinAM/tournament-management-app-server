// import UnauthorizedError from "../../errors/UnauthorizedError";
// import { ErrorNames } from "../../types/errorNames";
// import { getTokenData } from "../../utils/jwtTokenUtils";

// const authorize = async (req: authRequest, _: Response, next: NextFunction): Promise<void> => {
//     const token = req.headers["auth-token"];

//     if (!token) {
//         throw new UnauthorizedError(ErrorNames.Unauthorized, "No Authorization Token Provided");
//     }

//     const decoded = getTokenData(`${token}`);
//     const data = await Admin.findOne({_id: decoded.id})
//     if (!data) {
//         throw new UnauthorizedError(ErrorNames.Unauthorized, "Unauthorized!");
//     }
//     req.adminData = data;
//     next();
// };