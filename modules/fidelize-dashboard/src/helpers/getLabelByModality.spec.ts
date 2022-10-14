import { ModalityEnum } from '../application/types/model';
import { getLabelByModality } from './getLabelByModality';

describe('GetLabelByModality Helper', () => {
  it('Should get label for Modality FISCAL correctly', () => {
    const resultSingular = getLabelByModality(
      ModalityEnum.FISCAL,
      'Teste',
      false,
      false,
    );
    const resultPlural = getLabelByModality(
      ModalityEnum.FISCAL,
      'Teste',
      true,
      false,
    );
    const resultCapitalizeFirst = getLabelByModality(
      ModalityEnum.FISCAL,
      'Teste',
      true,
      true,
    );
    expect(resultSingular).toBe('Teste fiscal');
    expect(resultPlural).toBe('Teste fiscais');
    expect(resultCapitalizeFirst).toBe('Teste Fiscais');
  });

  it('Should get label for Modality TRABALHISTA correctly', () => {
    const resultSingular = getLabelByModality(
      ModalityEnum.LABOR,
      'Teste',
      false,
      false,
    );
    const resultPlural = getLabelByModality(
      ModalityEnum.LABOR,
      'Teste',
      true,
      false,
    );
    const resultCapitalizeFirst = getLabelByModality(
      ModalityEnum.LABOR,
      'Teste',
      true,
      true,
    );
    expect(resultSingular).toBe('Teste trabalhista');
    expect(resultPlural).toBe('Teste trabalhistas');
    expect(resultCapitalizeFirst).toBe('Teste Trabalhistas');
  });

  it('Should get label for Modality CIVIL correctly', () => {
    const resultSingular = getLabelByModality(
      ModalityEnum.CIVIL,
      'Teste',
      false,
      false,
    );
    const resultPlural = getLabelByModality(
      ModalityEnum.CIVIL,
      'Teste',
      true,
      false,
    );
    const resultCapitalizeFirst = getLabelByModality(
      ModalityEnum.CIVIL,
      'Teste',
      true,
      true,
    );
    expect(resultSingular).toBe('Teste cível');
    expect(resultPlural).toBe('Teste cíveis');
    expect(resultCapitalizeFirst).toBe('Teste Cíveis');
  });
});
