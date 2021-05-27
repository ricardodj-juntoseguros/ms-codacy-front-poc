import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';

function CorretorEmissao() {
  return (
    <Provider store={store}>
      <h1>Hello CorretorEmissao</h1>
    </Provider>
  );
}

export default CorretorEmissao;
