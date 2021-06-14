import axios from 'axios';
import { QuoteResultDTO } from '../../types/dto/QuoteResultDTO';
import { TimeframeAndCoverageModel } from '../../types/model';

class QuoteApi {
  async generateQuote(rateData: TimeframeAndCoverageModel) {
    console.log(rateData);

    return await axios.get<QuoteResultDTO[]>(
      'http://localhost:4300/generate-quote',
    );
  }
}

const quoteApi = new QuoteApi();
export default quoteApi;
