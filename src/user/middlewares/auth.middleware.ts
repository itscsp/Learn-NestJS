import { UserService } from '@/src/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '@/src/types/expressRequest.interface';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return;
    }

    const token = req.headers.authorization.split('')[1]; // [Token, asdfdsfsdfgsdfsadf]
    try {

      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.userService.findById(decode.id);
      req.user = user;
            console.log(decode);
      next();

    } catch (err) {
      console.log(err);
      req.user = null;
      next();
    }
  }
}
