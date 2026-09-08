import { IsOptional } from 'class-validator';

// Même motif que RegisterRequestDto (voir son commentaire pour la raison) :
// volontairement permissif au niveau du pipe global, pour que LoginService
// produise lui-même le contrat exact { status: 'VALIDATION_ERROR',
// fieldErrors } — et surtout { status: 'INVALID_CREDENTIALS' }, jamais le
// format générique de Nest.
export class LoginRequestDto {
  @IsOptional()
  username?: unknown;

  @IsOptional()
  password?: unknown;
}
