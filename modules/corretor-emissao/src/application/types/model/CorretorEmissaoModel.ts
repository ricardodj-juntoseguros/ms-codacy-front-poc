import CorretorEmissaoDTO from '../dto/CorretorEmissaoDTO';

interface CorretorEmissao {
  corretorEmissao: CorretorEmissaoDTO;
  isLoading: boolean;
  error: string;
}
export default CorretorEmissao;
