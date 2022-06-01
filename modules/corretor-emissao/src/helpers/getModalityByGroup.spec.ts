import {
  ModalitiesGroupEnum,
  ModalityTypeEnum,
} from '../application/types/model';
import { getModalityByGroup } from './getModalityByGroup';

describe('GetModalityByGroup Helper', () => {
  it('should return to modality by group', async () => {
    const modality = getModalityByGroup(ModalityTypeEnum.EXECUTANTE_CONSTRUTOR);

    expect(modality).toEqual(ModalitiesGroupEnum.COMMON);
  });
});
