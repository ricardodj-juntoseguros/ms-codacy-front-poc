import axios from 'axios';

import CorretorEmissao from '../../types/dto/CorretorEmissaoDTO';

async function create(corretorEmissao: CorretorEmissao) {
  return axios.post(
    'http://localhost:3333/api/corretor-emissao',
    corretorEmissao,
  );
}

export { create };
