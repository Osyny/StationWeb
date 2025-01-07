export class PermissionDto {
  PermissionCategoryClaimDto?: PermissionCategoryClaims[];
}

export class PermissionCategoryClaims {
  Name?: string;
  Value?: number;
  Actions?: PermissionActionClaim[];
}

export class PermissionActionClaim {
  Name?: string;
  Value?: number;
}
