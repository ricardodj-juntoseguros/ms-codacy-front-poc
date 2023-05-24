import { SearchOptions } from 'junto-design-system';
import { ProjectDTO } from '../dto';

export interface ProjectSelectionModel {
  projectOptions: ProjectDTO[];
  projectOptionsMapped: SearchOptions[];
  projectOptionsLoading: boolean;
  projectSearchValue: string;
}
