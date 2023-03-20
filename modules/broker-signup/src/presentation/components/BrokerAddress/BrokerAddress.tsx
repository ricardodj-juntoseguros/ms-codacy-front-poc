
import { useSelector } from 'react-redux';
import { InputBase } from 'junto-design-system';
import styles from './BrokerAddress.module.scss';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

export const BrokerAddress: React.FC = () => {
  const brokerInformation = useSelector(selectBroker);

  return (
    <div className={styles['broker_address_wrapper']}>
    <h1>Endereço</h1>
      <div className={styles['broker_address_grid_inputs']}>
        <div className={styles['broker_address__form-field']}>
          <InputBase
                    data-testid="broker-cep"
                    label="CEP"
                    placeholder="CEP"
                    value={brokerInformation.information.cep}
                    disabled
          />
        </div>
        <div className={styles['broker_address__form-field']}>
            <InputBase
                      data-testid="broker-uf"
                      label="UF"
                      placeholder="UF"
                      value={brokerInformation.information.uf}
                      disabled
            />
        </div>
        <div className={styles['broker_address__form-field']}>
            <InputBase
                      data-testid="broker-municipality"
                      label="Cidade"
                      placeholder="Cidade"
                      value={brokerInformation.information.city}
                      disabled
            />
       </div>
       <div className={styles['broker_address__form-field']}>
       <InputBase
                 data-testid="broker-address"
                label="Rua"
                placeholder="Rua"
                value={brokerInformation.information.address}
                disabled
			/>
      </div>
      <div className={styles['broker_address__form-field']}>
       <InputBase
                data-testid="broker-number"
                label="Número"
                placeholder="Número"
                value={brokerInformation.information.number}
                disabled
			/>
      </div>
      <div className={styles['broker_address__form-field']}>
       <InputBase
                data-testid="broker-complement"
                label="Complemento"
                placeholder="Complemento"
                value={brokerInformation.information.complement}
                disabled
			/>
      </div>
      </div>
    </div>
  );
};

export default BrokerAddress;
