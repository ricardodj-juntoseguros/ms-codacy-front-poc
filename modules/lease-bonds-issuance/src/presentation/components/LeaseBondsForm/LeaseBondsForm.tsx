import React, {
  FunctionComponent,
} from 'react';
import RealStateSelection from '../RealStateSelection';

const LeaseBondsForm: FunctionComponent = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('avançou')
  };

  return (
    <form
      id="leaseBondsForm-form"
      data-testid="leaseBondsForm-form"
      onSubmit={e => handleSubmit(e)}
    >
      <RealStateSelection />
    </form>
  );
};

export default LeaseBondsForm;
