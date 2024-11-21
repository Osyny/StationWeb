import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

export class PrimengTableHelper {
  inited = false;
  getSortingFromLazyLoad(event?: TableLazyLoadEvent): string {
    if (!event?.sortField || !event?.sortOrder) {
      return '';
    }
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    return event.sortField + ' ' + sortOrder;
  }
  reloadPage(first: number, isFirstPage = false): number {
    if (isFirstPage && first != 0) {
      return 0;
    }
    return first;
  }

  isSkipLoading(totalCount: number): boolean {
    if (this.inited === true && totalCount) {
      this.inited = false;
      return true;
    }
    this.inited = !totalCount;
    return false;
  }
}
