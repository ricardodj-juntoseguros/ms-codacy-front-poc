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
          id: '1',
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

  it('should leave the list of projects empty if an empty string is sent', async () => {
    await store.dispatch(projectSelectionActions.setProjectSearchValue(''));
    const { projectSelection } = store.getState();

    expect(projectSelection.projectSearchValue).toEqual('');
    expect(projectSelection.projectOptions).toMatchObject([]);
    expect(projectSelection.projectOptionsFiltered).toMatchObject([]);
  });

  it('should set the project list correctly', async () => {
    await store.dispatch(fetchProjects(''));
    const { projectSelection } = store.getState();

    expect(getProjectsMock).toHaveBeenCalledWith();
    expect(projectSelection.projectOptionsLoading).toEqual(false);
    expect(projectSelection.projectOptions).toMatchObject([
      {
        id: '1',
        name: 'Lorem',
      },
    ]);
  });

  it('should not set project list', async () => {
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

    await store.dispatch(fetchProjects(''));
    const { projectSelection } = store.getState();

    expect(getProjectsMock).toHaveBeenCalledWith();
    expect(projectSelection.projectOptionsLoading).toEqual(false);
    expect(projectSelection.projectOptions).toMatchObject([]);
    expect(projectSelection.projectOptionsFiltered).toMatchObject([]);
  });
});
