import { SearchOptions } from 'junto-design-system';

export interface ProjectSelectionModel {
  projectOptions: SearchOptions[];
  projectOptionsFiltered: SearchOptions[];
  projectOptionsLoading: boolean;
  projectSearchValue: string;
}
