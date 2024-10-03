export class DataInput {
  rows: number | null | undefined = undefined;
  skip: number | undefined = 0;
  sorting: string = '';
  filterText: string = '';
  filterOwnerId?: number | undefined;
}
