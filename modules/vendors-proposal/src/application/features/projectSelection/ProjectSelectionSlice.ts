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
>(
  'projectSelection/fetchProjects',
  async (name: string, { rejectWithValue }) => {
    return ProjectSelectionAPI.getProjects(name)
      .then(response => response)
      .catch(error => rejectWithValue(error.data.data.message));
  },
);

const initialState: ProjectSelectionModel = {
  projectOptions: [],
  projectOptionsMapped: [],
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
        state.projectOptions = [];
        state.projectOptionsMapped = [];
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.projectOptionsLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectOptions = action.payload;

        state.projectOptionsMapped = action.payload.map(project => ({
          ...project,
          label: project.name,
          value: project.id.toString(),
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
