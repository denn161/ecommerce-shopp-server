import { PartialType } from '@nestjs/swagger';
import { CreateBoilerPartDto } from './create-boiler-part.dto';

export class UpdateBoilerPartDto extends PartialType(CreateBoilerPartDto) {}
