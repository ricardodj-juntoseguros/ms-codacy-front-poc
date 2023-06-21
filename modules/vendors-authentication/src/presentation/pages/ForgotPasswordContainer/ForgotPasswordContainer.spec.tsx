import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Router from 'react-router';
import  ForgotPasswordContainer  from './ForgotPasswordContainer';



describe('ForgotPasswordContainer component', () => {
  it('should render successfully', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ hash: 'asasasasasassa', token:'aasasaahsaushuhsa' });
    const { baseElement, getByText } = render(<ForgotPasswordContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Crie uma nova senha.')).toBeInTheDocument();
  });
});
