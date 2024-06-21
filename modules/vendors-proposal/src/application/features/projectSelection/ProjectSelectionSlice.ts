import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { RootState } from '../../../config/store';
import { ProjectSelectionModel } from '../../types/model';
import { ProjectDTO } from '../../types/dto';
import ProjectSelectionAPI from './ProjectSelectionAPI';

export const fetchProjects = createAsyncThunk<
  ProjectDTO[],
  string,
  { rejectValue: string }
>('projectSelection/fetchProjects', async (_, { rejectWithValue }) => {
  return ProjectSelectionAPI.getProjects()
    .then(response => response)
    .catch(error => rejectWithValue(error.data.data.message));
});

const initialState: ProjectSelectionModel = {
  projectOptions: [],
  projectOptionsFiltered: [],
  projectOptionsLoading: false,
  projectSearchValue: '',
};

export const projectSelectionSlice = createSlice({
  name: 'projectSelection',
  initialState,
  reducers: {
    setProjectSearchValue: (state, action: PayloadAction<string>) => {
      state.projectSearchValue = action.payload;

      if (action.payload.length <= 0) {
        state.projectOptionsFiltered = [];
      } else {
        const name = action.payload.toString().toLowerCase();
        state.projectOptionsFiltered = state.projectOptions.filter(
          project => project.label.toLowerCase().includes(name) && project,
        );
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.projectOptionsLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectOptions = action.payload.map(project => ({
          ...project,
          label: project.name,
          value: project.id,
        }));

        state.projectOptionsLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projectOptionsLoading = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProjectSelection = (state: RootState) =>
  state.projectSelection;

export const { actions: projectSelectionActions } = projectSelectionSlice;

export default projectSelectionSlice.reducer;
