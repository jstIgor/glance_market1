import { UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/guards/jwt-auth.guard"

export const Auth = () => UseGuards(JwtAuthGuard)