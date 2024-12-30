export class PermissionDto {
  PermissionCategoryClaimDto?: PermissionCategoryClaimDto[];
}

export class PermissionCategoryClaimDto {
  Name?: string;
  Value?: number;
  Actions?: PermissionActionClaimDto[];
}

export class PermissionActionClaimDto {
  Name?: string;
  Value?: number;
}
