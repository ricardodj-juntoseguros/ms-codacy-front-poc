import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  InputBase,
  LinkButton,
  NumberInput,
} from 'junto-design-system';
import InsuredSelectionApi from '../../../application/features/insuredSelection/InsuredSelectionApi';
import { insuredSelectionActions } from '../../../application/features/insuredSelection/InsuredSelectionSlice';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { URL_CORREIOS_BUSCACEP } from '../../../constants';
import { mapInsuredAddressesOption, zipcodeInputMask } from '../../../helpers';
import handleError from '../../../helpers/handlerError';
import styles from './NewInsuredAddressForm.module.scss';

interface NewInsuredAddressFormProps {
  closeModalCallback: () => void;
}

const NewInsuredAddressForm: React.FC<NewInsuredAddressFormProps> = ({
  closeModalCallback,
}) => {
  const dispatch = useDispatch();
  const { insured } = useSelector(selectProposal);
  const [zipcode, setZipcode] = useState<string>();
  const [loadingZipcode, setLoadingZipcode] = useState<boolean>(false);
  const [zipcodeError, setZipcodeError] = useState<boolean>(false);
  const [city, setCity] = useState<string>();
  const [stateUf, setStateUf] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [number, setNumber] = useState<number>();
  const [complement, setComplement] = useState<string>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const submitDisabled = useMemo(() => {
    return (
      !insured ||
      !city ||
      !city.trim() ||
      !stateUf ||
      !stateUf.trim() ||
      !street ||
      !street.trim() ||
      !number
    );
  }, [city, stateUf, street, number, insured]);

  const handleChangeZipcode = (value: string) => {
    setZipcode(zipcodeInputMask(value));
  };

  const handleBlurZipcode = () => {
    if (zipcode && zipcode.length === 9) {
      setLoadingZipcode(true);
      setZipcodeError(false);
      InsuredSelectionApi.getAddressByZipcode(zipcode.replace('-', ''))
        .then(({ city, neighborhood, state, street }) => {
          setCity(city);
          setStateUf(state);
          setStreet(`${street}${neighborhood ? ` - ${neighborhood}` : ''}`);
        })
        .catch(err => {
          if (err.data && err.status && err.status === 404) {
            setZipcodeError(true);
          }
        })
        .finally(() => setLoadingZipcode(false));
    }
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!insured || !city || !stateUf || !street || !number) return;
    setLoadingSubmit(true);
    const formattedAddress = `${street}, N.º ${number}${
      complement ? `, ${complement}` : ''
    }`;
    InsuredSelectionApi.saveInsuredAddress(
      insured.insuredId,
      city,
      stateUf,
      formattedAddress,
    )
      .then(({ id, city, uf, address }) => {
        const newAddressModel = mapInsuredAddressesOption({
          addressId: id,
          city,
          state: uf,
          street: address,
        });
        dispatch(
          insuredSelectionActions.addInsuredAddressOption(newAddressModel),
        );
        dispatch(proposalActions.setInsuredAddress(newAddressModel));
      })
      .catch(error => handleError(error))
      .finally(() => {
        setLoadingSubmit(false);
        closeModalCallback();
      });
  };

  return (
    <div className={styles['new-insured-address-form__wrapper']}>
      <h1 className={styles['new-insured-address-form__title']}>
        Cadastrar novo endereço
      </h1>
      <form
        className={styles['new-insured-address-form__form']}
        onSubmit={e => handleSubmit(e)}
      >
        <div>
          <InputBase
            id="newInsuredAddressForm-zipcode-input"
            data-testid="newInsuredAddressForm-zipcode-input"
            label="CEP"
            name="zipcode"
            loading={loadingZipcode}
            value={zipcode}
            onChange={e =>
              handleChangeZipcode(e.target.value.replace(/[^\d]/, ''))
            }
            onBlur={() => handleBlurZipcode()}
          />
          <LinkButton
            id="newInsuredAddressForm-correios-linkbutton"
            data-testid="newInsuredAddressForm-correios-linkbutton"
            label="Não sei meu CEP"
            onClick={() => window.open(URL_CORREIOS_BUSCACEP, '_blank')}
          />
          {zipcodeError && (
            <Alert
              variant="error"
              text="Não conseguimos localizar o endereço através do CEP inserido. Por favor, preencha os campos a seguir com os demais dados."
            />
          )}
        </div>
        <div>
          <InputBase
            id="newInsuredAddressForm-city-input"
            data-testid="newInsuredAddressForm-city-input"
            label="Cidade"
            name="city"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <InputBase
            id="newInsuredAddressForm-uf-input"
            data-testid="newInsuredAddressForm-uf-input"
            label="UF"
            name="state"
            value={stateUf}
            onChange={e => setStateUf(e.target.value.toUpperCase())}
            maxLength={2}
          />
        </div>
        <InputBase
          id="newInsuredAddressForm-street-input"
          data-testid="newInsuredAddressForm-street-input"
          label="Endereço"
          name="street"
          value={street}
          onChange={e => setStreet(e.target.value)}
        />
        <div>
          <NumberInput
            id="newInsuredAddressForm-number-input"
            data-testid="newInsuredAddressForm-number-input"
            label="Número"
            name="number"
            value={number}
            onChange={v => setNumber(v)}
          />
          <InputBase
            id="newInsuredAddressForm-complement-input"
            data-testid="newInsuredAddressForm-complement-input"
            label="Complemento (opcional)"
            name="complement"
            value={complement}
            onChange={e => setComplement(e.target.value)}
          />
        </div>
        <div>
          <Button
            id="newInsuredAddressForm-cancel-button"
            data-testid="newInsuredAddressForm-cancel-button"
            type="button"
            variant="secondary"
            onClick={() => closeModalCallback()}
          >
            Cancelar
          </Button>
          <Button
            id="newInsuredAddressForm-submit-button"
            data-testid="newInsuredAddressForm-submit-button"
            type="submit"
            disabled={submitDisabled}
            loading={loadingSubmit}
          >
            Salvar endereço
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewInsuredAddressForm;
