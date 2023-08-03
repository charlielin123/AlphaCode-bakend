import { Router, Request, Response } from "express";
import { UserModel} from '@/Models/UserModel';
const memberRouter = Router();

memberRouter.get("/", async (req: Request, res: Response) => {

  if(req.body.user){
    const user=await UserModel.findOne({ _id: req.body.user.id })
    res.send(user);
  }else{
    const users=await UserModel.find();
    // console.log(req);
    res.send(users);
  }
});

export default memberRouter;
