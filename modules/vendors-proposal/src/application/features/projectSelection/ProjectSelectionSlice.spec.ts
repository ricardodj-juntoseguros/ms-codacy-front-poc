/* eslint-disable prefer-promise-reject-errors */
import { configureStore } from '@reduxjs/toolkit';
import ProjectSelectionAPI from './ProjectSelectionAPI';
import ProjectSelectionSlice, {
  fetchProjects,
  projectSelectionActions,
} from './ProjectSelectionSlice';

describe('ProjectSelectionSlice', () => {
  let getProjectsMock = jest
    .spyOn(ProjectSelectionAPI, 'getProjects')
    .mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          name: 'Lorem',
        },
      ]),
    );
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projectSelection: ProjectSelectionSlice,
      },
    });
  });

  afterEach(() => {
    store = null;
  });

  it('should set the project search value correctly', async () => {
    await store.dispatch(
      projectSelectionActions.setProjectSearchValue('Lorem'),
    );
    const { projectSelection } = store.getState();

    expect(projectSelection.projectSearchValue).toEqual('Lorem');
  });

  it('should set the project search value correctly', async () => {
    await store.dispatch(fetchProjects('Lorem'));
    const { projectSelection } = store.getState();

    expect(getProjectsMock).toHaveBeenCalledWith('Lorem');
    expect(projectSelection.projectOptionsLoading).toEqual(false);
    expect(projectSelection.projectOptions).toMatchObject([
      {
        id: 1,
        name: 'Lorem',
      },
    ]);
    expect(projectSelection.projectOptionsMapped).toMatchObject([
      {
        id: 1,
        name: 'Lorem',
        label: 'Lorem',
        value: '1',
      },
    ]);
  });

  it('should set the project search value correctly', async () => {
    getProjectsMock = jest
      .spyOn(ProjectSelectionAPI, 'getProjects')
      .mockImplementation(() =>
        Promise.reject({
          data: {
            data: {
              message: 'Error',
            },
          },
        }),
      );

    await store.dispatch(fetchProjects('Lorem'));
    const { projectSelection } = store.getState();

    expect(getProjectsMock).toHaveBeenCalledWith('Lorem');
    expect(projectSelection.projectOptionsLoading).toEqual(false);
    expect(projectSelection.projectOptions).toMatchObject([]);
    expect(projectSelection.projectOptionsMapped).toMatchObject([]);
  });
});
