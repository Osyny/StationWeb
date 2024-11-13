export class MenuItem {
  id!: number;
  parentId!: number;
  label: string;
  route: string;
  icon: string;
  permissionName: string;
  isActive?: boolean;
  isCollapsed: boolean = false;
  children?: MenuItem[];
  isChild?: boolean;

  constructor(
    label: string,
    route: string,
    icon: string,
    permissionName: string,
    children?: MenuItem[],
    isChild: boolean = false
  ) {
    this.label = label;
    this.route = route;
    this.icon = icon;
    this.permissionName = permissionName;
    this.children = children;
    this.isChild = isChild;
  }
}
