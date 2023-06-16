import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Router from 'react-router';
import  FirstAccessContainer  from './FirstAccessContainer';



describe('FirstAccessContainer component', () => {
  it('should render successfully', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ hash: 'asasasasasassa', token:'aasasaahsaushuhsa' });
    const { baseElement, getByText } = render(<FirstAccessContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Para sua segurança, precisamos que você defina uma senha.')).toBeInTheDocument();
  });
});
