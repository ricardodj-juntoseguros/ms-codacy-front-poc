import { ModalityTypeEnum } from '../application/types/model';
import { getModalityType } from './getModalityType';

describe('GetModalityType Helper', () => {
  it('should return the modality type EXECUTANTE_CONSTRUTOR', async () => {
    const modalityType = getModalityType(2);

    expect(modalityType).toEqual(ModalityTypeEnum.EXECUTANTE_CONSTRUTOR);
  });

  it('should return the modality type EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS', async () => {
    const modalityType = getModalityType(46);

    expect(modalityType).toEqual(
      ModalityTypeEnum.EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS,
    );
  });

  it('should return the modality type ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS', async () => {
    const modalityType = getModalityType(51);

    expect(modalityType).toEqual(
      ModalityTypeEnum.ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS,
    );
  });

  it('should return the modality type ADUANEIRO_TRANSITO', async () => {
    const modalityType = getModalityType(59);

    expect(modalityType).toEqual(ModalityTypeEnum.ADUANEIRO_TRANSITO);
  });

  it('should return the modality type REGISTRO_ANELL', async () => {
    const modalityType = getModalityType(48);

    expect(modalityType).toEqual(ModalityTypeEnum.REGISTRO_ANELL);
  });

  it('should return the modality type PARCELAMENTO_ADMINISTRATIVO_FISCAL', async () => {
    const modalityType = getModalityType(45);

    expect(modalityType).toEqual(
      ModalityTypeEnum.PARCELAMENTO_ADMINISTRATIVO_FISCAL,
    );
  });

  it('should return the modality type RETENCAO_DE_PAGAMENTO', async () => {
    const modalityType = getModalityType(41);

    expect(modalityType).toEqual(ModalityTypeEnum.RETENCAO_DE_PAGAMENTO);
  });

  it('should return the modality type CONTA_RESERVA', async () => {
    const modalityType = getModalityType(56);

    expect(modalityType).toEqual(ModalityTypeEnum.CONTA_RESERVA);
  });

  it('should return the modality type ADMINISTRATIVO_CREDITO_TRIBUTARIO', async () => {
    const modalityType = getModalityType(49);

    expect(modalityType).toEqual(
      ModalityTypeEnum.ADMINISTRATIVO_CREDITO_TRIBUTARIO,
    );
  });

  it('should return the modality type EXECUTANTE_CONCESSIONARIO', async () => {
    const modalityType = getModalityType(39);

    expect(modalityType).toEqual(ModalityTypeEnum.EXECUTANTE_CONCESSIONARIO);
  });

  it('should return the modality type ADIANTAMENTO_DE_PAGAMENTO', async () => {
    const modalityType = getModalityType(40);

    expect(modalityType).toEqual(ModalityTypeEnum.ADIANTAMENTO_DE_PAGAMENTO);
  });

  it('should return the modality type PROCESSO_ADMINISTRATIVO', async () => {
    const modalityType = getModalityType(61);

    expect(modalityType).toEqual(ModalityTypeEnum.PROCESSO_ADMINISTRATIVO);
  });

  it('should return the default type if it doesn t find the id received', async () => {
    const modalityType = getModalityType(9999);

    expect(modalityType).toEqual(ModalityTypeEnum.DEFAULT);
  });
});
